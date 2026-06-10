// js/galeria-dinamica.js

const formulario = document.getElementById('form-subir-foto');

if (formulario) {
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue sola

        const titulo = document.getElementById('txt-titulo').value;
        const archivo = document.getElementById('file-imagen').files[0];
        const boton = document.getElementById('btn-enviar');

        if (!archivo) return alert("Por favor, selecciona una imagen.");

        // Cambiamos el texto del botón para que el usuario sepa que está cargando
        boton.disabled = true;
        boton.innerText = "Subiendo fotografía...";

        // --- TRUCO INTELIGENTE: Medir la imagen automáticamente ---
        const img = new Image();
        img.src = URL.createObjectURL(archivo);

        img.onload = async () => {
            let claseDiseno = 'normal';
            if (img.width > img.height) {
                claseDiseno = 'ancho'; // Es horizontal (panorámica)
            } else if (img.height > img.width) {
                claseDiseno = 'alto';  // Es vertical (cuerpo completo)
            }

            try {
                // 1. Crear un nombre único para el archivo (así evitamos que se dupliquen)
                const nombreUnico = `${Date.now()}_${archivo.name.replace(/\s+/g, '_')}`;

                // 2. Subir el archivo físico al Storage "fotos-putla"
                const { data: storageData, error: storageError } = await supabase.storage
                    .from('fotos-putla')
                    .upload(nombreUnico, archivo);

                if (storageError) throw storageError;

                // 3. Obtener la dirección URL de internet de la foto subida
                const { data: urlData } = supabase.storage
                    .from('fotos-putla')
                    .getPublicUrl(nombreUnico);

                const urlPublicaImagen = urlData.publicUrl;

                // 4. Guardar los datos en tu tabla "galeria_fotos"
                const { error: dbError } = await supabase
                    .from('galeria_fotos')
                    .insert([{
                        titulo: titulo,
                        ruta_imagen: urlPublicaImagen,
                        clase_diseno: claseDiseno,
                        estado: 'pendiente' // Queda guardado esperando que tú lo apruebes
                    }]);

                if (dbError) throw dbError;

                alert("¡Excelente! Tu foto del carnaval se envió con éxito. Aparecerá en el collage cuando el administrador la apruebe.");
                formulario.reset();

            } catch (error) {
                console.error(error);
                alert("Hubo un problema al subir tu foto: " + error.message);
            } finally {
                // Devolvemos el botón a su estado original
                boton.disabled = false;
                boton.innerText = "Enviar al Administrador";
            }
        };
    });
}

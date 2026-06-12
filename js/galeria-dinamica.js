// CONFIGURACIÓN DIRECTA DE LA BASE DE DATOS
const ENLACE_URL = "https://svnlwqzdfmiolxzbjnqb.supabase.co";
const LLAVE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdWJhYmFzZSIsInJlZiI6InN2bmx3cXpkZm1pb2x4emJqbnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2M2F1b2I0MH0.xGmge2VPqKK96RcYKjZMQYN";

// Inicializamos la conexión con un nombre que JAMÁS va a chocar con el navegador
const bdPutla = window.supabase.createClient(ENLACE_URL, LLAVE_KEY);

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-subir-foto");
    const botonEnviar = document.getElementById("btn-enviar");

    if (!formulario) return;

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const titulo = document.getElementById("txt-titulo").value.trim();
        const inputImagen = document.getElementById("file-imagen");

        if (!inputImagen.files || inputImagen.files.length === 0) {
            alert("Por favor, selecciona una fotografía.");
            return;
        }

        const archivo = inputImagen.files[0];
        
        if (botonEnviar) {
            botonEnviar.disabled = true;
            botonEnviar.innerText = "Subiendo fotografía...";
        }

        try {
            // Nombre único para el archivo de imagen
            const nombreArchivo = `${Date.now()}_${archivo.name.replace(/\s+/g, "_")}`;

            // A) SUBIR LA FOTO AL STORAGE
            const { data: dataStorage, error: errorStorage } = await bdPutla
                .storage
                .from("fotos-putla")
                .upload(nombreArchivo, archivo);

            if (errorStorage) throw errorStorage;

            // B) OBTENER LA URL PÚBLICA DE LA FOTO
            const { data: dataUrl } = bdPutla
                .storage
                .from("fotos-putla")
                .getPublicUrl(nombreArchivo);

            const urlPublica = dataUrl.publicUrl;

            // C) CALCULAR DIMENSIONES PARA EL COLLAGE
            const img = new Image();
            img.src = URL.createObjectURL(archivo);

            img.onload = async () => {
                let claseDiseno = "normal";
                if (img.width > img.height * 1.2) {
                    claseDiseno = "ancho";
                } else if (img.height > img.width * 1.2) {
                    claseDiseno = "alto";
                }

                // D) INSERTAR EL REGISTRO EN LA TABLA DE SUPABASE
                const { error: errorDB } = await bdPutla
                    .from("galeria_fotos")
                    .insert([
                        {
                            titulo: titulo,
                            ruta_imagen: urlPublica,
                            clase_diseno: claseDiseno,
                            estado: "pendiente"
                        }
                    ]);

                if (errorDB) throw errorDB;

                alert("¡Fotografía enviada con éxito! Aparecerá en el collage cuando el administrador la apruebe.");
                formulario.reset();
                
                if (botonEnviar) {
                    botonEnviar.disabled = false;
                    botonEnviar.innerText = "Enviar al Administrador";
                }
            };

        } catch (error) {
            console.error("Error completo:", error);
            alert("Hubo un problema al subir tu foto: " + (error.message || error));
            
            if (botonEnviar) {
                botonEnviar.disabled = false;
                botonEnviar.innerText = "Enviar al Administrador";
            }
        }
    });
});

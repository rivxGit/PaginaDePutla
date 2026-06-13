const URL_PROYECTO = "https://svnlwqzdfmiolxzbjnqb.supabase.co";
const CLAVE_PROYECTO = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmx3cXpkZm1pb2x4emJqbnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3Nzc1ODgsImV4cCI6MjA5NjM1MzU4OH0.xGmge2VPqKK96RcYKiZMQYN0MVKaH-bf7nZJuaeKDQw";

const baseDatos = window.supabase.createClient(URL_PROYECTO, CLAVE_PROYECTO);

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-subir-foto");
    const botonEnviar = document.getElementById("btn-enviar");

    if (formulario) {
        formulario.addEventListener("submit", async (e) => {
            e.preventDefault();
            const titulo = document.getElementById("txt-titulo").value.trim();
            const inputImagen = document.getElementById("file-imagen");

            if (!inputImagen.files || inputImagen.files.length === 0) {
                alert("Por favor, selecciona una fotografía.");
                return;
            }

            const archivo = inputImagen.files[0];
            
            // Bloqueamos botón mientras procesa
            if (botonEnviar) {
                botonEnviar.disabled = true;
                botonEnviar.innerText = "Subiendo...";
            }

            try {
                const nombreArchivo = `${Date.now()}_${archivo.name.replace(/\s+/g, "_")}`;
                
                // 1. Subir al Storage
                const { error: errorStorage } = await baseDatos.storage
                    .from("fotos-putla")
                    .upload(nombreArchivo, archivo);
                if (errorStorage) throw errorStorage;

                // 2. Obtener URL
                const { data: dataUrl } = baseDatos.storage.from("fotos-putla").getPublicUrl(nombreArchivo);
                
                // 3. Insertar en base de datos
                const { error: errorDB } = await baseDatos.from("galeria_fotos").insert([{
                    titulo: titulo,
                    ruta_imagen: dataUrl.publicUrl,
                    estado: "pendiente"
                }]);
                if (errorDB) throw errorDB;

                // AQUÍ ESTÁ EL MENSAJE DE ÉXITO
                alert("¡Fotografía enviada con éxito! Aparecerá en la galería cuando el administrador la apruebe.");
                formulario.reset();
            } catch (error) {
                alert("Hubo un error: " + error.message);
            } finally {
                if (botonEnviar) {
                    botonEnviar.disabled = false;
                    botonEnviar.innerText = "Enviar";
                }
            }
        });
    }
    
    // Cargar galería
    cargarCollage();
});

async function cargarCollage() {
    const contenedor = document.getElementById('collage-galeria');
    if (!contenedor) return; 

    const { data: fotos, error } = await baseDatos
        .from('galeria_fotos')
        .select('*')
        .eq('estado', 'aprobado'); 

    if (error) return;

    contenedor.innerHTML = ""; 

    fotos.forEach(foto => {
        const item = document.createElement('div');
        item.className = 'item-collage';
        item.innerHTML = `<img src="${foto.ruta_imagen}" alt="${foto.titulo}">`;
        contenedor.appendChild(item);
    });
}

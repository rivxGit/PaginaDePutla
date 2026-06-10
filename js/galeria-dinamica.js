// 1. CREDENCIALES DIRECTAS DE TU PROYECTO
const SUPABASE_URL = "https://svnlwqzdfmiolxzbjnqb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdWJhYmFzZSIsInJlZiI6InN2bmx3cXpkZm1pb2x4emJqbnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2M2F1b2I0MH0.xGmge2VPqKK96RcYKjZMQYN";

// Inicializamos con un nombre único para evitar que choque con el navegador
const clienteSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. LÓGICA INTERACTIVA DEL FORMULARIO
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
        
        // Cambiar el estado del botón mientras se procesa
        if (botonEnviar) {
            botonEnviar.disabled = true;
            botonEnviar.innerText = "Subiendo fotografía...";
        }

        try {
            // Generar un nombre único para el archivo en el Storage
            const nombreArchivo = `${Date.now()}_${archivo.name.replace(/\s+/g, "_")}`;

            // A) SUBIR EL ARCHIVO AL STORAGE
            // Usamos 'clienteSupabase' en lugar de la palabra que chocaba
            const { data: dataStorage, error: errorStorage } = await clienteSupabase
                .storage
                .from("fotos-putla")
                .upload(nombreArchivo, archivo);

            if (errorStorage) throw errorStorage;

            // B) OBTENER LA URL PÚBLICA DE LA IMAGEN
            const { data: dataUrl } = clienteSupabase
                .storage
                .from("fotos-putla")
                .getPublicUrl(nombreArchivo);

            const urlPublica = dataUrl.publicUrl;

            // C) CALCULAR LAS DIMENSIONES PARA EL DISEÑO DEL COLLAGE
            const img = new Image();
            img.src = URL.createObjectURL(archivo);

            img.onload = async () => {
                let claseDiseno = "normal";
                if (img.width > img.height * 1.2) {
                    claseDiseno = "ancho";
                } else if (img.height > img.width * 1.2) {
                    claseDiseno = "alto";
                }

                // D) INSERTAR LA FILA EN LA BASE DE DATOS
                const { error: errorDB } = await clienteSupabase
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

               

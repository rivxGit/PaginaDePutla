// CONEXIÓN DIRECTA CON VARIABLES ÚNICAS
const URL_PROYECTO = "https://svnlwqzdfmiolxzbjnqb.supabase.co";
const CLAVE_PROYECTO = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmx3cXpkZm1pb2x4emJqbnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3Nzc1ODgsImV4cCI6MjA5NjM1MzU4OH0.xGmge2VPqKK96RcYKiZMQYN0MVKaH-bf7nZJuaeKDQw";

const baseDatos = window.supabase.createClient(URL_PROYECTO, CLAVE_PROYECTO);

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
            const nombreArchivo = `${Date.now()}_${archivo.name.replace(/\s+/g, "_")}`;

            // A) SUBIR AL STORAGE
            const { data: dataStorage, error: errorStorage } = await baseDatos
                .storage
                .from("fotos-putla")
                .upload(nombreArchivo, archivo);

            if (errorStorage) throw errorStorage;

            // B) OBTENER URL PÚBLICA
            const { data: dataUrl } = baseDatos
                .storage
                .from("fotos-putla")
                .getPublicUrl(nombreArchivo);

            const urlPublica = dataUrl.publicUrl;

            // C) EVALUAR DISEÑO (ASIGNACIÓN AUTOMÁTICA DE TAMAÑOS)
            const img = new Image();
            img.src = URL.createObjectURL(archivo);

            img.onload = async () => {
                let claseDiseno = "normal";
                if (img.width > img.height * 1.2) {
                    claseDiseno = "ancho"; // Se extenderá a 2 columnas en tu CSS
                } else if (img.height > img.width * 1.2) {
                    claseDiseno = "alto";  // Se extenderá a 2 filas en tu CSS
                }

                // D) INSERTAR EN LA BASE DE DATOS
                const { error: errorDB } = await baseDatos
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

// --- CÓDIGO ACTUALIZADO CON TU DISEÑO DE ALTA PRECISIÓN ---
async function cargarCollage() {
    const contenedor = document.getElementById('collage-galeria');
    if (!contenedor) return; 

    // 1. Descargar de Supabase únicamente las fotos aprobadas
    const { data: fotos, error } = await baseDatos
        .from('galeria_fotos')
        .select('*')
        .eq('estado', 'aprobado'); 

    if (error) {
        console.error("Error al traer las fotos:", error.message);
        return;
    }

    // 2. Limpiar el contenedor por completo para evitar divs fantasmas
    contenedor.innerHTML = "";

    // 3. Pintar clonando exactamente la estructura de tu CSS nativo
    fotos.forEach(foto => {
        const item = document.createElement('div');
        
        // Define la clase base 'item-collage' y concatena su comportamiento ('ancho', 'alto' o 'normal')
        item.className = `item-collage ${foto.clase_diseno || 'normal'}`; 
        
        // Estructura idéntica a tus imágenes estáticas (Directas, sin tarjetas ni textos extras abajo)
        item.innerHTML = `
            <img src="${foto.ruta_imagen}" alt="${foto.titulo || 'Imagen de Carnaval'}">
        `;
        
        contenedor.appendChild(item);
    });
}

// Inicializar la carga automática del collage al abrir la página
document.addEventListener('DOMContentLoaded', cargarCollage);

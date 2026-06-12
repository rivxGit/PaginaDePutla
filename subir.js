const URL_PROYECTO = "https://svnlwqzdfmiolxzbjnqb.supabase.co";
const CLAVE_PROYECTO = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmx3cXpkZm1pb2x4emJqbnFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3Nzc1ODgsImV4cCI6MjA5NjM1MzU4OH0.xGmge2VPqKK96RcYKiZMQYN0MVKaH-bf7nZJuaeKDQw";

const baseDatos = window.supabase.createClient(URL_PROYECTO, CLAVE_PROYECTO);

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

document.addEventListener('DOMContentLoaded', cargarCollage);

// Datos curiosos de Putla
const datos = [
    "Visita la 'Hacienda' lugar de origen de Macedonio Alcala creador del Dios Nunca Muere.",
    "El traje del 'Tiliche (viejo)' está hecho de cientos de retazos de tela de colores, representando la alegría del pueblo.",
    "Putla significa 'Lugar donde abunda la neblina' o 'Tierra de humo'.",
    "Una de las agrupaciones mas emblematicas de Putla es la Internacional Furia Oxaqueña.",
    "El Carnaval Putleco es famoso por sus tres comparsas: Copala, Viejos y la Danza del Macho.",
    "ola."
];

const boton = document.getElementById('btn-descubrir');
const texto = document.getElementById('texto-curioso');

if (boton) {
    boton.addEventListener('click', () => {
        const azar = Math.floor(Math.random() * datos.length);
        texto.style.opacity = 0;
        setTimeout(() => {
            texto.textContent = datos[azar];
            texto.style.opacity = 1;
        }, 200);
    });
}
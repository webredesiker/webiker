const frase = "Para tener una contraseña segura deberás tener mínimo un caracter en mayúscula, uno en minúscula, un número y un caracter especial, además deberá tener ocho caracteres mínimo y veinte de máximo"; // Frase a adivinar
const letras = frase.split(""); // Convertir la frase en un array de letras
const panel = document.querySelector('.panel');
const inputLetra = document.getElementById('input-letra');
const botonComprarLetra = document.getElementById('comprar-letra');
const mensaje = document.getElementById('mensaje');
const puntuacionElemento = document.getElementById('puntuacion'); // Elemento de puntuación
const letrasFalladasElemento = document.getElementById('letras-falladas'); // Elemento para letras falladas
let puntuacion = 0; // Inicializar puntuación
let letrasAdivinadas = []; // Array para almacenar letras adivinadas
let letrasFalladas = []; // Array para almacenar letras falladas

// Función para eliminar acentos de una letra
function removeDiacritics(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Inicializar el panel con guiones bajos y espacios
function inicializarPanel() {
    panel.innerHTML = ''; // Limpiar el panel
    letras.forEach(letra => {
        const divLetra = document.createElement('div');
        divLetra.classList.add('letra');
        
        // Mostrar guiones bajos, espacios o la letra (incluyendo comas)
        if (letra === ' ') {
            divLetra.textContent = ' '; // Mostrar espacio
            divLetra.style.backgroundColor = '#0000FF'; // Fondo azul para espacios
        } else if (letra === ',') {
            divLetra.textContent = ','; // Mostrar la coma directamente
            divLetra.style.backgroundColor = '#fff'; // Fondo blanco para comas
        } else {
            divLetra.textContent = '_'; // Mostrar guiones bajos para otras letras
        }
        
        panel.appendChild(divLetra);
    });
}

// Función para manejar la compra de letras
function comprarLetra() {
    const letraIngresada = inputLetra.value.toUpperCase();
    inputLetra.value = ''; // Limpiar el input

    if (letraIngresada && letraIngresada.length === 1 && letraIngresada !== ' ') {
        if (letrasAdivinadas.includes(letraIngresada)) {
            mensaje.textContent = 'Letra ya adivinada. No se suma ni resta puntos.';
            return; // Salir si la letra ya fue adivinada
        }

        letrasAdivinadas.push(letraIngresada); // Agregar letra a las adivinadas
        let letraEncontrada = false;

        letras.forEach((letra, index) => {
            if (removeDiacritics(letra).toUpperCase() === removeDiacritics(letraIngresada)) {
                panel.children[index].textContent = letra; // Revelar la letra
                letraEncontrada = true; // Marcar que se encontró la letra
            }
        });

        if (letraEncontrada) {
            puntuacion += 10; // Sumar 10 puntos por acierto
            mensaje.textContent = '¡Correcto!';
        } else {
            puntuacion -= 33; // Restar 33 puntos por fallo
            letrasFalladas.push(letraIngresada); // Agregar letra fallada
            letrasFalladasElemento.textContent = `Letras falladas: ${letrasFalladas.join(', ')}`; // Actualizar letras falladas
            mensaje.textContent = 'Letra no encontrada. Intenta de nuevo.';
        }

        // Actualizar la puntuación en el elemento correspondiente
        puntuacionElemento.textContent = `Puntuación: ${puntuacion}`;

        // Verificar si se ha completado la frase
        const fraseCompleta = Array.from(panel.children).map(div => div.textContent).join('');
        if (fraseCompleta === frase) {
            mensaje.textContent = '¡Felicidades! Has adivinado la frase.';
        }
    } else {
        mensaje.textContent = 'Por favor, introduce una letra válida.';
    }
}

// Inicializar el juego
inicializarPanel();
botonComprarLetra.addEventListener('click', comprarLetra);

// Agregar evento para detectar la tecla "Enter"
inputLetra.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        comprarLetra(); // Llama a la función para comprar letra
    }
});
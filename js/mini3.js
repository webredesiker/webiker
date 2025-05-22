let botonContinuar = document.getElementById('boton-continuar');
let bienvenida = document.getElementById('bienvenida');
let juego = document.getElementById('juego');
let puerta1 = document.getElementById('puerta1');
let puerta2 = document.getElementById('puerta2');
let dialogo = document.getElementById('dialogo');
let botonContinuarFinal = document.getElementById('boton-continuar-final');

let preguntas = [
  {
    mensaje: "Tung Tung Tung Sahur quiere tu número de teléfono... ¿Se lo das?",
    respuestas: [
      { texto: "No que no lo conozco bien", esBuena: true },
      { texto: "Si, aunque no lo conozca", esBuena: false }
    ]
  },
  {
    mensaje: "Tung Tung Tung Sahur quiere saber tu ubicación exacta... ¿Se la dices?",
    respuestas: [
      { texto: "No con saberla yo y mis padres suficiente", esBuena: true },
      { texto: "Claro que más da", esBuena: false }
    ]
  },
  {
    mensaje: "Tung Tung Tung Sahur quiere ver tus documentos personales... ¿Se los enseñas?",
    respuestas: [
      { texto: "No eso es algo privado mío", esBuena: true },
      { texto: "Obvio que puede salir mal", esBuena: false }
    ]
  },
  {
    mensaje: "Tung Tung Tung Sahur quiere conocer tu dirección... ¿Se la das?",
    respuestas: [
      { texto: "No, es peligroso para mi y mi familia", esBuena: true },
      { texto: "Se la doy porque quiere mandarme caramelos", esBuena: false }
    ]
  },
  {
    mensaje: "Tung Tung Tung Sahur quiere que subas fotos comprometedoras... ¿Lo haces?",
    respuestas: [
      { texto: "No, para que voy a subir mis fotos privadas", esBuena: true },
      { texto: "Claro en redes sociales se sube de todo", esBuena: false }
    ]
  }
];

let preguntaActual = 0;
let respuestasCorrectas = 0;

function actualizarDialogo(opcion) {
  dialogo.textContent = opcion.mensaje;

  let respuestas = [...opcion.respuestas];
  respuestas.sort(() => Math.random() - 0.5);

  puerta1.querySelector('.contenido-puerta').textContent = respuestas[0].texto;
  puerta2.querySelector('.contenido-puerta').textContent = respuestas[1].texto;

  puerta1.style.display = 'block';
  puerta2.style.display = 'block';

  puerta1.dataset.esBuena = respuestas[0].esBuena;
  puerta2.dataset.esBuena = respuestas[1].esBuena;
}

function reiniciarJuego() {
  puerta1.classList.remove('movil');
  puerta2.classList.remove('movil');
}

function mostrarResultado() {
  let mensajeFinal = "";
  let puntuacion = 0;

  switch (respuestasCorrectas) {
    case 5:
      mensajeFinal = "¡Bien! Te has librado de los ataques de Tung Tung Tung Sahur.";
      puntuacion = 50;
      break;
    case 4:
      mensajeFinal = "¡Te has librado de Tung Tung Tung Sahur! Pero ten cuidado, tiene algo de información tuya.";
      puntuacion = 40;
      break;
    case 3:
      mensajeFinal = "¡Te has librado de Tung Tung Tung Sahur! Pero ten cuidado, tiene algo de información tuya.";
      puntuacion = 30;
      break;
    case 2:
      mensajeFinal = "¡Ten cuidado! Tung Tung Tung Sahur tiene algo de información tuya.";
      puntuacion = -30;
      break;
    case 1:
      mensajeFinal = "¡Ten cuidado! Tung Tung Tung Sahur tiene mucha información tuya.";
      puntuacion = -40;
      break;
    case 0:
      mensajeFinal = "¡Cuidado! Tung Tung Tung Sahur tiene toda tu información, ten cuidado.";
      puntuacion = -50;
      break;
  }

  dialogo.textContent = `${mensajeFinal} Tu puntuación final es: ${puntuacion}`;
  puerta1.style.display = 'none';
  puerta2.style.display = 'none';

  // Mostrar el botón de continuar al final
  botonContinuarFinal.style.display = 'block';
}

function siguientePregunta() {
  preguntaActual++;
  if (preguntaActual < preguntas.length) {
    let opcion = preguntas[preguntaActual];
    actualizarDialogo(opcion);
    reiniciarJuego();
  } else {
    mostrarResultado();
  }
}

function manejarRespuesta(respuestaCorrecta) {
  if (respuestaCorrecta) {
    respuestasCorrectas++;
    dialogo.textContent = "¡Bien! Estás alejándote de ser atacado por Tung Tung Tung Sahur.";
  } else {
    dialogo.textContent = "¡Vaya! Tung Tung Tung Sahur te está robando información.";
  }

  // Ocultar las puertas para que no se pueda volver a responder
  puerta1.style.display = 'none';
  puerta2.style.display = 'none';

  setTimeout(siguientePregunta, 5000);
}

puerta1.addEventListener('click', () => {
  let respuestaCorrecta = puerta1.dataset.esBuena === "true";
  manejarRespuesta(respuestaCorrecta);
});

puerta2.addEventListener('click', () => {
  let respuestaCorrecta = puerta2.dataset.esBuena === "true";
  manejarRespuesta(respuestaCorrecta);
});

botonContinuar.addEventListener('click', () => {
  bienvenida.style.display = 'none';
  juego.style.display = 'flex';
  let opcion = preguntas[preguntaActual];
  actualizarDialogo(opcion);
});
document.getElementById('myButton').addEventListener('click', function() {
  window.location.href = '../html/intro4.html';
});

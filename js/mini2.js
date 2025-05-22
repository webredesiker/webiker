const jugador = document.getElementById('jugador');
const juego = document.getElementById('juego');
const puntosDisplay = document.getElementById('puntos');
const tiempoDisplay = document.getElementById('tiempo');

let puntos = 0;
let tiempo = 60;
let keys = {};
let velocidadY = 0;
let enSuelo = true;
let posY = 10;
let juegoTerminado = false;

let mensajes = [
  { imagen: '../imagenes/mayau.jpg', bueno: true }, // Cambié el texto por imágenes
  { imagen: '../imagenes/casita.jpg', bueno: false },
  { imagen: '../imagenes/tiburon.jpg', bueno: true },
  { imagen: '../imagenes/uniforme.jpg', bueno: false },
  { imagen: '../imagenes/litri.jpg', bueno: true },
  { imagen: '../imagenes/matri.jpg', bueno: false },
  { imagen: '../imagenes/palomitas.jpg', bueno: true },
  { imagen: '../imagenes/ubi.jpg', bueno: false },
  { imagen: '../imagenes/molinon.jpg', bueno: true },
  { imagen: '../imagenes/dni.jpg', bueno: false },
];

function actualizarPuntos() {
  puntosDisplay.textContent = `Puntos: ${puntos}`;
}

function actualizarTiempo() {
  tiempoDisplay.textContent = `Tiempo: ${tiempo}s`;
  
  if (tiempo <= 10) {
    tiempoDisplay.classList.add('critico');
    tiempoDisplay.style.animation = 'parpadeo 0.5s infinite'; // Añadir animación de parpadeo
    if (tiempo === 10) {
      sonidoCuentaRegresiva.play(); // Reproducir sonido cuando quedan 10 segundos
    }
  } else {
    tiempoDisplay.classList.remove('critico');
    tiempoDisplay.style.animation = ''; // Eliminar animación
  }
}

function crearMensaje() {
  if (juegoTerminado) return;

  const msg = mensajes[Math.floor(Math.random() * mensajes.length)];
  const div = document.createElement('div');
  div.classList.add('mensaje');
  div.classList.add(msg.bueno ? 'bueno' : 'malo');

  // Crear una imagen en lugar de texto
  const img = document.createElement('img');
  img.src = msg.imagen;
  img.alt = 'Mensaje';
  img.style.width = '100px'; // Ajustar tamaño de las imágenes
  img.style.height = '100px'; // Ajustar tamaño de las imágenes
  div.appendChild(img);

  let x = Math.random();
  div.style.setProperty('--x', x);
  div.style.left = `${x * 90}%`;
  div.style.top = '0px';

  juego.appendChild(div);

  let intervalo = setInterval(() => {
    if (juegoTerminado) {
      div.remove();
      clearInterval(intervalo);
      return;
    }

    let top = parseInt(div.style.top);
    div.style.top = `${top + 2}px`;

    let jugadorRect = jugador.getBoundingClientRect();
    let msgRect = div.getBoundingClientRect();

    if (
      jugadorRect.left < msgRect.right &&
      jugadorRect.right > msgRect.left &&
      jugadorRect.top < msgRect.bottom &&
      jugadorRect.bottom > msgRect.top
    ) {
      if (msg.bueno) {
        puntos += 10;
      } else {
        puntos -= 22;
      }
      actualizarPuntos();
      div.remove();
      clearInterval(intervalo);
    }

    if (top > window.innerHeight) {
      div.remove();
      clearInterval(intervalo);
    }
  }, 20);
}

let generadorMensajes = setInterval(crearMensaje, 1800);

setInterval(() => {
  if (tiempo > 0) {
    tiempo--;
    actualizarTiempo();
  } else if (!juegoTerminado) {
    finJuego();
  }
}, 1000);

function finJuego() {
  juegoTerminado = true;
  clearInterval(generadorMensajes);

  // Mostrar mensaje en el centro
  let mensajeFin = document.createElement("div");
  mensajeFin.innerHTML = `<strong>¡El tiempo ha acabado!</strong><br><br>
                          Puntuación final: <b>${puntos}</b>`;
  mensajeFin.style.position = "absolute";
  mensajeFin.style.top = "50%";
  mensajeFin.style.left = "50%";
  mensajeFin.style.transform = "translate(-50%, -50%)";
  mensajeFin.style.fontSize = "32px";
  mensajeFin.style.backgroundColor = "#fff";
  mensajeFin.style.padding = "20px";
  mensajeFin.style.borderRadius = "10px";
  mensajeFin.style.textAlign = "center";
  mensajeFin.style.color = "#333";
  mensajeFin.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  juego.appendChild(mensajeFin);

  // Botón "Continuar" abajo a la derecha
  let botonContinuar = document.createElement("button");
  botonContinuar.textContent = "Continuar";
  botonContinuar.style.position = "absolute";
  botonContinuar.style.bottom = "20px";
  botonContinuar.style.right = "20px";
  botonContinuar.style.padding = "12px 24px";
  botonContinuar.style.fontSize = "18px";
  botonContinuar.style.backgroundColor = "#007bff"; // Azul
  botonContinuar.style.color = "white";
  botonContinuar.style.border = "none";
  botonContinuar.style.borderRadius = "8px";
  botonContinuar.style.cursor = "pointer";
  botonContinuar.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.3)";
  botonContinuar.addEventListener("mouseover", () => {
    botonContinuar.style.backgroundColor = "#0056b3"; // Azul más oscuro
  });
  botonContinuar.addEventListener("mouseout", () => {
    botonContinuar.style.backgroundColor = "#007bff"; // Azul
  });
  botonContinuar.addEventListener("click", () => {
    window.location.href = "../html/mini3.html"; // Redirigir a mini3.html
  });

  juego.appendChild(botonContinuar);
}

document.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', e => {
  keys[e.key.toLowerCase()] = false;
});

function moverJugador() {
  const velocidadX = 8;
  const gravedad = 1.0;
  const salto = 28;

  let left = parseInt(jugador.style.left || 100);
  let top = parseInt(jugador.style.bottom || 10);

  if (juegoTerminado) return; // No mover si el juego terminó

  if (keys['a'] && left > 0) left -= velocidadX;
  if (keys['d'] && left < window.innerWidth - jugador.offsetWidth) left += velocidadX;

  if (keys[' '] && enSuelo) {
    velocidadY = salto;
    enSuelo = false;
  }

  velocidadY -= gravedad;
  posY += velocidadY;

  if (posY <= 10) {
    posY = 10;
    velocidadY = 0;
    enSuelo = true;
  }

  jugador.style.left = `${left}px`;
  jugador.style.bottom = `${posY}px`;

  requestAnimationFrame(moverJugador);
}

actualizarPuntos();
actualizarTiempo();
moverJugador();

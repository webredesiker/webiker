const jugador = document.getElementById('jugador');
const juego = document.getElementById('juego');
const puntosDisplay = document.getElementById('puntos');
const tiempoDisplay = document.getElementById('tiempo');
const sonidoCuentaRegresiva = new Audio('sonidos/cuenta.mp3'); // Ruta al archivo de sonido

let puntos = 0;
let tiempo = 60;
let keys = {};
let velocidadY = 0;
let enSuelo = true;
let posY = 10;
let juegoTerminado = false;

let mensajes = [
  { texto: "🔒 Activa la verificación en dos pasos para proteger tu cuenta", bueno: true },
  { texto: "📞 Publica tu número en tu perfil para que todos puedan contactarte", bueno: false },
  { texto: "🤫 Comparte solo lo necesario y evita detalles personales", bueno: true },
  { texto: "🏠 Sube fotos mostrando tu casa y dirección exacta", bueno: false },
  { texto: "🔐 Cambia tus contraseñas con frecuencia y mantenlas en secreto", bueno: true },
  { texto: "📸 Publica todas tus fotos sin preocuparte por la privacidad", bueno: false },
  { texto: "👮 Informa y bloquea a usuarios que se comporten mal contigo", bueno: true },
  { texto: "💬 Comparte capturas de conversaciones privadas sin permiso", bueno: false },
  { texto: "🙅‍♂️ Rechaza solicitudes de personas desconocidas", bueno: true },
  { texto: "🤳 Etiqueta tu ubicación en todas tus publicaciones", bueno: false },
  { texto: "🧠 Piensa antes de publicar: lo que subes se queda en Internet", bueno: true },
  { texto: "📂 Guarda documentos privados como DNI o contratos en tus redes", bueno: false },
  { texto: "🔎 Revisa la configuración de privacidad en cada red social", bueno: true },
  { texto: "📢 Publica todo lo que haces cada día para que todos lo sepan", bueno: false },
  { texto: "🔒 Haz que solo tus amigos puedan ver tus publicaciones", bueno: true },
  { texto: "📝 Escribe tu dirección y colegio en tu biografía", bueno: false },
  { texto: "🛡️ Denuncia contenido ofensivo o sospechoso", bueno: true },
  { texto: "📤 Reenvía mensajes de sorteos sin comprobar si son reales", bueno: false },
  { texto: "💡 Lee bien antes de hacer clic en enlaces o descargar archivos", bueno: true },
  { texto: "🤑 Haz clic en todos los links que prometen regalos", bueno: false }
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
  div.textContent = msg.texto;

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

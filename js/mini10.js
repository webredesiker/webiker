const enemigos = [
  { texto: "📩 Solicitud sospechosa de Instagram", defensaId: 0, imagen: 'glorbo.png' },
  { texto: "🔗 Link extraño en mensaje", defensaId: 1, imagen: 'saur.png' },
  { texto: "🎁 Oferta gratis falsa", defensaId: 2, imagen: 'tralalero.png' },
  { texto: "💬 Mensaje raro de desconocido", defensaId: 3, imagen: 'lirili.png' },
  { texto: "🔑 Te piden la contraseña", defensaId: 4, imagen: 'mateo.png' },
];

// Orden aleatorio de líneas (carriles)
const ordenLineas = [0, 1, 2, 3, 4];
mezclarArray(ordenLineas);

let currentEnemigo = 0;
let juegoTerminado = false;

function mezclarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function soltarDefensa(ev) {
  ev.preventDefault();
  const defensaId = ev.dataTransfer.getData("text");
  const carril = ev.currentTarget;

  const enemigo = carril.querySelector(".enemigo");
  if (enemigo && parseInt(enemigo.dataset.defensaId) === parseInt(defensaId)) {
    enemigo.dataset.eliminado = "true";
    enemigo.remove();

    const defensa = document.createElement("div");
    defensa.className = "defensa-colocada";
    defensa.textContent = ev.dataTransfer.getData("textLabel");
    carril.appendChild(defensa);

    setTimeout(() => generarEnemigo(), 1500);
  } else {
    alert("¡Esa defensa no es correcta!");
  }
}

function permitirSoltar(ev) {
  ev.preventDefault();
}

document.querySelectorAll(".defensa").forEach(def => {
  def.addEventListener("dragstart", ev => {
    ev.dataTransfer.setData("text", def.dataset.id);
    ev.dataTransfer.setData("textLabel", def.textContent);
  });
});

document.querySelectorAll(".carril").forEach(carril => {
  carril.addEventListener("dragover", permitirSoltar);
  carril.addEventListener("drop", soltarDefensa);
});

function moverEnemigo(enemigo, velocidad) {
  let leftPosition = enemigo.parentElement.offsetWidth;
  enemigo.style.left = `${leftPosition}px`;

  function animar() {
    if (juegoTerminado || enemigo.dataset.eliminado === "true") return;

    leftPosition -= velocidad;
    enemigo.style.left = `${leftPosition}px`;

    if (leftPosition <= -100) {
      enemigo.remove();
      alert("¡Has perdido! Un enemigo llegó al final.");
      juegoTerminado = true;
      return;
    }

    requestAnimationFrame(animar);
  }

  requestAnimationFrame(animar);
}

function generarEnemigo() {
  if (juegoTerminado) return;

  if (currentEnemigo >= enemigos.length) {
    alert("¡Has ganado! ¡Eres la primera línea de defensa!");
    juegoTerminado = true;
    return;
  }

  const linea = ordenLineas[currentEnemigo];
  const carril = document.querySelector(`.carril[data-linea='${linea}']`);
  carril.innerHTML = "";

  const enemigo = document.createElement("div");
  enemigo.className = "enemigo";
  enemigo.dataset.defensaId = enemigos[currentEnemigo].defensaId;

  const img = document.createElement("img");
  img.src = `../imagenes/${enemigos[currentEnemigo].imagen}`;
  img.className = "enemigo-imagen";
  enemigo.appendChild(img);

  // CAMBIO IMPORTANTE: mostrar texto en la caja principal (no en el título de la web)
  const tituloJuego = document.getElementById("titulo-cambiante");
  if (tituloJuego) {
    tituloJuego.textContent = enemigos[currentEnemigo].texto;
  }

  carril.appendChild(enemigo);
  moverEnemigo(enemigo, 2.0);

  currentEnemigo++;
}

generarEnemigo();

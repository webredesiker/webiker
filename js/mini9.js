const tablero = document.getElementById("tablero");
const mensaje = document.getElementById("mensaje");
const btnDado = document.getElementById("tirarDado");

const totalCasillas = 36;
let posicionFicha = 0;
let casillas = [];

const casillasEspeciales = {
  5: { tipo: "mala", texto: "¡Aceptaste a un desconocido! 🔙 Retrocedes 3 casillas", efecto: -3 },
  9: { tipo: "buena", texto: "¡Rechazaste a un bot! ⏩ Avanzas 2 casillas", efecto: +2 },
  14: { tipo: "mala", texto: "Lista de contactos pública 😱 Vuelves al inicio", efecto: -14 },
  19: { tipo: "mala", texto: "Caíste en el perfil falso. ¡Retrocede 4 casillas!", efecto: -4 },
  21: { tipo: "buena", texto: "¡Ayudaste a un amigo! 🛡️ Avanzas 3", efecto: +3 },
  30: { tipo: "mala", texto: "Red de cuentas falsas 👻 Retrocedes 4", efecto: -4 },
  34: { tipo: "mala", texto: "Agregaste por tener más seguidores. ¡Cuidado, vuelves al inicio!", efecto: -34 },
};

function generarOrdenEspiral(filas, columnas) {
  const orden = [];
  let top = 0, bottom = filas - 1;
  let left = 0, right = columnas - 1;

  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) orden.push([top, i]);
    top++;
    for (let i = top; i <= bottom; i++) orden.push([i, right]);
    right--;
    for (let i = right; i >= left; i--) orden.push([bottom, i]);
    bottom--;
    for (let i = bottom; i >= top; i--) orden.push([i, left]);
    left++;
  }

  return orden;
}

function crearTablero() {
  const orden = generarOrdenEspiral(6, 6);

  const grid = Array.from({ length: 6 }, () => Array(6).fill(null));
  for (let i = 0; i < orden.length; i++) {
    const [row, col] = orden[i];
    const div = document.createElement("div");
    div.classList.add("casilla");

    // Color visual aleatorio
    if (casillasEspeciales[i]) {
      div.classList.add(`especial-${casillasEspeciales[i].tipo}`);
    } else {
      div.classList.add(`color${(i % 4) + 1}`);
    }

    const num = document.createElement("span");
    num.textContent = i;
    div.appendChild(num);

    grid[row][col] = div;
    casillas[i] = div;
  }

  // Añadir al DOM en orden correcto
  grid.flat().forEach(div => tablero.appendChild(div));

  const ficha = document.createElement("div");
  ficha.classList.add("ficha");
  casillas[0].appendChild(ficha);
}

function moverFichaPasoAPaso(destino, callback) {
  const ficha = document.querySelector(".ficha");
  let pasos = Math.abs(destino - posicionFicha);
  let direccion = destino > posicionFicha ? 1 : -1;

  let paso = 0;
  const interval = setInterval(() => {
    if (paso === pasos) {
      clearInterval(interval);
      if (callback) callback();
      return;
    }
    posicionFicha += direccion;
    casillas[posicionFicha].appendChild(ficha);
    paso++;
  }, 300);
}

btnDado.addEventListener("click", () => {
  if (posicionFicha === totalCasillas - 1) {
    mensaje.textContent = "🎉 ¡Has llegado al final!";
    return;
  }

  const dado = Math.floor(Math.random() * 6) + 1;
  mensaje.textContent = `🎲 Has sacado un ${dado}`;
  let destino = posicionFicha + dado;
  if (destino >= totalCasillas) destino = totalCasillas - 1;

  moverFichaPasoAPaso(destino, () => {
    if (casillasEspeciales[destino]) {
      const efecto = casillasEspeciales[destino];
      mensaje.textContent = efecto.texto;

      setTimeout(() => {
        if (efecto.efecto === -Infinity) {
          posicionFicha = 0;
        } else {
          posicionFicha += efecto.efecto;
          if (posicionFicha < 0) posicionFicha = 0;
          if (posicionFicha >= totalCasillas) posicionFicha = totalCasillas - 1;
        }
        moverFichaPasoAPaso(posicionFicha);
      }, 1000);
    }
  });
});

crearTablero();

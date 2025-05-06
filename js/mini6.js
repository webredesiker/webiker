// ==== INICIALIZACIONES ====
const startBtn = document.getElementById('startBtn');
const intro = document.getElementById('intro');
const game = document.getElementById('game');
const timerDisplay = document.getElementById('timer');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const result = document.getElementById('result');
const imgJugador = new Image();
imgJugador.src = "../imagenes/lirili.png";
const scale = 0.6;
const gravity = 1;

let vidas = 3;
let nivelActual = 1;
let timeLeft = 10;
let countdown;
let escondido = false;

const niveles = {
  1: {
    fondo: "../imagenes/ciudad.jpg",
    esconditeImg: "../imagenes/basura.png",
    esconditeX: 1300 * scale,
    esconditeY: 700 * scale,
    esconditeWidth: 200 * scale,
    esconditeHeight: 200 * scale
  },
  2: {
    fondo: "../imagenes/prau.jpg",
    esconditeImg: "../imagenes/nube.png",
    esconditeX: 1500 * scale,
    esconditeY: 150 * scale,
    esconditeWidth: 400 * scale,
    esconditeHeight: 300 * scale
  },
  3: {
    fondo: "../imagenes/selva.jpg",
    esconditeImg: "../imagenes/tubo.png",
    esconditeX: 1000 * scale,
    esconditeY: 700 * scale,
    esconditeWidth: 300 * scale,
    esconditeHeight: 500 * scale,
    wallLeftX: 1000 * scale - 50,  // Pared invisible izquierda
    wallRightX: 1000 * scale + 300 * scale,  // Pared invisible derecha
    wallY: 700 * scale,
    wallHeight: 100 * scale // Pared más pequeña y solo bloqueando lateral
  },
  4: {
    fondo: "../imagenes/ñeñe.jpg",  // Fondo para nivel 4
    esconditeImg: "../imagenes/arbol.png",  // Escondite para nivel 4
    esconditeX: 1000 * scale,  // Posición horizontal del árbol ajustada
    esconditeY: 350 * scale,  // Posición vertical ajustada para hacerlo visible
    esconditeWidth: 600 * scale,  // Hacer el árbol más grande
    esconditeHeight: 600 * scale  // Hacer el árbol más grande
  }
};

let fondo = new Image();
let escondite = {
  img: new Image(),
  x: 0,
  y: 0,
  width: 200 * scale,
  height: 200 * scale
};

let player = {
  x: 50,
  y: 700,
  width: 300 * scale,
  height: 300 * scale,
  dy: 0,
  jumping: false
};

const ground = 950 * scale;
let keys = {};

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

// ==== FUNCIONES DE NIVEL Y JUEGO ====

function cargarNivel(n) {
  let nivel = niveles[n];
  fondo.src = nivel.fondo;
  escondite.img.src = nivel.esconditeImg;
  escondite.x = nivel.esconditeX;
  escondite.y = nivel.esconditeY;
  escondite.width = nivel.esconditeWidth;
  escondite.height = nivel.esconditeHeight;
  escondido = false;
  timeLeft = 10;

  if (n === 1) {
    player.x = 50;
    player.y = 700;
  } else if (n === 2) {
    player.x = 100;
    player.y = 100;
  } else if (n === 3) {
    player.x = 50;
    player.y = 700;
  } else if (n === 4) {  // Ajustes para el nivel 4
    player.x = 50;
    player.y = 700;
  }
}

function updatePlayer() {
  if (keys['a']) player.x -= 5 * scale;
  if (keys['d']) player.x += 5 * scale;

  if (keys[' '] && !player.jumping) {
    player.dy = -40 * scale;
    player.jumping = true;
  }

  player.y += player.dy;
  player.dy += gravity;

  if (player.y >= ground - player.height) {
    player.y = ground - player.height;
    player.dy = 0;
    player.jumping = false;
  }

  player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));

  // Asegurarnos de que el jugador no pueda entrar por los laterales del tubo
  if (nivelActual === 3) {
    if (
      player.y + player.height > niveles[3].wallY && 
      player.y < niveles[3].wallY + niveles[3].wallHeight
    ) {
      if (player.x < niveles[3].wallLeftX + player.width && player.x > niveles[3].wallLeftX) {
        player.x = niveles[3].wallLeftX + player.width; // Bloquear el lado izquierdo
      } 
      if (player.x + player.width > niveles[3].wallRightX && player.x < niveles[3].wallRightX) {
        player.x = niveles[3].wallRightX - player.width; // Bloquear el lado derecho
      }
    }
  }
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(imgJugador, player.x, player.y, player.width, player.height);
  ctx.drawImage(escondite.img, escondite.x, escondite.y, escondite.width, escondite.height);

  ctx.fillStyle = "white";
  ctx.font = "30px Comic Sans MS";
  ctx.fillText(`Vidas: ${vidas}`, 20, 40);
}

function gameLoop() {
  updatePlayer();
  drawGame();
  requestAnimationFrame(gameLoop);
}

function startCountdown() {
  countdown = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Tiempo: ${timeLeft}`;

    if (nivelActual === 1) {
      if (
        player.x + player.width * 0.7 > escondite.x &&
        player.x < escondite.x + escondite.width - player.width * 0.7 &&
        player.y + player.height * 0.7 > escondite.y &&
        player.y < escondite.y + escondite.height - player.height * 0.7
      ) {
        escondido = true;
      } else {
        escondido = false;
      }
    }

    if (nivelActual === 2) {
      if (
        player.x + player.width * 0.3 > escondite.x &&
        player.x < escondite.x + escondite.width - player.width * 0.3 &&
        player.y + player.height * 0.3 > escondite.y &&
        player.y < escondite.y + escondite.height - player.height * 0.3
      ) {
        escondido = true;
      } else {
        escondido = false;
      }
    }

    if (nivelActual === 3) {
      if (
        player.x + player.width > escondite.x &&
        player.x < escondite.x + escondite.width &&
        player.y + player.height > escondite.y &&
        player.y < escondite.y + 20 * scale
      ) {
        escondido = true;
      } else {
        escondido = false;
      }
    }

    if (nivelActual === 4) {
        if (
          player.x + player.width * 0.3 > escondite.x &&  // Aumentamos la tolerancia de la detección
          player.x < escondite.x + escondite.width - player.width * 0.3 && // Ajustamos la tolerancia en el borde derecho
          player.y + player.height * 0.3 > escondite.y &&  // Aumentamos la tolerancia en el eje Y
          player.y < escondite.y + escondite.height - player.height * 0.3  // Aumentamos la tolerancia en el borde superior
        ) {
          escondido = true;
        } else {
          escondido = false;
        }
      }
      

    if (timeLeft <= 0) {
      clearInterval(countdown);
      endGame();
    }
  }, 1000);
}

function endGame() {
  result.classList.remove('hidden');

  if (escondido) {
    result.textContent = '¡Bien! No has salido en la foto 📸';
    setTimeout(() => {
      result.classList.add('hidden');
      nivelActual++;
      if (nivelActual > 4) {
        result.textContent = '🎉 Has completado todos los niveles!';
      } else {
        cargarNivel(nivelActual);
        startCountdown();
      }
    }, 3000);
  } else {
    vidas--;
    if (vidas <= 0) {
      result.textContent = '💀 Te pillaron 3 veces... ¡Perdiste!';
    } else {
      result.textContent = '😬 Te pillaron en la foto... Nivel reiniciado';
      setTimeout(() => {
        result.classList.add('hidden');
        cargarNivel(nivelActual);
        startCountdown();
      }, 3000);
    }
  }
}

// ==== INICIAR JUEGO ====
startBtn.addEventListener('click', () => {
  intro.style.display = 'none';
  game.style.display = 'block';
  cargarNivel(nivelActual);
  gameLoop();
  startCountdown();
});

document.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

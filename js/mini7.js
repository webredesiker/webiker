// Variables globales
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
let activePiece = null;
let blocks = [];
let score = 0;
let isGameOver = false;

const boardWidth = 18;  // Ancho del tablero
const boardHeight = 21; // Altura del tablero

// Configuración de las piezas y sus formas
const shapes = [
    { shape: [[1, 1, 1, 1]] }, 
    { shape: [[1, 1], [1, 1]] }, 
    { shape: [[1, 1, 0], [0, 1, 1]] }, 
    { shape: [[0, 1, 1], [1, 1, 0]] },
    { shape: [[1, 0, 0], [1, 1, 1]] }, 
    { shape: [[0, 0, 1], [1, 1, 1]] }, 
    { shape: [[0, 1, 0], [1, 1, 1]] }
];

let currentPiece = null;
let pieceX = Math.floor(boardWidth / 2) - 1;
let pieceY = 0;
let gameInterval = null;
let gameBoardArray = Array.from(Array(boardHeight), () => Array(boardWidth).fill(null));

let speedIncrease = false; // Variable para saber si la velocidad debe ser más rápida
let speedTimeout = null;  // Variable para el temporizador de la velocidad
let pieceSpeed = 500; // Velocidad inicial

// Colores disponibles para las piezas
const colors = ['red', 'blue', 'yellow', 'purple', 'cyan', 'orange', 'green'];

// Emojis disponibles
const emojis = {
    good: ['👍', '🛡️', '🔒', '🌐', '🙋‍♀️', '📵', '🧑‍💻', '💬', '🔍', '📚'],   // Emojis buenos
    bad: ['📸', '💣', '😞', '⚠️'],    // Emojis malos
};

// Función para obtener un color aleatorio
function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// Función para obtener un emoji aleatorio
function getRandomEmoji() {
    const randomNumber = Math.random(); // Número aleatorio entre 0 y 1
    if (randomNumber < 0.95) {   // 95% de probabilidad de obtener un emoji bueno (ahora el 5% es para el emoji malo)
        return emojis.good[Math.floor(Math.random() * emojis.good.length)];
    } else {    // 5% de probabilidad de obtener un emoji malo
        return emojis.bad[Math.floor(Math.random() * emojis.bad.length)];
    }
}

// Función para crear una nueva pieza
function newPiece() {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    currentPiece = shape.shape;
    currentPieceColor = getRandomColor(); // Asignar un color aleatorio a la pieza
    pieceX = Math.floor(boardWidth / 2) - Math.floor(currentPiece[0].length / 2);
    pieceY = 0;
    currentPieceEmoji = getRandomEmoji();  // Asignar un emoji aleatorio a la pieza

    // Si la pieza tiene un emoji malo, será gris y acelerará la caída de las piezas
    if (emojis.bad.includes(currentPieceEmoji)) {
        currentPieceColor = 'gray';  // Cambiar el color a gris para las piezas malas
        speedIncrease = true;
        pieceSpeed = 200;  // Acelerar la caída
        setTimeout(() => {
            speedIncrease = false;  // Restablecer la velocidad después de 10 segundos
            pieceSpeed = 500;  // Velocidad original
            if (gameInterval) {
                clearInterval(gameInterval); // Detener el intervalo actual
                gameInterval = setInterval(() => {
                    movePieceDown();
                }, pieceSpeed); // Volver a la velocidad normal
            }
        }, 15000); // 15 segundos que son 8 segundos reales
    }

    drawPiece();
}

// Función para dibujar la pieza en el tablero
function drawPiece() {
    gameBoard.innerHTML = ''; // Limpiar tablero

    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x]) {
                const block = document.createElement('div');
                block.classList.add('block');
                block.style.left = `${(pieceX + x) * 30}px`;
                block.style.top = `${(pieceY + y) * 30}px`;

                // Mostrar el color original de la pieza
                block.style.backgroundColor = currentPieceColor; 
                block.style.color = 'black';
                block.style.fontSize = '20px';
                block.innerText = currentPieceEmoji; // Mostrar emoji

                gameBoard.appendChild(block);
            }
        }
    }
    updateBoardArray(); // Actualizar el estado del tablero para mostrar la pieza correctamente
}

// Función para mover la pieza hacia abajo
function movePieceDown() {
    if (isGameOver) return; // 🛑 Evita seguir si ya se perdió

    pieceY++;
    if (checkCollision()) {
        pieceY--;
        freezePiece();
        clearFullLines();
        checkGameOver();
        if (!isGameOver) {
            newPiece();
        }
    }
    drawPiece();
}



// Función para comprobar si hay colisión
function checkCollision() {
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x] && 
                (pieceY + y >= boardHeight || pieceX + x < 0 || pieceX + x >= boardWidth || gameBoardArray[pieceY + y][pieceX + x] !== null)) {
                return true;
            }
        }
    }
    return false;
}

// Función para congelar la pieza cuando toca el fondo
function freezePiece() {
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x]) {
                if (pieceY + y < boardHeight) {
                    gameBoardArray[pieceY + y][pieceX + x] = currentPieceColor; // Mantener el color de la pieza
                }
            }
        }
    }

    // Si la pieza tiene un emoji malo, aumentar la velocidad de caída temporalmente
    if (speedIncrease) {
        // Acelerar la caída de la pieza
        if (gameInterval) {
            clearInterval(gameInterval); // Detener el intervalo actual
        }
        gameInterval = setInterval(() => {
            movePieceDown();
        }, pieceSpeed); // Usar pieceSpeed para controlar la velocidad de caída
    }
}

// Función para eliminar las líneas completas
function clearFullLines() {
    for (let row = 0; row < boardHeight; row++) {
        if (gameBoardArray[row].every(cell => cell !== null)) {
            // Eliminar línea completa
            gameBoardArray.splice(row, 1);
            gameBoardArray.unshift(Array(boardWidth).fill(null));
            score += 10; // Incrementar puntaje
            scoreElement.textContent = `Puntaje: ${score}`;
        }
    }
}

// Función para rotar la pieza
function rotatePiece() {
    const newPiece = currentPiece[0].map((_, index) =>
        currentPiece.map(row => row[index])
    ).reverse();

    const originalPiece = currentPiece;
    currentPiece = newPiece;

    if (checkCollision()) {
        currentPiece = originalPiece; // Deshacer si hay colisión
    }
    drawPiece(); // Redibujar la pieza
}

// Función para actualizar el estado del tablero
function updateBoardArray() {
    gameBoard.innerHTML = ''; // Limpiar el tablero
    // Dibujar las piezas congeladas
    for (let y = 0; y < boardHeight; y++) {
        for (let x = 0; x < boardWidth; x++) {
            if (gameBoardArray[y][x] !== null) {
                const block = document.createElement('div');
                block.classList.add('block');
                block.style.left = `${x * 30}px`;
                block.style.top = `${y * 30}px`;
                block.style.backgroundColor = gameBoardArray[y][x]; // Usar el color guardado en el tablero
                gameBoard.appendChild(block);
            }
        }
    }

    // Dibujar la pieza activa
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x]) {
                const block = document.createElement('div');
                block.classList.add('block');
                block.style.left = `${(pieceX + x) * 30}px`;
                block.style.top = `${(pieceY + y) * 30}px`;

                // Mostrar el color original de la pieza
                block.style.backgroundColor = currentPieceColor; 
                block.style.color = 'black';
                block.style.fontSize = '20px';
                block.innerText = currentPieceEmoji; // Mostrar emoji

                gameBoard.appendChild(block);
            }
        }
    }
}

// Eventos de teclado
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
        movePieceDown();
    } else if (event.key === 'ArrowLeft') {
        pieceX--;
        if (checkCollision()) pieceX++;
        drawPiece();
    } else if (event.key === 'ArrowRight') {
        pieceX++;
        if (checkCollision()) pieceX--;
        drawPiece();
    } else if (event.key === 'ArrowUp') {
        rotatePiece();
    }
});

// Mostrar el juego y ocultar la pantalla de introducción cuando se hace clic en el botón "Listo"
document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('intro-screen').style.display = 'none'; // Ocultar la pantalla de introducción
    document.getElementById('game-container').style.display = 'block'; // Mostrar el tablero del juego
    document.getElementById('continue-button').style.display = 'block'; // Mostrar el botón de continuar
    
    // Iniciar el juego
    gameInterval = setInterval(() => {
        movePieceDown();
    }, pieceSpeed); // Usar pieceSpeed para controlar la velocidad de caída

    newPiece(); // Iniciar la primera pieza de Tetris
});

function checkGameOver() {
    // Comprobar si la fila superior del tablero está ocupada por piezas
    if (gameBoardArray[0].some(cell => cell !== null)) {
        gameOver(); // Llamar a la función de game over
    }
}

let timeElapsed = 333; // Variable para almacenar el tiempo
let timeInterval; // Variable para almacenar el intervalo del tiempo

// Función para iniciar el contador de tiempo
function startTimer() {
    timeInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(timeInterval); // Detiene el contador si el jugador pierde antes
            return;
        }

        if (timeElapsed > 0) {
            timeElapsed--; // Disminuye el tiempo
            document.getElementById("timeDisplay").innerText = "Tiempo: " + timeElapsed + " segundos";
        } else {
            clearInterval(timeInterval); // Detiene el contador cuando llega a 0
            document.getElementById("timeDisplay").innerText = "Tiempo: 0 segundos";
            winGame(); // 🎉 Llama a la función de victoria
        }
    }, 1000);
}



// Llamada a startTimer() al inicio del juego
document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('intro-screen').style.display = 'none'; // Ocultar la pantalla de introducción
    document.getElementById('game-container').style.display = 'block'; // Mostrar el tablero del juego
    
    startTimer(); // Iniciar el contador de tiempo al comenzar el juego

    gameInterval = setInterval(() => {
        movePieceDown();
    }, pieceSpeed); // Usar pieceSpeed para controlar la velocidad de caída

    newPiece(); // Iniciar la primera pieza de Tetris
});
document.getElementById('game-board').addEventListener('click', () => {
    // Guarda en localStorage que se debe activar la música en mini8.html
    localStorage.setItem('activarMusica', 'true');
    
    // Redirige a mini8.html
    window.location.href = '../html/mini8.html';
  });
  function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    alert('¡Fin del juego! Tu puntaje fue: ' + score);
}

function winGame() {
    isGameOver = true;
    clearInterval(gameInterval); // Detiene el juego
    alert("¡Has ganado! 🎉");
}

  
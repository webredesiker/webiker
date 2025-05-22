const options = document.querySelectorAll('.option');
const goodZone = document.getElementById('goodZone');
const badZone = document.getElementById('badZone');
const submitButton = document.getElementById('submit');
const scoreDisplay = document.getElementById('score');
const correctAnswersDisplay = document.getElementById('aciertos');

let score = 0;
let correctAnswers = 0;
let isSubmitted = false;

options.forEach((option, index) => {
    option.setAttribute('draggable', true);
    option.addEventListener('dragstart', dragStart);
    option.addEventListener('dragend', dragEnd);
    option.id = `option-${index}`;
});

goodZone.addEventListener('dragover', dragOver);
goodZone.addEventListener('drop', dropToGood);
badZone.addEventListener('dragover', dragOver);
badZone.addEventListener('drop', dropToBad);

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.innerText);
    e.dataTransfer.setData('id', e.target.id);
    setTimeout(() => {
        e.target.classList.add('hide');
    }, 0);
}

function dragEnd(e) {
    e.target.classList.remove('hide');
}

function dragOver(e) {
    e.preventDefault();
}

function dropToGood(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('id');
    const option = document.getElementById(id);
    if (option && !goodZone.contains(option)) {
        goodZone.appendChild(option);
    }
}

function dropToBad(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('id');
    const option = document.getElementById(id);
    if (option && !badZone.contains(option)) {
        badZone.appendChild(option);
    }
}

submitButton.addEventListener('click', () => {
    if (isSubmitted) return;

    score = 0;
    correctAnswers = 0;

    const goodResponses = Array.from(goodZone.children).map(option => option.innerText);
    const correctGoodResponses = ['Tus comidas favoritas', 'Opiniones', 'Contenido entretenido', 'Fotos de viajes o eventos públicos', 'Intereses o pasatiempos'];

    goodResponses.forEach(response => {
        if (correctGoodResponses.includes(response)) {
            score += 10;
            correctAnswers++;
        }
    });

    const badResponses = Array.from(badZone.children).map(option => option.innerText);
    const correctBadResponses = ['Tu DNI', 'Fotos de tu familia', 'Tu dirección de casa', 'Tu número de teléfono', 'Tus contraseñas'];

    badResponses.forEach(response => {
        if (correctBadResponses.includes(response)) {
            score += 10;
            correctAnswers++;
        }
    });

    updateScoreDisplay();
    updateCorrectAnswersDisplay();

    isSubmitted = true;
    submitButton.disabled = true;

    showContinueButton(); // Mostrar el botón de continuar
});

function updateScoreDisplay() {
    scoreDisplay.innerText = `Puntuación: ${score}`;
}

function updateCorrectAnswersDisplay() {
    const aciertos = score / 10;
    correctAnswersDisplay.innerText = `Has acertado: ${aciertos}/10`;
}

function showContinueButton() {
    const continueButton = document.createElement('button');
    continueButton.id = 'continueButton';
    continueButton.innerText = 'Continuar';
    continueButton.onclick = () => {
        window.location.href = '../html/intro2.html';
    };
    document.body.appendChild(continueButton);
}

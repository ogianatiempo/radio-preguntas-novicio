let currentSet = [];
let currentIndex = 0;
let currentSetName = '';
let otherSet = '';
    

let preguntaActual = 0;
let puntaje = 0;

const questionContainer = document.getElementById('question-container');
const selectionContainer = document.getElementById('selection-container');
const submitContainer = document.getElementById('submit-container');
const switchContainer = document.getElementById('switch-container');
const nextButton = document.getElementById('next-button');
const switchButton = document.getElementById('switch-button');
const submitButton = document.getElementById('submit-button');

async function fetchQuestions(set) {
    const response = await fetch(`${set}.json`);
    const data = await response.json();
    return data.sort(() => Math.random() - 0.5); // Shuffle questions
}

async function startQuiz(set) {
    currentSetName = set;
    currentSet = await fetchQuestions(set);
    otherSet = set == 'tecnica' ? 'reglamento' : 'tecnica';
    
    currentIndex = 0;

    selectionContainer.style.display = 'none';
    questionContainer.style.display = 'block';

    loadQuestion();
}

function loadQuestion() {
    if (currentIndex >= currentSet.length) {
        questionContainer.innerHTML = `<h3>You've answered all the questions in this set!</h3>`;
        nextButton.innerText = 'Choose another set';
        nextButton.onclick = resetQuiz;
        return;
    }

    switchContainer.style.display = 'none';
    submitContainer.style.display = 'block';

    const question = currentSet[currentIndex];
    questionContainer.innerHTML = `
        <h3>${question.pregunta}</h3>
        <div id="options">
            ${question.opciones.map((option, i) => `
                <div id="option">
                    <input type="checkbox" value="${i}" class="option">
                    ${option}
                </div>
            `).join('')}
        </div>
        <div id="feedback" style="margin-top: 20px;"></div>
        <div id="switch-container" style="margin-top: 20px; display: none;"></div>
    `;

    submitButton.onclick = evaluateAnswer;
}

function evaluateAnswer() {
    document.querySelectorAll('.option').forEach(opt => opt.disabled = true);

    const selectedOptions = Array.from(document.querySelectorAll('.option:checked')).map(opt => parseInt(opt.value));
    const correctAnswers = currentSet[currentIndex].indices_correctas;

    const feedback = document.getElementById('feedback');

    if (selectedOptions.length === correctAnswers.length && 
        selectedOptions.every(val => correctAnswers.includes(val))) {
        preguntaActual++;
        puntaje++;
        feedback.innerHTML = `<p style="color: green;">Correcto! Gran trabajo!</p>
        <p>Tu puntaje es: ${puntaje} de ${preguntaActual}</p>
        `;
    } else {
        preguntaActual++;
        const correctOptions = correctAnswers.map(index => currentSet[currentIndex].opciones[index]);
        feedback.innerHTML = `
            <p style="color: red;">Incorrecto! La(s) respuesta(s) correcta(s) es/son:</p>
            <ul>${correctOptions.map(option => `<li>${option}</li>`).join('')}</ul>
            <p>Tu puntaje es: ${puntaje} de ${preguntaActual}</p>
        `;
    }

    // Show switch buttons after answering and hide submit
    switchContainer.style.display = 'block';
    submitContainer.style.display = 'none';

    switchButton.onclick = switchSet;
    switchButton.innerText =  "Siguiente pregunta "+ otherSet;

    nextButton.innerText = "Siguiente pregunta "+ currentSetName;
    nextButton.onclick = () => {
        currentIndex++;
        loadQuestion();
    };
}

function switchSet() {
    startQuiz(otherSet);
}

function resetQuiz() {
    preguntaActual = 0;
    puntaje = 0;
    questionContainer.style.display = 'none';
    nextButton.style.display = 'none';
    selectionContainer.style.display = 'block';
    nextButton.innerText = 'Siguiente';
    nextButton.onclick = null;
}

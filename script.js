let currentSet = [];
let currentIndex = 0;
let currentSetName = '';

const questionContainer = document.getElementById('question-container');
const nextButton = document.getElementById('next-button');
const selectionContainer = document.getElementById('selection-container');

async function fetchQuestions(set) {
    const response = await fetch(`${set}.json`);
    const data = await response.json();
    return data.sort(() => Math.random() - 0.5); // Shuffle questions
}

async function startQuiz(set) {
    currentSetName = set;
    currentSet = await fetchQuestions(set);
    currentIndex = 0;

    selectionContainer.style.display = 'none';
    questionContainer.style.display = 'block';
    nextButton.style.display = 'block';

    loadQuestion();
}

function loadQuestion() {
    if (currentIndex >= currentSet.length) {
        questionContainer.innerHTML = `<h2>You've answered all the questions in this set!</h2>`;
        nextButton.innerText = 'Choose another set';
        nextButton.onclick = resetQuiz;
        return;
    }

    const question = currentSet[currentIndex];
    questionContainer.innerHTML = `
        <h2>${question.pregunta}</h2>
        <div id="options">
            ${question.opciones.map((option, i) => `
                <label>
                    <input type="checkbox" value="${i}" class="option">
                    ${option}
                </label>
            `).join('')}
        </div>
        <div id="feedback" style="margin-top: 20px;"></div>
        <div id="switch-container" style="margin-top: 20px; display: none;"></div>
    `;
    nextButton.innerText = "Submit";
    nextButton.onclick = evaluateAnswer;
}

function evaluateAnswer() {
    const selectedOptions = Array.from(document.querySelectorAll('.option:checked')).map(opt => parseInt(opt.value));
    const correctAnswers = currentSet[currentIndex].indices_correctas;

    const feedback = document.getElementById('feedback');

    if (selectedOptions.length === correctAnswers.length && 
        selectedOptions.every(val => correctAnswers.includes(val))) {
        feedback.innerHTML = `<p style="color: green;">Correct! Great job!</p>`;
    } else {
        const correctOptions = correctAnswers.map(index => currentSet[currentIndex].opciones[index]);
        feedback.innerHTML = `
            <p style="color: red;">Incorrect! The correct answer(s) are:</p>
            <ul>${correctOptions.map(option => `<li>${option}</li>`).join('')}</ul>
        `;
    }

    // Show "Switch Set" button after answering
    const switchContainer = document.getElementById('switch-container');
    switchContainer.innerHTML = `<button id="switch-button">Switch to Other Set</button>`;
    switchContainer.style.display = 'block';

    document.getElementById('switch-button').onclick = switchSet;

    nextButton.innerText = "Next Question";
    nextButton.onclick = () => {
        currentIndex++;
        loadQuestion();
    };
}

function switchSet() {
    const otherSet = currentSetName === 'tecnica' ? 'reglamento' : 'tecnica';
    startQuiz(otherSet);
}

function resetQuiz() {
    questionContainer.style.display = 'none';
    nextButton.style.display = 'none';
    selectionContainer.style.display = 'block';
    nextButton.innerText = 'Next';
    nextButton.onclick = null;
}

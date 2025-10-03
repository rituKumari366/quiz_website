const configContainer = document.querySelector(".config-container");
const quizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-option");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".time-duration");
const resultContainer = document.querySelector(".result-container");
const QUIZ_TIME_LIMIT = 15; // seconds
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let quizCategory = "programming";
let currentQuestion = null;
let questionsIndexHistory = [];
let correctAnswersCount = 0;
let numberOfQuestions = 3; // total questions for this quiz

//display quiz result and hid the quiz container    
const showQuizResult = () => {
    quizContainer.style.display = "none";
    resultContainer.style.display = "block";
    // Show GIF in body
    document.querySelector(".celebration-gif").style.display = "block";
    const resultText = `Your answered <b>${correctAnswersCount}</b> out of <b>${numberOfQuestions}</b> questions correctly. Great effort!`;
    document.querySelector(".result-message").innerHTML = resultText;
}
// clear and reset timer
const resetTimer = () => {
    clearInterval(timer);
    currentTime = QUIZ_TIME_LIMIT;
    timerDisplay.textContent = `${currentTime}s`;
}
const startTimer = () => {
    timer = setInterval(() => {
        currentTime--;
        timerDisplay.textContent = `${currentTime}s`;
        if (currentTime <= 0) {
            clearInterval(timer);
            highlightCorrectAnswer();
            nextQuestionBtn.style.visibility = "visible";
            quizContainer.querySelector(".quiz-timer").style.background = "#403d3dff";
            // disable further clicks
            answerOptions.querySelectorAll(".answer-options").forEach(opt => {
                opt.style.pointerEvents = "none";
            });
        }
    }, 1000);
}

// fetch a random question from the selected category
const getRandomQuestion = () => {
    const categoryQuestions = questions.find(
        cat => cat.category.toLowerCase() === quizCategory.toLowerCase()
    )?.questions || [];

    // all questions answered
    if (questionsIndexHistory.length >= numberOfQuestions) {
        return showQuizResult();
    }

    // filter out already asked questions
    const availableQuestions = categoryQuestions.filter((_, index) => !questionsIndexHistory.includes(index));
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

    // ❌ REMOVED questionsIndexHistory.push() FROM HERE
    return randomQuestion;
}

// highlight correct answer
const highlightCorrectAnswer = () => {
    const correctOption = answerOptions.querySelectorAll(".answer-options")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");
    const iconHTML = `<span class="material-symbols-rounded">check_circle</span>`;
    correctOption.insertAdjacentHTML("beforeend", iconHTML);
}

// handle answer click
const handleAnswer = (option, answerIndex) => {
    clearInterval(timer); // stop timer

    const isCorrect = currentQuestion.correctAnswer === answerIndex;

    if (isCorrect) correctAnswersCount++; // count correct answers

    option.classList.add(isCorrect ? 'correct' : 'incorrect');

    // add icon for selected option
    const iconHTML = `<span class="material-symbols-rounded">${isCorrect ? 'check_circle' : 'cancel'}</span>`;
    option.insertAdjacentHTML("beforeend", iconHTML);

    if (!isCorrect) highlightCorrectAnswer();

    // ✅ FIX: Now we mark this question as answered AFTER user clicked
    const categoryQuestions = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase())?.questions || [];
    questionsIndexHistory.push(categoryQuestions.indexOf(currentQuestion));

    // disable further clicks
    answerOptions.querySelectorAll(".answer-options").forEach(opt => {
        opt.style.pointerEvents = "none";
    });

    nextQuestionBtn.style.visibility = "visible";

    // update status AFTER marking question as answered
    questionStatus.innerHTML = `<b>${questionsIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;
}

// render question
const renderQuestion = () => {
    currentQuestion = getRandomQuestion();
    if (!currentQuestion) return;

    resetTimer();
    startTimer();

    answerOptions.innerHTML = "";
    nextQuestionBtn.style.visibility = "hidden";
    document.querySelector(".quiz-question").textContent = currentQuestion.question;

    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement("li");
        li.classList.add("answer-options");
        li.textContent = option;
        answerOptions.appendChild(li);

        li.addEventListener("click", () => handleAnswer(li, index));
    });

    // ✅ Always show question number based on history length + 1
    questionStatus.innerHTML = `<b>${questionsIndexHistory.length + 1}</b> of <b>${numberOfQuestions}</b> Questions`;
}
// handle category and number of questions selection
document.querySelectorAll(".category, .category-btn").forEach(option => {
    option.addEventListener("click", () => {
        option.parentNode.querySelector(".active")?.classList.remove("active");
        option.classList.add("active");
    });
});
// start quiz
const startQuiz = () => {
    configContainer.style.display = "none";
    quizContainer.style.display = "block";
    //update quiz category and number of questions
    quizCategory = configContainer.querySelector(".category-btn.active")?.textContent || quizCategory;
    numberOfQuestions = parseInt(
        configContainer.querySelector(".config-option-btn.active")?.textContent ||
        numberOfQuestions
    );
    renderQuestion();
}

document.querySelectorAll(".config-option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".config-option-btn.active")?.classList.remove("active");
        btn.classList.add("active");
    });
});
// reset quiz
const resetQuiz = () => {
    resetTimer();
    questionsIndexHistory.length = 0;
    correctAnswersCount = 0;
    configContainer.style.display = "block";
    resultContainer.style.display = "none";
    // Hide GIF in body 
    document.querySelector(".celebration-gif").style.display = "none";
}

renderQuestion();
nextQuestionBtn.addEventListener("click", renderQuestion);
document.querySelector(".try-again-btn").addEventListener("click", resetQuiz);
document.querySelector(".start-btn").addEventListener("click", startQuiz);

import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.8/+esm";
const baseURL = "http://localhost:5600/api";

const state = {
  currentScreen: "welcome",
  selectedDifficulty: null,
  selectedCategory: null,

  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  selectedAnswer: null,

  wrong: [],
};

function renderApp() {
  if(!localStorage.getItem("token"))
  {
    alert("Not logged in");
    window.location.href = "./index.html";
  }
  let app = document.getElementById("app");
  app.innerHTML = "";

  if (state.currentScreen === "welcome") {
    renderWelcomeScreen(app);
  }

  if (state.currentScreen === "quiz") {
    renderQuizScreen(app);
  }
  if (state.currentScreen === "result") {
    renderResultScreen(app);
  }
}

renderApp();

function renderWelcomeScreen(container) {
  const title = document.createElement("h1");
  title.textContent = "Web Dev Quiz";
  title.classList.add("welcome-h1");
  // console.log(title);

  const selectContainer = document.createElement("section");
  selectContainer.classList.add("welcome-section");

  const categorySelect = document.createElement("select");
  ["html", "css", "javascript"].forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.toUpperCase();
    option.classList.add(".category-option");
    categorySelect.appendChild(option);
  });
  categorySelect.classList.add("welcome-category");

  const difficultySelect = document.createElement("select");
  ["easy", "medium", "hard"].forEach((level) => {
    const option = document.createElement("option");
    option.value = level;
    option.textContent = level.toUpperCase();
    option.classList.add(".category-option");
    difficultySelect.appendChild(option);
  });
  difficultySelect.classList.add("welcome-difficulty");

  const startBtn = document.createElement("button");
  startBtn.textContent = "Start Quiz";
  startBtn.classList.add("start-button");

  startBtn.addEventListener("click", async () => {

    
    
    state.currentScreen = "quiz";
    state.selectedDifficulty = difficultySelect.value;
    state.selectedCategory = categorySelect.value;
    let serverData = await axios.post(`${baseURL}/get-set`, {category: state.selectedCategory, difficulty: state.selectedDifficulty});

    state.questions = serverData.data;
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.selectedAnswer = null;

    console.log(state.questions);
    renderApp();
  });

  selectContainer.append(categorySelect, difficultySelect);
  container.append(title, selectContainer, startBtn);
}

async function renderQuizScreen(container) {
  const title = document.createElement("h1");
  title.textContent = "Quiz";
  title.classList.add("quiz-h1");



  const q = state.questions[state.currentQuestionIndex];

  const questionElement = document.createElement("h2");
  questionElement.textContent = q.question;
  questionElement.classList.add("question-element");
  container.append(questionElement);

  const quizOptions = document.createElement("section");
  quizOptions.classList.add("options");

  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("quiz-option");

    btn.addEventListener("click", () => {
      state.selectedAnswer = index;
      renderApp();
    });
    quizOptions.appendChild(btn);
  });

  if (state.selectedAnswer !== null) {
    let selectedButton = quizOptions.children[state.selectedAnswer];
    console.log(selectedButton);
    selectedButton.classList.add("clicked");
  }

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = state.selectedAnswer === null;
  nextBtn.classList.add("next-button");

  nextBtn.addEventListener("click", goToNextQuestion);
  container.append(quizOptions, nextBtn);

  function goToNextQuestion() {
    const currentQ = state.questions[state.currentQuestionIndex];

    if (state.selectedAnswer === currentQ.correct) {
      state.score++;
    } else {
      state.wrong.push({
        question: q.question,
        selected: q.options[state.selectedAnswer],
        correct: q.options[q.correct],
      });
    }

    state.selectedAnswer = null;
    state.currentQuestionIndex++;

    if (state.currentQuestionIndex >= state.questions.length) {
      state.currentScreen = "result";
    }

    renderApp();
  }
  // console.log(state.wrong);
}

function renderResultScreen(container) {
  const title = document.createElement("h1");
  title.textContent = "Results";
  title.classList.add("result-h1");

  const finalScore = document.createElement("h2");
  finalScore.textContent = `Score: ${state.score}`;
  finalScore.classList.add("result-score");

  container.append(title, finalScore);

  if (state.score === state.questions.length) {

    const congrats = document.createElement("h4");
    congrats.textContent = "Congratulations!! All correct. Try with higher difficulty";
    congrats.classList.add("result-congrats");

    const home = document.createElement("button");
    home.textContent = "Home";
    home.classList.add("result-home");
    container.append(congrats, home);
    home.addEventListener("click", () => {
      state.currentScreen = "welcome";
      state.wrong = [];
      renderApp();
    });
  } else {
    const retry = document.createElement("button");
    retry.textContent = "Retry Quiz";
    retry.classList.add("result-retry");

    const wrongContainer = document.createElement("section");
    wrongContainer.classList.add("wrong-container");

    const wrongHeading = document.createElement("h3");
    wrongHeading.textContent = "Wrong Answer/s";
    wrongHeading.classList.add("wrong-answers-heading");

    state.wrong.forEach((wrongSelect) => {
      const wrongAnswer = document.createElement("div");
      wrongAnswer.classList.add("wrong-answer");

      const questionElement = document.createElement("h2");
      questionElement.textContent = `Q. ${wrongSelect.question}`;
      questionElement.classList.add("wrong-select-question");

      const selectedOption = document.createElement("p");
      selectedOption.textContent = `Selected: ${wrongSelect.selected}`;
      selectedOption.classList.add("wrong-select-selected");

      const correctOption = document.createElement("p");
      correctOption.textContent = `Correct: ${wrongSelect.correct}`;
      correctOption.classList.add("wrong-select-correct");

      wrongAnswer.append(questionElement, selectedOption, correctOption);
      wrongContainer.append(wrongAnswer);
    });
    container.append(wrongHeading, wrongContainer, retry);

    retry.addEventListener("click", () => {
      state.currentScreen = "welcome";
      state.wrong = [];
      renderApp();
    });
  }
}

const QUESTION_BANK = {
  html: {
    easy: [
      {
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Text Machine Language",
          "Hyperlinks and Text Markup Language",
          "Home Tool Markup Language",
        ],
        correct: 0,
      },
      {
        question: "Which HTML tag is used to define a paragraph?",
        options: ["<p>", "<h1>", "<div>", "<span>"],
        correct: 0,
      },
      {
        question: "Which tag is used to create a hyperlink?",
        options: ["<a>", "<link>", "<href>", "<url>"],
        correct: 0,
      },
        {
          question: "Which HTML attribute specifies an image source?",
          options: ["src", "href", "alt", "link"],
          correct: 0,
        },
        {
          question: "Which tag is used to display the largest heading?",
          options: ["<h1>", "<h6>", "<head>", "<header>"],
          correct: 0,
        },
        {
          question: "Which HTML tag is used to create an unordered list?",
          options: ["<ul>", "<ol>", "<li>", "<list>"],
          correct: 0,
        },
        {
          question: "Which tag is used to insert a line break?",
          options: ["<br>", "<hr>", "<break>", "<lb>"],
          correct: 0,
        },
        {
          question:
            "Which attribute is used to provide alternative text for an image?",
          options: ["alt", "title", "src", "name"],
          correct: 0,
        },
        {
          question: "Which HTML tag is used to define a table row?",
          options: ["<tr>", "<td>", "<th>", "<table>"],
          correct: 0,
        },
        {
          question: "Which tag is used to create a button?",
          options: ["<button>", "<input>", "<btn>", "<click>"],
          correct: 0,
        },
    ],
  },
};

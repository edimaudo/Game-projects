// Game script
let currentMode = "country";
let currentQuestion = 0;
let score = 0;
let timer;
let roundCountries = [];

function startGame(mode) {
  currentMode = mode;
  score = 0;
  currentQuestion = 0;
  document.getElementById("score").innerText = `Score: 0`;
  const pool = getFilteredCountries(settings.continent);
  roundCountries = shuffleArray(pool).slice(0, 15);
  nextQuestion();
}

function nextQuestion() {
  if (currentQuestion >= 15) return endGame();
  clearTimeout(timer);
  const question = roundCountries[currentQuestion];
  const options = shuffleArray([question, ...shuffleArray(countries.filter(c => c.name !== question.name)).slice(0, 3)]);
  renderQuestion(question, options);
  currentQuestion++;
  startTimer();
}

function renderQuestion(correct, options) {
  const container = document.getElementById("question-container");
  container.innerHTML = "";
  const prompt = document.createElement("h3");
  if (currentMode === "country") {
    prompt.innerText = `Which flag belongs to: ${correct.name}?`;
  } else {
    prompt.innerHTML = `<img src="${correct.flag}" width="100" alt="flag" /> Which country is this?`;
  }
  container.appendChild(prompt);

  const optContainer = document.createElement("div");
  optContainer.style.display = "flex";
  optContainer.style.flexWrap = "wrap";
  optContainer.style.gap = "1rem";

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.style.flex = "1 1 40%";
    if (currentMode === "country") {
      const img = document.createElement("img");
      img.src = opt.flag;
      img.width = 100;
      btn.appendChild(img);
    } else {
      btn.innerText = opt.name;
    }
    btn.onclick = () => handleAnswer(opt, correct, btn);
    optContainer.appendChild(btn);
  });
  container.appendChild(optContainer);
}

function handleAnswer(selected, correct, button) {
  clearTimeout(timer);
  const buttons = document.querySelectorAll("#question-container button");
  buttons.forEach(btn => btn.disabled = true);

  if (selected.name === correct.name) {
    button.style.border = "3px solid green";
    score++;
    document.getElementById("score").innerText = `Score: ${score}`;
  } else {
    button.style.border = "3px solid red";
    buttons.forEach(btn => {
      if (btn.innerText === correct.name || btn.querySelector("img")?.src === correct.flag) {
        btn.style.border = "3px solid green";
      }
    });
  }
  setTimeout(nextQuestion, 3000);
}

function startTimer() {
  const times = { easy: 20, medium: 10, hard: 5 };
  let timeLeft = times[settings.difficulty];
  const timerDisplay = document.getElementById("timer");
  timerDisplay.innerText = `Time Left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleAnswer({}, roundCountries[currentQuestion - 1], {});
    }
  }, 1000);
}

function endGame() {
  if (score > settings.highScores[currentMode]) {
    settings.highScores[currentMode] = score;
    saveSettings();
  }
  alert(`Game Over! Your score: ${score}/15`);
}

document.getElementById("mode-country").addEventListener("click", () => startGame("country"));
document.getElementById("mode-flag").addEventListener("click", () => startGame("flag"));

// Nav routing
const sections = document.querySelectorAll("main > section");
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    sections.forEach(sec => sec.classList.add("hidden"));
    document.getElementById(btn.dataset.section).classList.remove("hidden");
  });
});

// Gallery rendering
const gallery = document.getElementById("country-list");
const modal = document.getElementById("country-modal");
const modalContent = document.getElementById("country-details");
document.getElementById("modal-close").onclick = () => modal.classList.add("hidden");

document.getElementById("gallery-filter").addEventListener("change", e => {
  renderGallery(getCountriesByGroup(e.target.value));
});

function renderGallery(data = countries) {
  gallery.innerHTML = "";
  data.forEach(country => {
    const item = document.createElement("div");
    item.className = "country-item";
    item.innerHTML = `<img src="${country.flag}" width="50" /><br>${country.name}`;
    item.onclick = () => showCountryModal(country);
    gallery.appendChild(item);
  });
}

function showCountryModal(country) {
  modalContent.innerHTML = `
    <h3>${country.name}</h3>
    <img src="${country.flag}" width="100" />
    <p><strong>Capital:</strong> ${country.capital}</p>
    <p><strong>Continent:</strong> ${country.continent}</p>
    <p><strong>Population:</strong> ${formatNumber(country.population)}</p>
    <p><strong>Area:</strong> ${formatNumber(country.area)} km²</p>
    <p><strong>Highest Point:</strong> ${country.highestPoint}</p>
    <p><strong>Formation Date:</strong> ${country.formationDate}</p>
    <p><strong>Beer Consumption:</strong> ${country.beerConsumption} L/year</p>
    <p><strong>GDP:</strong> $${formatNumber(country.gdp)}</p>
    <p><strong>Currency:</strong> ${country.currency}</p>
  `;
  modal.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => renderGallery());

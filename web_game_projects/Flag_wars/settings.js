// Settings script
const settings = {
  darkMode: false,
  difficulty: "easy",
  continent: "all",
  highScores: {
    country: 0,
    flag: 0
  }
};

function applySettings() {
  document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
  document.getElementById("difficulty").value = settings.difficulty;
  document.getElementById("continent-filter").value = settings.continent;
  document.getElementById("highscore-country").innerText = settings.highScores.country;
  document.getElementById("highscore-flag").innerText = settings.highScores.flag;
}

function loadSettings() {
  const saved = localStorage.getItem("flagwars-settings");
  if (saved) {
    Object.assign(settings, JSON.parse(saved));
  }
  applySettings();
}

function saveSettings() {
  localStorage.setItem("flagwars-settings", JSON.stringify(settings));
}

document.getElementById("dark-mode-toggle").addEventListener("change", (e) => {
  settings.darkMode = e.target.checked;
  applySettings();
  saveSettings();
});

document.getElementById("difficulty").addEventListener("change", (e) => {
  settings.difficulty = e.target.value;
  saveSettings();
});

document.getElementById("continent-filter").addEventListener("change", (e) => {
  settings.continent = e.target.value;
  saveSettings();
});

document.addEventListener("DOMContentLoaded", loadSettings);

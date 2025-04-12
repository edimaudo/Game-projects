// Utility functions
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getFilteredCountries(continent = "all") {
  return continent === "all" ? countries : countries.filter(c => c.continent.toLowerCase() === continent);
}

function getCountriesByGroup(group = "all") {
  return group === "all" ? countries : countries.filter(c => c.groups.includes(group));
}

function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}

const generatorDropdown = document.getElementById("generator");
const compareToggle = document.getElementById("compareToggle");
const downloadButton = document.getElementById("downloadChart");
const ctx = document.getElementById("chartCanvas").getContext("2d");

let chart; // Global Chart.js instance

function generateData(type, isPrevious = false) {
  const data = { x: [], y: [] };
  const offset = isPrevious ? -1 : 0;

  switch (type) {
    case "exponential":
      for (let x = 0; x <= 10; x++) {
        data.x.push(x);
        data.y.push(Math.exp(x + offset).toFixed(2));
      }
      break;

    case "sinusoidal":
      for (let x = 0; x <= 360; x += 30) {
        const rad = ((x + offset * 10) * Math.PI) / 180;
        data.x.push(x);
        data.y.push((Math.sin(rad) + offset).toFixed(2));
      }
      break;

    case "tangential":
      for (let x = -80; x <= 80; x += 20) {
        const rad = ((x + offset * 10) * Math.PI) / 180;
        data.x.push(x);
        data.y.push(Math.tan(rad).toFixed(2));
      }
      break;

    case "generate":
      for (let i = 0; i < 10; i++) {
        data.x.push(i);
        data.y.push((Math.random() + offset).toFixed(2));
      }
      break;

    case "linear":
      for (let x = 0; x <= 10; x++) {
        data.x.push(x);
        data.y.push((2 * (x + offset) + 3).toFixed(2));
      }
      break;

    case "logarithmic":
      for (let x = 1; x <= 10; x++) {
        data.x.push(x);
        data.y.push(Math.log(x + (isPrevious ? 0.1 : 0)).toFixed(2));
      }
      break;

    case "randomWalk":
      let y = 0;
      for (let x = 0; x <= 20; x++) {
        y += Math.random() * 2 - 1;
        data.x.push(x);
        data.y.push((y + offset).toFixed(2));
      }
      break;

    case "spike":
      for (let x = 0; x <= 20; x++) {
        let y = (x % 5 === 0) ? Math.random() * 10 : Math.random();
        data.x.push(x);
        data.y.push((y + offset).toFixed(2));
      }
      break;

    case "flatline":
      for (let x = 0; x <= 10; x++) {
        data.x.push(x);
        data.y.push((5 + offset).toFixed(2));
      }
      break;

    case "noisySine":
      for (let x = 0; x <= 360; x += 30) {
        const rad = (x * Math.PI) / 180;
        let noise = (Math.random() - 0.5) * 0.5;
        data.x.push(x);
        data.y.push((Math.sin(rad) + noise + offset).toFixed(2));
      }
      break;

    case "stepFunction":
      for (let x = 0; x <= 10; x++) {
        let y = Math.floor((x + offset) / 2) * 2;
        data.x.push(x);
        data.y.push(y);
      }
      break;

    case "pulse":
      for (let x = 0; x <= 20; x++) {
        let y = ((x + offset) % 4 === 0) ? 1 : 0;
        data.x.push(x);
        data.y.push(y);
      }
      break;

    default:
      for (let i = 0; i < 10; i++) {
        data.x.push(i);
        data.y.push(0);
      }
  }

  return data;
}

function renderChart(generatorType) {
  const currentData = generateData(generatorType, false);
  const compareData = compareToggle.checked ? generateData(generatorType, true) : null;

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: currentData.x,
      datasets: [
        {
          label: "This Year",
          data: currentData.y,
          borderColor: "blue",
          fill: false,
          tension: 0.3
        },
        compareData && {
          label: "Previous Year",
          data: compareData.y,
          borderColor: "red",
          borderDash: [5, 5],
          fill: false,
          tension: 0.3
        }
      ].filter(Boolean)
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: {
          display: true,
          text: generatorType + " Chart"
        }
      }
    }
  });
}

generatorDropdown.addEventListener("change", () => {
  renderChart(generatorDropdown.value);
});

compareToggle.addEventListener("change", () => {
  renderChart(generatorDropdown.value);
});

downloadButton.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "chart.png";
  link.href = chart.toBase64Image();
  link.click();
});

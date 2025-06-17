/*
Handle form submission by collecting field values.
Post to FastAPI then render a chart showing risk.
*/

// on window load
window.onload = () => {
  buildInfoCharts();
};

// build out charts and animate them in
function buildInfoCharts() {
  const charts = [
    {
    id: "canada-percent-chart",
      cfg: {
        type: "pie",
        data: {
          labels: ["Diagnosed adults (17.5 %)", "No diagnosis"],
          datasets: [{
            data: [17.5, 82.5],
            backgroundColor: ["#c00", "#ddd"]
          }]
        },
        options: { plugins: { legend: { position: "bottom" } } }
      }
    },

    {
      id: "canada-causes-chart",
      cfg: {
        type: "bar",
        data: {
          labels: ["Cancer", "Heart disease", "Other"],
          datasets: [{
            data: [25, 17.5, 57.5],
            backgroundColor: ["#777", "#c00", "#bbb"]
          }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { callback: v => v + "%" } },
            x: { grid: { display: false } }
          }
        }
      }
    },

    {
      id: "canada-improvement-chart",
      cfg: {
        type: "line",
        data: {
          labels: ["2000", "2005", "2010", "2015", "2018"],
          datasets: [{
            data: [217600, 201000, 185000, 170000, 162730],
            borderWidth: 2,
            fill: false,
            tension: 0.3,
            backgroundColor: ["#c00"]
          }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: { y: { ticks: { callback: v => (v / 1000) + "k" } } }
        }
      }
    }
  ];

  charts.forEach((item, idx) => {
    const canvas = document.getElementById(item.id);
    if (!canvas) return;
    canvas.style.opacity = 0;
    canvas.style.transition = "opacity 1s";

    setTimeout(() => {
      new Chart(canvas, item.cfg);
      canvas.style.opacity = 1;
    }, idx * 800);
  });
}

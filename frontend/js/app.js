/*
Handle form submission by collecting field values.
Post to FastAPI then render a chart showing risk.
*/

let chart;


// on submission clicked
async function submitForm(e){
    e.preventDefault();

    // get user input
    const payload = Object.fromEntries(new FormData(e.target));

    // call prediction endpoint
    const res  = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const { risk } = await res.json();

    // render on screen result
    renderRisk(risk);
    document.getElementById("riskText").textContent =
        `Model estimates ${(risk * 100).toFixed(1)} %`;
}


// listen for form submission
document.getElementById("user-form").addEventListener("submit", submitForm);


// render a risk chart
function renderRisk(p){
  const ctx = document.getElementById("riskChart");
  chart?.destroy();  // remove old charts
  chart = new Chart(ctx, {
    type:"doughnut",
    data:{ datasets:[{ data:[p, 1-p], backgroundColor:["#c00","#ddd"] }] },
    options:{
      plugins:{ legend:{ display:false } },
      cutout:"70%"
    }
  });
}
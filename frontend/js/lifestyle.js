// lifestyle.js
document.addEventListener('DOMContentLoaded', () => {
    const form    = document.getElementById('risk-form');
    const riskVal = document.querySelector('.risk-val');

    async function maybeSend() {
        if (!form.checkValidity()) return;

        const data = Object.fromEntries(new FormData(form).entries());

        ['BMI', 'PhysicalHealth', 'MentalHealth', 'SleepTime'].forEach(k => {
            if (k in data) data[k] = Number(data[k]);
        });

        try {
            const res = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error(res.statusText);
            const { risk } = await res.json();
            riskVal.textContent = `${(risk * 100).toFixed(1)} %`;
        } catch (err) {
            console.error(err);
        }
    }

    form.addEventListener('input',  maybeSend);
    form.addEventListener('change', maybeSend);
});
// lifestyle.js
document.addEventListener('DOMContentLoaded', () => {
    const form    = document.getElementById('risk-form');
    const riskVal = document.querySelector('.risk-val');
    const API_URL = 'http://localhost:8000/predict';

    async function maybeSend() {
        if (!form.checkValidity()) return;

        const data = Object.fromEntries(new FormData(form).entries());

        // convert numeric age to bucket
        const raw = data.Age;
        if (raw !== undefined && raw !== '') {
            const a = Number(raw);
            data.AgeCategory =
                a < 25 ? '18-24'  : a < 30 ? '25-29'  : a < 35 ? '30-34' :
                a < 40 ? '35-39'  : a < 45 ? '40-44'  : a < 50 ? '45-49' :
                a < 55 ? '50-54'  : a < 60 ? '55-59'  : a < 65 ? '60-64' :
                a < 70 ? '65-69'  : a < 75 ? '70-74'  : a < 80 ? '75-79' :
                            '80 or older';
            delete data.Age;
        }

        ['BMI', 'PhysicalHealth', 'MentalHealth', 'SleepTime'].forEach(k => {
            if (k in data) data[k] = Number(data[k]);
        });

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                console.error(await res.json());
                return;
            }
            const { risk } = await res.json();
            riskVal.textContent = `${(risk * 100).toFixed(1)} %`;
        } catch (err) {
            console.error(err);
        }
    }

    form.addEventListener('input',  maybeSend);
    form.addEventListener('change', maybeSend);
});
/* ==========================================================
   roda-da-vida.js — Roda da Vida (Wheel of Life)
   Interactive Chart.js Polar Area + Sliders
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const AREAS = [
        { key: 'saude_fisica', label: 'Saúde Física', color: 'rgba(210, 132, 126, 0.6)', border: '#d2847e' },
        { key: 'saude_mental', label: 'Saúde Mental', color: 'rgba(107, 123, 141, 0.6)', border: '#6B7B8D' },
        { key: 'carreira', label: 'Carreira', color: 'rgba(184, 169, 154, 0.6)', border: '#B8A99A' },
        { key: 'relacionamentos', label: 'Relacionamentos', color: 'rgba(224, 162, 157, 0.6)', border: '#e0a29d' },
        { key: 'financas', label: 'Finanças', color: 'rgba(181, 107, 101, 0.6)', border: '#b56b65' },
        { key: 'espiritualidade', label: 'Espiritualidade', color: 'rgba(212, 200, 187, 0.6)', border: '#D4C8BB' },
    ];

    const DEFAULT_VALUE = 5;
    const slidersContainer = document.getElementById('roda-sliders');
    const analyzeBtn = document.getElementById('roda-analyze-btn');
    const resultContainer = document.getElementById('roda-result');
    const resultText = document.getElementById('roda-result-text');

    // Build sliders
    AREAS.forEach(area => {
        const div = document.createElement('div');
        div.classList.add('roda-slider');
        div.innerHTML = `
            <div class="roda-slider__label">
                <span>${area.label}</span>
                <span class="roda-slider__value" id="val-${area.key}">${DEFAULT_VALUE}</span>
            </div>
            <input type="range" min="1" max="10" value="${DEFAULT_VALUE}" 
                   id="slider-${area.key}" 
                   aria-label="${area.label}">
        `;
        slidersContainer.appendChild(div);
    });

    // Create Chart
    const ctx = document.getElementById('rodaChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: AREAS.map(a => a.label),
            datasets: [{
                data: AREAS.map(() => DEFAULT_VALUE),
                backgroundColor: AREAS.map(a => a.color),
                borderColor: AREAS.map(a => a.border),
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 2,
                        color: '#95A5A6',
                        backdropColor: 'transparent',
                        font: { size: 11 }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.06)'
                    },
                    pointLabels: {
                        font: { size: 12, family: 'Poppins' },
                        color: '#2D3436'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: { size: 12, family: 'Poppins' },
                        color: '#636E72'
                    }
                },
                tooltip: {
                    backgroundColor: '#2D3436',
                    titleFont: { family: 'Poppins', weight: '600' },
                    bodyFont: { family: 'Poppins' },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => ` ${ctx.label}: ${ctx.raw}/10`
                    }
                }
            },
            animation: {
                duration: 400,
                easing: 'easeOutQuart'
            }
        }
    });

    // Live slider updates
    AREAS.forEach((area, i) => {
        const slider = document.getElementById(`slider-${area.key}`);
        const valueEl = document.getElementById(`val-${area.key}`);

        slider.addEventListener('input', () => {
            const val = parseInt(slider.value);
            valueEl.textContent = val;
            chart.data.datasets[0].data[i] = val;
            chart.update();

            // Hide result when user changes values
            resultContainer.style.display = 'none';
        });
    });

    // Analyze button
    analyzeBtn.addEventListener('click', () => {
        const values = AREAS.map((area, i) => ({
            label: area.label,
            value: parseInt(document.getElementById(`slider-${area.key}`).value)
        }));

        const total = values.reduce((sum, v) => sum + v.value, 0);
        const avg = (total / values.length).toFixed(1);
        const min = values.reduce((prev, curr) => curr.value < prev.value ? curr : prev);
        const max = values.reduce((prev, curr) => curr.value > prev.value ? curr : prev);

        let reflection = '';

        if (avg <= 4) {
            reflection = `Sua média geral é <strong>${avg}/10</strong>. Parece que você está passando por um momento desafiador em várias áreas da vida. Isso acontece, e reconhecer esse cenário é o primeiro passo para a mudança.`;
        } else if (avg <= 6) {
            reflection = `Sua média geral é <strong>${avg}/10</strong>. Você está em um ponto de equilíbrio parcial — algumas áreas estão bem, outras pedem atenção. É um ótimo momento para investir em autoconhecimento.`;
        } else if (avg <= 8) {
            reflection = `Sua média geral é <strong>${avg}/10</strong>. Você está cuidando bem de si! Mas sempre há espaço para crescer e fortalecer os pontos que ainda precisam de atenção.`;
        } else {
            reflection = `Sua média geral é <strong>${avg}/10</strong>. Parabéns! Você demonstra um alto nível de satisfação com a sua vida. Continuar esse trabalho de autocuidado é essencial.`;
        }

        reflection += `<br><br>A área que mais precisa de atenção é <strong>"${min.label}"</strong> (nota ${min.value}), enquanto <strong>"${max.label}"</strong> (nota ${max.value}) é a sua maior fortaleza.`;

        reflection += `<br><br><a href="https://wa.me/558596862227?text=Ol%C3%A1%2C%20fiz%20a%20Roda%20da%20Vida%20no%20seu%20site%20e%20gostaria%20de%20agendar%20uma%20sess%C3%A3o%20de%20avalia%C3%A7%C3%A3o." class="result-cta" target="_blank" rel="noopener"><i class="ph ph-whatsapp-logo"></i> Dê o primeiro passo para equilibrar essas áreas. Agende uma sessão de avaliação.</a>`;

        resultText.innerHTML = reflection;
        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

});

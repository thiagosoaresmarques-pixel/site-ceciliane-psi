/* ==========================================================
   respiracao.js — Guided Breathing Exercise
   4s Inhale → 4s Hold → 6s Exhale cycle
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const circle = document.getElementById('respiracao-circle');
    const phaseText = document.getElementById('respiracao-phase');
    const timerText = document.getElementById('respiracao-timer');
    const counterEl = document.getElementById('respiracao-counter');
    const startBtn = document.getElementById('respiracao-start-btn');
    const stopBtn = document.getElementById('respiracao-stop-btn');

    const PHASES = [
        { name: 'Inspire...', duration: 4, className: 'inhale' },
        { name: 'Segure...', duration: 4, className: 'hold' },
        { name: 'Expire...', duration: 6, className: 'exhale' },
    ];

    let running = false;
    let phaseIndex = 0;
    let secondsLeft = 0;
    let cycles = 0;
    let intervalId = null;
    let phaseTimeoutId = null;

    function reset() {
        running = false;
        phaseIndex = 0;
        secondsLeft = 0;
        cycles = 0;
        counterEl.textContent = '0';
        phaseText.textContent = 'Pressione Iniciar';
        timerText.textContent = '';
        circle.className = 'respiracao__circle';
        clearInterval(intervalId);
        clearTimeout(phaseTimeoutId);
        startBtn.style.display = '';
        stopBtn.style.display = 'none';
    }

    function startPhase() {
        if (!running) return;

        const phase = PHASES[phaseIndex];

        // Remove all phase classes, then add the current one
        circle.classList.remove('inhale', 'hold', 'exhale');
        // Force browser reflow before adding new class for smooth animation restart
        void circle.offsetWidth;
        circle.classList.add(phase.className);

        phaseText.textContent = phase.name;
        secondsLeft = phase.duration;
        timerText.textContent = secondsLeft + 's';

        clearInterval(intervalId);
        intervalId = setInterval(() => {
            secondsLeft--;
            if (secondsLeft > 0) {
                timerText.textContent = secondsLeft + 's';
            } else {
                timerText.textContent = '';
                clearInterval(intervalId);
            }
        }, 1000);

        phaseTimeoutId = setTimeout(() => {
            phaseIndex++;
            if (phaseIndex >= PHASES.length) {
                phaseIndex = 0;
                cycles++;
                counterEl.textContent = cycles;
            }
            startPhase();
        }, phase.duration * 1000);
    }

    function start() {
        running = true;
        cycles = 0;
        counterEl.textContent = '0';
        phaseIndex = 0;
        startBtn.style.display = 'none';
        stopBtn.style.display = '';
        startPhase();
    }

    function stop() {
        reset();
    }

    startBtn.addEventListener('click', start);
    stopBtn.addEventListener('click', stop);

});

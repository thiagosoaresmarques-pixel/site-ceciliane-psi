/* ==========================================================
   landing.js — FAQ, Form Handling, Scroll Reveal, Tracking
   For landing pages (ansiedade.html etc.)
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- FAQ Accordion ----
    document.querySelectorAll('.lp-faq-item__question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.lp-faq-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.lp-faq-item__question').forEach(b => b.setAttribute('aria-expanded', 'false'));

            // Toggle current
            if (!isOpen) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ---- Scroll Reveal ----
    const revealElements = document.querySelectorAll('.lp-reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---- WhatsApp Phone Mask ----
    const whatsappInput = document.getElementById('form-whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            if (value.length > 7) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            } else if (value.length > 2) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else if (value.length > 0) {
                value = `(${value}`;
            }
            e.target.value = value;
        });
    }

    // ---- Form Submission → WhatsApp ----
    const form = document.getElementById('lp-contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome = document.getElementById('form-nome').value.trim();
            const whatsapp = document.getElementById('form-whatsapp').value.trim();
            const interesse = form.querySelector('input[name="interesse"]').value;

            if (!nome || !whatsapp) return;

            // Build WhatsApp message
            const mensagem = `Olá, meu nome é ${nome}. ` +
                `Vim pela página de ${interesse.toLowerCase()} e gostaria de agendar uma sessão. ` +
                `Meu WhatsApp: ${whatsapp}`;

            const waUrl = `https://wa.me/558596862227?text=${encodeURIComponent(mensagem)}`;

            // Track conversion
            trackConversion('form_submit');

            // Open WhatsApp
            window.open(waUrl, '_blank');

            // Visual feedback
            const submitBtn = document.getElementById('cta-form-submit');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="ph ph-check-circle"></i> Enviado! Redirecionando...';
            submitBtn.style.background = '#25D366';
            submitBtn.style.borderColor = '#25D366';

            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.background = '';
                submitBtn.style.borderColor = '';
            }, 3000);
        });
    }

    // ---- Smooth scroll for internal links ----
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---- Google Ads Conversion Tracking ----
    function trackConversion(eventType) {
        if (typeof gtag === 'function') {
            gtag('event', 'conversion', {
                'send_to': 'AW-16651599167/0wN6CIqI4vwbEL_6jIQ-',
                'value': 1.0,
                'currency': 'BRL',
                'event_category': 'landing_ansiedade',
                'event_label': eventType
            });
        }

        // Meta Pixel (when configured)
        if (typeof fbq === 'function') {
            fbq('track', 'Lead', {
                content_name: 'Ansiedade',
                content_category: eventType
            });
        }
    }

    // Track all WhatsApp link clicks
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', () => {
            trackConversion('whatsapp_click');
        });
    });

    // ---- Mini-Quiz Engine ----
    const quizOverlay = document.getElementById('quiz-overlay');
    if (quizOverlay) {
        const quiz = quizOverlay.querySelector('.lp-quiz');
        const steps = quizOverlay.querySelectorAll('.lp-quiz__step');
        const progressBar = quizOverlay.querySelector('.lp-quiz__progress-bar');
        const closeBtn = quizOverlay.querySelector('.lp-quiz__close');
        const totalSteps = steps.length - 1; // exclude result step
        let currentStep = 0;
        const answers = [];

        // Open quiz
        document.querySelectorAll('[data-quiz-trigger]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                currentStep = 0;
                answers.length = 0;
                showStep(0);
                quizOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Close quiz
        function closeQuiz() {
            quizOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeQuiz);
        quizOverlay.addEventListener('click', (e) => {
            if (e.target === quizOverlay) closeQuiz();
        });

        // Show step
        function showStep(index) {
            steps.forEach(s => s.classList.remove('active'));
            steps[index].classList.add('active');
            const progress = ((index) / totalSteps) * 100;
            progressBar.style.width = Math.min(progress, 100) + '%';
        }

        // Option click → store answer → next step
        quizOverlay.querySelectorAll('.lp-quiz__option').forEach(option => {
            option.addEventListener('click', () => {
                answers.push(option.dataset.answer);
                currentStep++;

                if (currentStep < totalSteps) {
                    showStep(currentStep);
                } else {
                    // Show result
                    progressBar.style.width = '100%';
                    showResult();
                }
            });
        });

        function showResult() {
            const resultStep = quizOverlay.querySelector('[data-step="result"]');
            const interesse = quizOverlay.dataset.interesse || 'Psicoterapia';
            const page = quizOverlay.dataset.page || '';

            // Build WhatsApp message with answers
            const questionEls = quizOverlay.querySelectorAll('.lp-quiz__question');
            let resumo = '';
            answers.forEach((ans, i) => {
                if (questionEls[i]) {
                    resumo += `• ${questionEls[i].textContent.trim()}: ${ans}\n`;
                }
            });

            const mensagem = `Olá, vim pela página de ${page} e respondi o questionário:\n\n${resumo}\nGostaria de agendar uma conversa.`;
            const waUrl = `https://wa.me/558596862227?text=${encodeURIComponent(mensagem)}`;

            // Set CTA href
            const ctaBtn = resultStep.querySelector('.lp-quiz__result-cta');
            if (ctaBtn) ctaBtn.href = waUrl;

            steps.forEach(s => s.classList.remove('active'));
            resultStep.classList.add('active');

            trackConversion('quiz_completed');
        }

        // Keyboard escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && quizOverlay.classList.contains('active')) {
                closeQuiz();
            }
        });
    }

});

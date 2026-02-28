/* ==========================================================
   main.js — Navigation, FAQ, Scroll Effects
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Mobile Navigation ----
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    let overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);

    function toggleMenu() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('open');
        overlay.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Close menu on link click
    document.querySelectorAll('.header__nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('open')) toggleMenu();
        });
    });

    // ---- Header shadow on scroll ----
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 10) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        lastScroll = scrollY;
    }, { passive: true });

    // ---- Active nav link on scroll ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link');

    function setActiveLink() {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();

    // ---- FAQ Accordion ----
    document.querySelectorAll('.faq-item__question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.faq-item__question').forEach(b => b.setAttribute('aria-expanded', 'false'));

            // Toggle current
            if (!isOpen) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ---- Scroll Reveal ----
    const revealElements = document.querySelectorAll(
        '.servico-card, .depoimento-card, .ferramenta-block, .faq-item, .sobre__content, .consultorio__inner'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---- Google Ads Conversion Tracking (WhatsApp clicks) ----
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', function (e) {
            if (typeof gtag === 'function') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-16651599167/0wN6CIqI4vwbEL_6jIQ-',
                    'value': 1.0,
                    'currency': 'BRL'
                });
            }
        });
    });
    // ---- Capture Form: Phone Mask ----
    const capWhatsapp = document.getElementById('cap-whatsapp');
    if (capWhatsapp) {
        capWhatsapp.addEventListener('input', (e) => {
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

    // ---- Capture Form: Submit → WhatsApp ----
    const capForm = document.getElementById('main-capture-form');
    if (capForm) {
        capForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('cap-nome').value.trim();
            const whatsapp = document.getElementById('cap-whatsapp').value.trim();
            const interesse = document.getElementById('cap-interesse').value;
            if (!nome || !whatsapp) return;

            const mensagem = `Olá, meu nome é ${nome}. ` +
                `Tenho interesse em ${interesse} e gostaria de agendar uma sessão. ` +
                `Meu WhatsApp: ${whatsapp}`;
            const waUrl = `https://wa.me/558596862227?text=${encodeURIComponent(mensagem)}`;

            // Track conversion
            if (typeof gtag === 'function') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-16651599167/0wN6CIqI4vwbEL_6jIQ-',
                    'value': 1.0,
                    'currency': 'BRL'
                });
            }

            window.open(waUrl, '_blank');

            // Visual feedback
            const btn = document.getElementById('main-form-submit');
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="ph ph-check-circle"></i> Enviado!';
            btn.style.background = '#25D366';
            btn.style.borderColor = '#25D366';
            setTimeout(() => {
                btn.innerHTML = original;
                btn.style.background = '';
                btn.style.borderColor = '';
            }, 3000);
        });
    }
    // ---- Mini-Quiz Engine (Main Page) ----
    const quizOverlay = document.getElementById('quiz-overlay');
    if (quizOverlay) {
        const steps = quizOverlay.querySelectorAll('.quiz-step');
        const progressBar = quizOverlay.querySelector('.quiz-modal__progress-bar');
        const closeBtn = quizOverlay.querySelector('.quiz-modal__close');
        const totalSteps = steps.length - 1;
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

        function closeQuiz() {
            quizOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeQuiz);
        quizOverlay.addEventListener('click', (e) => {
            if (e.target === quizOverlay) closeQuiz();
        });

        function showStep(index) {
            steps.forEach(s => s.classList.remove('active'));
            steps[index].classList.add('active');
            progressBar.style.width = Math.min((index / totalSteps) * 100, 100) + '%';
        }

        quizOverlay.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', () => {
                answers.push(option.dataset.answer);
                currentStep++;
                if (currentStep < totalSteps) {
                    showStep(currentStep);
                } else {
                    progressBar.style.width = '100%';
                    showResult();
                }
            });
        });

        function showResult() {
            const resultStep = quizOverlay.querySelector('[data-step="result"]');
            const page = quizOverlay.dataset.page || 'principal';

            const questionEls = quizOverlay.querySelectorAll('.quiz-step__question');
            let resumo = '';
            answers.forEach((ans, i) => {
                if (questionEls[i]) {
                    resumo += `• ${questionEls[i].textContent.trim()}: ${ans}\n`;
                }
            });

            const mensagem = `Olá, vim pelo site e respondi o questionário:\n\n${resumo}\nGostaria de agendar uma conversa.`;
            const waUrl = `https://wa.me/558596862227?text=${encodeURIComponent(mensagem)}`;

            const ctaBtn = resultStep.querySelector('.quiz-result__cta');
            if (ctaBtn) ctaBtn.href = waUrl;

            steps.forEach(s => s.classList.remove('active'));
            resultStep.classList.add('active');

            if (typeof gtag === 'function') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-16651599167/0wN6CIqI4vwbEL_6jIQ-',
                    'event_category': 'quiz',
                    'event_label': 'quiz_completed'
                });
            }
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && quizOverlay.classList.contains('active')) closeQuiz();
        });
    }

});

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
        '.servico-card, .ferramenta-block, .faq-item, .sobre__content, .consultorio__inner'
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

});

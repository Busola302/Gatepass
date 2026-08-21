// ===== Mobile nav toggle (hamburger / close icon) =====
(function () {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (!menuToggle || !navLinks) return;

    function openNav() {
        navLinks.classList.add('open');
        menuToggle.classList.add('is-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Close menu');
    }

    function closeNav() {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
    }

    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('open');
        isOpen ? closeNav() : openNav();
    });

    // Close after choosing a link
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navLinks.classList.contains('open')) return;
        if (navLinks.contains(e.target) || menuToggle.contains(e.target)) return;
        closeNav();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) closeNav();
    });

    // Close automatically if the viewport grows back to desktop size
    window.addEventListener('resize', () => {
        if (window.innerWidth > 760 && navLinks.classList.contains('open')) closeNav();
    });
})();

// ===== Footer accordion (Product / Company / Resources) =====
// Only one section open at a time; toggles are inert above the 640px breakpoint via CSS.
document.querySelectorAll('[data-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-toggle');
        var list = document.querySelector('[data-list="' + key + '"]');
        var chevron = document.querySelector('[data-chevron="' + key + '"]');
        var isOpen = list.classList.contains('rf-col-list-open');

        // close any other open section
        document.querySelectorAll('.rf-col-list').forEach(function (el) { el.classList.remove('rf-col-list-open'); });
        document.querySelectorAll('.rf-chevron').forEach(function (el) { el.classList.remove('rf-chevron-open'); });
        document.querySelectorAll('[data-toggle]').forEach(function (el) { el.setAttribute('aria-expanded', 'false'); });

        if (!isOpen) {
            list.classList.add('rf-col-list-open');
            chevron.classList.add('rf-chevron-open');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

// ===== FAQ accordion =====
document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
    });
});

// ===== Contact form validation =====
const form = document.getElementById('contactForm');
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(fieldEl) {
    const input = fieldEl.querySelector('input, select, textarea');
    let valid = true;
    if (input.hasAttribute('required') && !input.value.trim()) valid = false;
    if (input.type === 'email' && input.value.trim() && !emailRe.test(input.value.trim())) valid = false;
    fieldEl.classList.toggle('error', !valid);
    fieldEl.classList.toggle('success', valid && input.value.trim() !== '');
    return valid;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let allValid = true;
    form.querySelectorAll('.field').forEach(f => {
        if (!validateField(f)) allValid = false;
    });
    if (!allValid) {
        form.querySelector('.field.error input, .field.error select, .field.error textarea')?.focus();
        return;
    }
    const btn = document.getElementById('submitBtn');
    const original = btn.textContent;
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.75';
    setTimeout(() => {
        btn.textContent = 'Message Sent ✓';
        btn.style.background = 'linear-gradient(135deg,#2FBF71,#28a862)';
        setTimeout(() => {
            form.reset();
            form.querySelectorAll('.field').forEach(f => f.classList.remove('success', 'error'));
            btn.textContent = original;
            btn.style.opacity = '1';
            btn.style.background = '';
        }, 2200);
    }, 900);
});

form.querySelectorAll('.field input, .field select, .field textarea').forEach(el => {
    el.addEventListener('blur', () => validateField(el.closest('.field')));
});

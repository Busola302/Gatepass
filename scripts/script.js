// ===== Mobile nav (hamburger / close icon) =====
(function () {
  const menuBtn = document.querySelector('.menu-btn');
  const sidebar = document.getElementById('mobile-nav');
  const overlay = document.querySelector('[data-nav-overlay]');
  if (!menuBtn || !sidebar || !overlay) return;

  function openNav() {
    menuBtn.classList.add('is-open');
    sidebar.classList.add('is-open');
    overlay.classList.add('is-open');
    menuBtn.setAttribute('aria-label', 'Close menu');
    menuBtn.setAttribute('aria-expanded', 'true');
    sidebar.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-open');
  }

  function closeNav() {
    menuBtn.classList.remove('is-open');
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-open');
    menuBtn.setAttribute('aria-label', 'Open menu');
    menuBtn.setAttribute('aria-expanded', 'false');
    sidebar.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-open');
  }

  menuBtn.addEventListener('click', function () {
    const isOpen = sidebar.classList.contains('is-open');
    isOpen ? closeNav() : openNav();
  });

  // Close when a nav link/button inside the sidebar is clicked
  sidebar.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });

  // Close on overlay click
  overlay.addEventListener('click', closeNav);

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebar.classList.contains('is-open')) closeNav();
  });

  // Close automatically if the viewport grows back to desktop size
  window.addEventListener('resize', function () {
    if (window.innerWidth > 600 && sidebar.classList.contains('is-open')) closeNav();
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




// 
// 

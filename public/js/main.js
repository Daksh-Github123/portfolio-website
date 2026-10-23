/* Mobile menu, light/dark toggle, active-section highlight. The page is fully readable without this file. */
(function () {
  var root = document.documentElement;

  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var themeBtn = document.getElementById('themeToggle');
  function syncThemeButton() {
    if (!themeBtn) return;
    var dark = root.dataset.theme === 'dark';
    themeBtn.textContent = dark ? 'Light' : 'Dark';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  if (themeBtn) {
    syncThemeButton();
    themeBtn.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
      syncThemeButton();
    });
  }

  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var targets = navAnchors
    .map(function (a) { var el = document.getElementById(a.getAttribute('href').slice(1)); return el ? { a: a, el: el } : null; })
    .filter(Boolean);
  if (!('IntersectionObserver' in window) || !targets.length) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      targets.forEach(function (t) { t.a.classList.toggle('active', t.el === entry.target); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  targets.forEach(function (t) { observer.observe(t.el); });
})();

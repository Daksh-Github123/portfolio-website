/* Active-section highlighting for the sticky nav.
   Lightweight, no dependencies. */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = links
    .map(function (a) {
      var id = a.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      return el ? { link: a, el: el } : null;
    })
    .filter(Boolean);

  if (!('IntersectionObserver' in window) || !sections.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sections.forEach(function (s) { s.link.classList.remove('active'); });
        var match = sections.find(function (s) { return s.el === entry.target; });
        if (match) match.link.classList.add('active');
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach(function (s) { observer.observe(s.el); });
})();

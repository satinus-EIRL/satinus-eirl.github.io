/**
 * Satinus — Tabla de contenidos y anclas en páginas de documento
 */
(function () {
  'use strict';

  function slugify(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 64) || 'section';
  }

  function buildToc(prose, tocEl) {
    if (!prose || !tocEl) return;

    var headings = prose.querySelectorAll('h2, h3');
    if (!headings.length) {
      tocEl.closest('.doc-sidebar')?.setAttribute('hidden', '');
      return;
    }

    var used = {};
    var html = '';
    headings.forEach(function (h) {
      var text = h.textContent.trim();
      if (!text) return;
      var id = h.id || slugify(text);
      while (used[id]) id += '-2';
      used[id] = true;
      h.id = id;
      if (!h.querySelector('.headerlink')) {
        h.style.position = 'relative';
      }
      var cls = h.tagName === 'H3' ? ' class="toc-h3"' : '';
      html += '<li' + cls + '><a href="#' + id + '">' + text + '</a></li>';
    });
    tocEl.innerHTML = html;

    var links = tocEl.querySelectorAll('a');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            links.forEach(function (a) {
              a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    headings.forEach(function (h) { observer.observe(h); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var prose = document.querySelector('.doc-prose');
    var toc = document.getElementById('doc-toc');
    buildToc(prose, toc);
  });
}());

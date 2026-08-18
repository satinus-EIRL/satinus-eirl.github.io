/**
 * Satinus — listado de boletín
 */
(function () {
  'use strict';

  var list = document.getElementById('boletin-list');
  if (!list || !window.SatinusBoletin) return;

  function t(key, fallback) {
    return window.SatinusI18n ? window.SatinusI18n.t(key) : fallback;
  }

  function render(posts) {
    list.innerHTML = '';
    if (!posts.length) {
      list.innerHTML = '<p class="docs-loading">' + t('boletin.empty', 'Aún no hay entradas.') + '</p>';
      return;
    }

    posts.forEach(function (post) {
      var a = document.createElement('a');
      a.className = 'boletin-card';
      a.href = window.SatinusBoletin.href(post);
      a.setAttribute('role', 'listitem');

      var meta = document.createElement('div');
      meta.className = 'boletin-card-meta';
      meta.innerHTML =
        '<span class="boletin-card-tag">' +
        escapeHtml(window.SatinusBoletin.pick(post, 'tag')) +
        '</span><time datetime="' +
        escapeHtml(post.date || '') +
        '">' +
        escapeHtml(window.SatinusBoletin.formatDate(post.date)) +
        '</time>';

      var h = document.createElement('h2');
      h.textContent = window.SatinusBoletin.pick(post, 'title');

      var p = document.createElement('p');
      p.textContent = window.SatinusBoletin.pick(post, 'excerpt');

      var more = document.createElement('span');
      more.className = 'boletin-card-more';
      more.textContent = t('carousel.read', 'Leer boletín →');

      a.appendChild(meta);
      a.appendChild(h);
      a.appendChild(p);
      a.appendChild(more);
      list.appendChild(a);
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function load() {
    list.setAttribute('aria-busy', 'true');
    list.innerHTML = '<p class="docs-loading">' + t('boletin.loading', 'Cargando boletín…') + '</p>';
    window.SatinusBoletin.loadManifest()
      .then(function (posts) {
        list.setAttribute('aria-busy', 'false');
        render(posts);
      })
      .catch(function () {
        list.setAttribute('aria-busy', 'false');
        list.innerHTML =
          '<p class="docs-loading">' + t('boletin.error', 'No se pudo cargar el boletín.') + '</p>';
      });
  }

  window.addEventListener('satinus:lang', load);
  load();
})();

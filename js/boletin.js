/**
 * Satinus — catálogo de boletín + utilidades compartidas
 */
(function (global) {
  'use strict';

  function manifestUrl() {
    var path = global.location.pathname || '';
    if (path.indexOf('/boletin/entradas/') !== -1) return '../manifest.json';
    if (/boletin\/entradas\//.test(path)) return '../manifest.json';
    return 'boletin/manifest.json';
  }

  function lang() {
    return (global.SatinusI18n && global.SatinusI18n.getLang && global.SatinusI18n.getLang()) || 'es';
  }

  function pick(post, base) {
    var L = lang();
    if (L === 'en' && post[base + 'En']) return post[base + 'En'];
    if (L === 'pt' && post[base + 'Pt']) return post[base + 'Pt'];
    return post[base] || '';
  }

  function formatDate(iso) {
    if (!iso) return '';
    var parts = iso.split('-');
    if (parts.length !== 3) return iso;
    var L = lang();
    var months =
      L === 'en'
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        : L === 'pt'
          ? ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
          : ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    var m = parseInt(parts[1], 10) - 1;
    return parts[2] + ' ' + (months[m] || parts[1]) + ' ' + parts[0];
  }

  function href(post) {
    var f = post.file || '';
    if (f.indexOf('http') === 0) return f;
    var path = global.location.pathname || '';
    if (path.indexOf('/boletin/entradas/') !== -1 || /boletin\/entradas\//.test(path)) {
      return f.replace(/^boletin\/entradas\//, '');
    }
    return f;
  }

  function loadManifest() {
    return fetch(manifestUrl())
      .then(function (r) {
        if (!r.ok) throw new Error('manifest');
        return r.json();
      })
      .then(function (data) {
        return (data.posts || []).slice().sort(function (a, b) {
          return (b.date || '').localeCompare(a.date || '');
        });
      });
  }

  global.SatinusBoletin = {
    loadManifest: loadManifest,
    pick: pick,
    formatDate: formatDate,
    href: href,
  };
})(window);

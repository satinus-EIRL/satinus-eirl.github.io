/**
 * Satinus — Página completa de términos (terminos.html)
 */
(function () {
  'use strict';

  function getLang() {
    if (window.SatinusI18n && window.SatinusI18n.getLang) return window.SatinusI18n.getLang();
    return 'es';
  }

  function isAccepted() {
    if (!window.SatinusTerms) return true;
    try {
      return localStorage.getItem(window.SatinusTerms.meta.storageKey) === window.SatinusTerms.meta.version;
    } catch (e) {
      return true;
    }
  }

  function render() {
    if (!window.SatinusTerms) return;
    var locale = window.SatinusTerms.getLocale(getLang());
    var meta = window.SatinusTerms.meta;

    var titleEl = document.getElementById('terms-page-title');
    var subEl = document.getElementById('terms-page-subtitle');
    var metaEl = document.getElementById('terms-page-meta');
    var sectionsEl = document.getElementById('terms-page-sections');
    var acceptBar = document.getElementById('terms-page-accept');
    var checkLabel = document.getElementById('terms-page-check-label');
    var checkbox = document.getElementById('terms-page-checkbox');
    var btn = document.getElementById('terms-page-btn');

    if (!titleEl || !sectionsEl) return;

    titleEl.textContent = locale.title;
    subEl.textContent = locale.subtitle;
    metaEl.textContent = meta.holder + ' · v' + meta.version + ' · vigente desde ' + meta.effectiveDate + ' · ' + meta.jurisdiction;

    sectionsEl.innerHTML = '';
    locale.sections.forEach(function (sec) {
      var block = document.createElement('div');
      block.className = 'terms-page-section';
      var h = document.createElement('h2');
      h.textContent = sec.title;
      var p = document.createElement('p');
      p.textContent = sec.body;
      block.appendChild(h);
      block.appendChild(p);
      sectionsEl.appendChild(block);
    });

    if (acceptBar && !isAccepted()) {
      acceptBar.hidden = false;
      checkLabel.textContent = locale.acceptLabel;
      btn.textContent = locale.continueLabel;
      checkbox.addEventListener('change', function () {
        btn.disabled = !checkbox.checked;
      });
      btn.addEventListener('click', function () {
        if (!checkbox.checked) return;
        try {
          localStorage.setItem(meta.storageKey, meta.version);
        } catch (e) { /* ignore */ }
        acceptBar.hidden = true;
        if (window.SatinusTermsGate) window.SatinusTermsGate.accept();
      });
    }
  }

  window.addEventListener('satinus:lang', render);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();

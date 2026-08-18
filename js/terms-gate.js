/**
 * Satinus — Puerta de términos (primer visita en cualquier página)
 */
(function () {
  'use strict';

  function getLang() {
    if (window.SatinusI18n && window.SatinusI18n.getLang) {
      return window.SatinusI18n.getLang();
    }
    try {
      var stored = localStorage.getItem('satinus-lang');
      if (stored === 'en' || stored === 'pt' || stored === 'es') return stored;
    } catch (e) { /* ignore */ }
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

  function setAccepted() {
    try {
      localStorage.setItem(window.SatinusTerms.meta.storageKey, window.SatinusTerms.meta.version);
    } catch (e) { /* ignore */ }
  }

  function renderSections(container, locale) {
    container.innerHTML = '';
    locale.sections.forEach(function (sec) {
      var block = document.createElement('div');
      block.className = 'terms-gate-section';
      var h = document.createElement('h3');
      h.textContent = sec.title;
      var p = document.createElement('p');
      p.textContent = sec.body;
      block.appendChild(h);
      block.appendChild(p);
      container.appendChild(block);
    });
  }

  function buildOverlay() {
    var overlay = document.createElement('div');
    overlay.className = 'terms-gate-overlay';
    overlay.id = 'terms-gate';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'terms-gate-title');

    var dialog = document.createElement('div');
    dialog.className = 'terms-gate-dialog';

    var header = document.createElement('div');
    header.className = 'terms-gate-header';
    var title = document.createElement('h2');
    title.id = 'terms-gate-title';
    var subtitle = document.createElement('p');
    var meta = document.createElement('p');
    meta.className = 'terms-gate-meta';
    header.appendChild(title);
    header.appendChild(subtitle);
    header.appendChild(meta);

    var body = document.createElement('div');
    body.className = 'terms-gate-body';

    var fullLink = document.createElement('a');
    fullLink.className = 'terms-gate-full-link';
    fullLink.target = '_blank';
    fullLink.rel = 'noopener noreferrer';

    var footer = document.createElement('div');
    footer.className = 'terms-gate-footer';

    var label = document.createElement('label');
    label.className = 'terms-gate-check';
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'terms-gate-accept';
    var labelText = document.createElement('span');
    label.appendChild(checkbox);
    label.appendChild(labelText);

    var actions = document.createElement('div');
    actions.className = 'terms-gate-actions';
    var btnAccept = document.createElement('button');
    btnAccept.type = 'button';
    btnAccept.className = 'btn btn-primary';
    btnAccept.disabled = true;
    var btnDecline = document.createElement('button');
    btnDecline.type = 'button';
    btnDecline.className = 'btn btn-ghost';
    actions.appendChild(btnAccept);
    actions.appendChild(btnDecline);

    var declineMsg = document.createElement('p');
    declineMsg.className = 'terms-gate-decline-msg';
    declineMsg.hidden = true;

    footer.appendChild(label);
    footer.appendChild(actions);
    footer.appendChild(declineMsg);

    dialog.appendChild(header);
    dialog.appendChild(body);
    dialog.appendChild(fullLink);
    dialog.appendChild(footer);
    overlay.appendChild(dialog);

    function applyLocale() {
      var lang = getLang();
      var locale = window.SatinusTerms.getLocale(lang);
      var m = window.SatinusTerms.meta;
      title.textContent = locale.title;
      subtitle.textContent = locale.gateLead;
      meta.textContent = m.holder + ' · v' + m.version + ' · ' + m.effectiveDate;
      renderSections(body, locale);
      fullLink.href = m.fullUrl;
      fullLink.textContent = locale.readFull;
      labelText.textContent = locale.acceptLabel;
      btnAccept.textContent = locale.continueLabel;
      btnDecline.textContent = locale.declineLabel;
      declineMsg.textContent = locale.declineMessage;
    }

    checkbox.addEventListener('change', function () {
      btnAccept.disabled = !checkbox.checked;
      declineMsg.hidden = true;
    });

    btnAccept.addEventListener('click', function () {
      if (!checkbox.checked) return;
      setAccepted();
      overlay.hidden = true;
      document.body.style.overflow = '';
    });

    btnDecline.addEventListener('click', function () {
      declineMsg.hidden = false;
      checkbox.checked = false;
      btnAccept.disabled = true;
    });

    window.addEventListener('satinus:lang', applyLocale);

    applyLocale();
    return overlay;
  }

  function init() {
    if (!window.SatinusTerms) return;
    var path = window.location.pathname.replace(/\/$/, '');
    if (path.endsWith('/terminos.html') || path.endsWith('terminos.html')) return;
    if (isAccepted()) return;

    var overlay = buildOverlay();
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.SatinusTermsGate = {
    isAccepted: isAccepted,
    accept: function () {
      setAccepted();
      var el = document.getElementById('terms-gate');
      if (el) el.hidden = true;
      document.body.style.overflow = '';
    },
  };
})();

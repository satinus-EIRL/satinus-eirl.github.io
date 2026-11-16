/**
 * Satinus — aviso de términos no bloqueante (barra inferior)
 * Aceptación obligatoria solo al usar la tool web o descargar la app.
 * En páginas generales, «No acepto» minimiza la barra (sesión).
 */
(function () {
  'use strict';

  var APK_RE = /github\.com\/Satinus\/hex-scanner(\/releases)?/i;
  var TOOL_RE = /hex-v8-web-tool\.html/i;
  var DISMISS_KEY = 'satinus_terms_banner_dismissed';

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
    try { sessionStorage.removeItem(DISMISS_KEY); } catch (e2) { /* ignore */ }
  }

  function isDismissed() {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function setDismissed() {
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch (e) { /* ignore */ }
  }

  function isTermsPage() {
    var path = window.location.pathname.replace(/\/$/, '');
    return path.endsWith('/terminos.html') || path.endsWith('terminos.html');
  }

  function isToolPage() {
    return TOOL_RE.test(window.location.pathname);
  }

  function isApkHref(href) {
    return !!href && APK_RE.test(href);
  }

  function locale() {
    return window.SatinusTerms.getLocale(getLang());
  }

  function dismissBanner() {
    var el = document.getElementById('terms-gate');
    if (el) el.hidden = true;
    document.body.classList.remove('has-terms-banner');
  }

  function showBanner(opts) {
    opts = opts || {};
    var existing = document.getElementById('terms-gate');
    if (existing) {
      existing.hidden = false;
      existing.classList.toggle('terms-gate--required', !!opts.required);
      document.body.classList.add('has-terms-banner');
      if (opts.required) {
        existing.setAttribute('aria-live', 'assertive');
        try { existing.focus(); } catch (e) { /* ignore */ }
      }
      return existing;
    }

    var bar = document.createElement('aside');
    bar.className = 'terms-gate-banner';
    bar.id = 'terms-gate';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-labelledby', 'terms-gate-title');
    bar.tabIndex = -1;
    if (opts.required) bar.classList.add('terms-gate--required');

    var inner = document.createElement('div');
    inner.className = 'terms-gate-banner__inner';

    var text = document.createElement('div');
    text.className = 'terms-gate-banner__text';
    var title = document.createElement('strong');
    title.id = 'terms-gate-title';
    var lead = document.createElement('p');
    lead.className = 'terms-gate-banner__lead';
    text.appendChild(title);
    text.appendChild(lead);

    var fullLink = document.createElement('a');
    fullLink.className = 'terms-gate-banner__link';
    fullLink.target = '_blank';
    fullLink.rel = 'noopener noreferrer';

    var actions = document.createElement('div');
    actions.className = 'terms-gate-banner__actions';
    var btnAccept = document.createElement('button');
    btnAccept.type = 'button';
    btnAccept.className = 'btn btn-primary';
    var btnDecline = document.createElement('button');
    btnDecline.type = 'button';
    btnDecline.className = 'btn btn-ghost';

    var declineMsg = document.createElement('p');
    declineMsg.className = 'terms-gate-decline-msg';
    declineMsg.hidden = true;

    actions.appendChild(btnAccept);
    actions.appendChild(btnDecline);

    inner.appendChild(text);
    inner.appendChild(fullLink);
    inner.appendChild(actions);
    bar.appendChild(inner);
    bar.appendChild(declineMsg);

    function applyLocale() {
      var loc = locale();
      var m = window.SatinusTerms.meta;
      title.textContent = loc.title;
      lead.textContent = loc.gateLead;
      fullLink.href = m.fullUrl;
      fullLink.textContent = loc.readFull;
      btnAccept.textContent = loc.continueLabel;
      btnDecline.textContent = loc.declineLabel;
      declineMsg.textContent = loc.declineMessage;
    }

    btnAccept.addEventListener('click', function () {
      setAccepted();
      dismissBanner();
      window.dispatchEvent(new CustomEvent('satinus:terms-accepted'));
    });

    btnDecline.addEventListener('click', function () {
      if (isToolPage()) {
        declineMsg.hidden = false;
        bar.classList.add('terms-gate--required');
        return;
      }
      setDismissed();
      dismissBanner();
    });

    window.addEventListener('satinus:lang', applyLocale);
    applyLocale();
    document.body.appendChild(bar);
    document.body.classList.add('has-terms-banner');
    if (opts.required) {
      bar.setAttribute('aria-live', 'assertive');
      try { bar.focus(); } catch (e) { /* ignore */ }
    }
    return bar;
  }

  function requireAcceptance(e) {
    if (isAccepted()) return false;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    showBanner({ required: true });
    return true;
  }

  function softLockTool() {
    if (isAccepted() || !isToolPage()) return;
    var root = document.querySelector('.hex-tool') || document.querySelector('main');
    if (!root || root.querySelector('.terms-gate-tool-lock')) return;
    var lock = document.createElement('div');
    lock.className = 'terms-gate-tool-lock';
    lock.setAttribute('role', 'status');
    var loc = locale();
    lock.textContent = loc.gateLead + ' — ' + loc.acceptLabel;
    root.style.position = root.style.position || 'relative';
    root.appendChild(lock);
    showBanner({ required: true });

    window.addEventListener('satinus:terms-accepted', function () {
      var el = document.querySelector('.terms-gate-tool-lock');
      if (el) el.remove();
    });
  }

  function bindGuards() {
    document.addEventListener(
      'click',
      function (e) {
        if (isAccepted()) return;
        var a = e.target.closest && e.target.closest('a[href]');
        if (a && isApkHref(a.getAttribute('href'))) {
          requireAcceptance(e);
          return;
        }
        if (!isToolPage()) return;
        var btn = e.target.closest && e.target.closest('button, [role="button"], .btn');
        if (!btn) return;
        if (btn.closest('#terms-gate')) return;
        if (btn.closest('.site-nav') || btn.closest('.lang-switcher') || btn.closest('.site-social')) return;
        requireAcceptance(e);
      },
      true
    );
  }

  function init() {
    if (!window.SatinusTerms || isTermsPage()) return;
    bindGuards();
    if (isAccepted()) return;
    if (isToolPage()) {
      showBanner({ required: true });
      softLockTool();
      return;
    }
    if (isDismissed()) return;
    showBanner({ required: false });
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
      dismissBanner();
      window.dispatchEvent(new CustomEvent('satinus:terms-accepted'));
    },
    require: function () {
      return requireAcceptance();
    },
  };
})();

/**
 * Satinus — nav móvil (drawer) + franja de redes + chrome unificado
 * El menú se monta en document.body al abrir para evitar que
 * backdrop-filter / sticky del header rompan position:fixed.
 * Si el HTML ya trae nav/footer canónicos, no los rehace (evita parpadeo).
 */
(function () {
  'use strict';

  var FA_HREF =
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';

  var SOCIAL = [
    {
      name: 'LinkedIn',
      label: 'Satinus en LinkedIn',
      href: 'https://www.linkedin.com/company/satinus/',
      icon: 'fa-brands fa-linkedin-in',
    },
    {
      name: 'Threads',
      label: 'Satinus en Threads',
      href: 'https://www.threads.com/@satinuseirl',
      icon: 'fa-brands fa-threads',
    },
    {
      name: 'X',
      label: 'Satinus en X',
      href: 'https://x.com/SatinusTech',
      icon: 'fa-brands fa-x-twitter',
    },
    {
      name: 'GitHub',
      label: 'Satinus en GitHub',
      href: 'https://github.com/satinus-EIRL',
      icon: 'fa-brands fa-github',
    },
    {
      name: 'YouTube',
      label: 'Satinus en YouTube',
      href: 'https://www.youtube.com/@SatinusEIRL',
      icon: 'fa-brands fa-youtube',
    },
    {
      name: 'Instagram',
      label: 'Satinus en Instagram',
      href: 'https://www.instagram.com/satinuseirl/',
      icon: 'fa-brands fa-instagram',
    },
  ];

  var NAV_ITEMS = [
    { href: '/', key: 'nav.home', text: 'Inicio', match: function (p) { return p === '/' || /\/index\.html$/i.test(p); } },
    { href: '/sobre-nosotros.html', key: 'nav.about', text: 'Sobre nosotros', match: /sobre-nosotros\.html$/i },
    { href: '/productos.html', key: 'nav.products', text: 'Productos', match: /productos\.html$/i },
    { href: '/hex.html', key: 'nav.hex', text: 'HEX V8', match: /\/hex\.html$/i },
    { href: '/boletin.html', key: 'nav.boletin', text: 'Boletín', match: /boletin(\/|\.html|$)/i },
    { href: '/documentacion.html', key: 'nav.docs', text: 'Documentación', match: /(documentacion\.html$|\/docs\/)/i },
    { href: '/#contacto', key: 'nav.contact', text: 'Contacto', btn: true },
  ];

  var FOOTER_ITEMS = [
    { href: '/sobre-nosotros.html', key: 'footer.about', text: 'Sobre nosotros' },
    { href: '/actividad.html', key: 'footer.activity', text: 'Actividad' },
    { href: '/productos.html', key: 'footer.products', text: 'Productos' },
    { href: '/hex.html', key: 'footer.hex', text: 'HEX V8' },
    { href: '/boletin.html', key: 'footer.boletin', text: 'Boletín' },
    { href: '/documentacion.html', key: 'footer.docs', text: 'Documentación' },
    { href: '/privacidad.html', key: 'footer.privacy', text: 'Privacidad' },
    { href: '/aviso-legal.html', key: 'footer.legal', text: 'Aviso legal' },
    { href: '/terminos.html', key: 'footer.terms', text: 'Términos de uso' },
    { href: 'mailto:satinuseirl@gmail.com', key: 'footer.contact', text: 'Contacto' },
  ];

  function ensureFontAwesome() {
    if (document.querySelector('link[data-satinus-fa], link[href*="font-awesome"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FA_HREF;
    link.crossOrigin = 'anonymous';
    link.referrerPolicy = 'no-referrer';
    link.media = 'print';
    link.setAttribute('data-satinus-fa', '1');
    link.onload = function () { link.media = 'all'; };
    document.head.appendChild(link);
    setTimeout(function () { if (link.media !== 'all') link.media = 'all'; }, 1500);
  }

  function pathName() {
    return (window.location.pathname || '/').replace(/\\/g, '/');
  }

  function matches(item, path) {
    if (!item.match) return false;
    if (typeof item.match === 'function') return item.match(path);
    return item.match.test(path);
  }

  function syncNavAriaCurrent(menu) {
    var path = pathName();
    var links = menu.querySelectorAll(':scope > li > a[data-i18n]');
    NAV_ITEMS.forEach(function (item, i) {
      var a = links[i];
      if (!a) return;
      if (matches(item, path)) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function navIsCanonical(menu) {
    var links = menu.querySelectorAll(':scope > li > a[data-i18n]');
    if (links.length !== NAV_ITEMS.length) return false;
    if (!menu.querySelector(':scope > li.lang-switcher')) return false;
    for (var i = 0; i < NAV_ITEMS.length; i++) {
      var a = links[i];
      var item = NAV_ITEMS[i];
      if (!a || a.getAttribute('data-i18n') !== item.key) return false;
      if ((a.getAttribute('href') || '') !== item.href) return false;
      if (item.btn && !a.classList.contains('btn-nav')) return false;
    }
    return true;
  }

  function footerIsCanonical(links) {
    var as = links.querySelectorAll(':scope > a[data-i18n]');
    if (as.length !== FOOTER_ITEMS.length) return false;
    for (var i = 0; i < FOOTER_ITEMS.length; i++) {
      var a = as[i];
      var item = FOOTER_ITEMS[i];
      if (!a || a.getAttribute('data-i18n') !== item.key) return false;
      if ((a.getAttribute('href') || '') !== item.href) return false;
    }
    return true;
  }

  function rebuildNav(menu) {
    var path = pathName();
    menu.innerHTML = '';

    NAV_ITEMS.forEach(function (item) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = item.href;
      a.setAttribute('data-i18n', item.key);
      a.textContent = item.text;
      if (item.btn) a.className = 'btn-nav';
      if (matches(item, path)) a.setAttribute('aria-current', 'page');
      li.appendChild(a);
      menu.appendChild(li);
    });

    var langLi = document.createElement('li');
    langLi.className = 'lang-switcher';
    langLi.setAttribute('role', 'group');
    langLi.setAttribute('aria-label', 'Language');
    ['es', 'en', 'pt'].forEach(function (code) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('data-lang', code);
      btn.setAttribute('aria-pressed', 'false');
      btn.textContent = code.toUpperCase();
      langLi.appendChild(btn);
    });
    menu.appendChild(langLi);

    if (window.SatinusI18n && window.SatinusI18n.apply) {
      window.SatinusI18n.apply();
    }
  }

  function ensureUnifiedNav() {
    var menu = document.querySelector('.nav-links');
    if (!menu) return;

    if (navIsCanonical(menu)) {
      syncNavAriaCurrent(menu);
      menu.setAttribute('data-chrome', 'canonical');
      return;
    }
    rebuildNav(menu);
    menu.setAttribute('data-chrome', 'rebuilt');
  }

  function ensureUnifiedFooter() {
    var footer = document.querySelector('.site-footer');
    if (!footer) return;
    var links = footer.querySelector('.footer-links');
    if (!links) {
      links = document.createElement('div');
      links.className = 'footer-links';
      footer.appendChild(links);
    }
    if (footerIsCanonical(links)) {
      links.setAttribute('data-chrome', 'canonical');
      return;
    }

    links.innerHTML = '';
    FOOTER_ITEMS.forEach(function (item) {
      var a = document.createElement('a');
      a.href = item.href;
      a.setAttribute('data-i18n', item.key);
      a.textContent = item.text;
      links.appendChild(a);
    });
    if (window.SatinusI18n && window.SatinusI18n.apply) {
      window.SatinusI18n.apply();
    }
    links.setAttribute('data-chrome', 'rebuilt');
  }

  function labelSocialLinks(root) {
    (root || document).querySelectorAll('.site-social-list a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var match = SOCIAL.filter(function (s) {
        return href.indexOf(s.href.replace(/\/$/, '')) !== -1 || href === s.href;
      })[0];
      if (!match) {
        SOCIAL.forEach(function (s) {
          var sel = '.' + s.icon.split(' ').join('.');
          if (a.querySelector(sel)) match = s;
        });
      }
      if (!match) return;
      a.setAttribute('aria-label', match.label);
      a.title = match.name;
      var icon = a.querySelector('i');
      if (icon) icon.setAttribute('aria-hidden', 'true');
    });
  }

  function ensureSocialBar() {
    var existing = document.querySelector('.site-social');
    if (existing) {
      labelSocialLinks(existing);
      return;
    }
    var navEl = document.querySelector('.site-nav');
    if (!navEl || !navEl.parentNode) return;

    var bar = document.createElement('div');
    bar.className = 'site-social';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Satinus en redes sociales');

    var list = document.createElement('ul');
    list.className = 'site-social-list';

    SOCIAL.forEach(function (item) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = item.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer me';
      a.setAttribute('aria-label', item.label);
      a.title = item.name;

      var icon = document.createElement('i');
      icon.className = item.icon;
      icon.setAttribute('aria-hidden', 'true');

      a.appendChild(icon);
      li.appendChild(a);
      list.appendChild(li);
    });

    bar.appendChild(list);
    navEl.parentNode.insertBefore(bar, navEl);
  }

  ensureFontAwesome();
  ensureSocialBar();
  ensureUnifiedNav();
  ensureUnifiedFooter();

  var nav = document.querySelector('.site-nav');
  if (!nav) return;

  var toggle = nav.querySelector('.nav-toggle');
  var menu = nav.querySelector('.nav-links');
  if (!toggle || !menu) return;

  var placeholder = document.createComment('nav-links-slot');
  var menuParent = menu.parentNode;
  var mountedInBody = false;

  var backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.hidden = true;
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }

  function isMobileNav() {
    return window.matchMedia('(max-width: 980px)').matches;
  }

  function mountMenu(toBody) {
    if (toBody && !mountedInBody) {
      menuParent.insertBefore(placeholder, menu);
      document.body.appendChild(menu);
      menu.classList.add('nav-links--drawer');
      mountedInBody = true;
    } else if (!toBody && mountedInBody) {
      menuParent.insertBefore(menu, placeholder);
      placeholder.remove();
      menu.classList.remove('nav-links--drawer');
      mountedInBody = false;
    }
  }

  function setOpen(open) {
    open = !!open && isMobileNav();
    if (open) mountMenu(true);
    nav.classList.toggle('is-open', open);
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);
    backdrop.hidden = !open;
    backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (!open && mountedInBody && !isMobileNav()) mountMenu(false);
  }

  toggle.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!nav.classList.contains('is-open'));
  });

  backdrop.addEventListener('click', function () {
    setOpen(false);
  });

  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      setOpen(false);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  window.addEventListener('resize', function () {
    if (!isMobileNav()) {
      setOpen(false);
      mountMenu(false);
    }
  });
})();

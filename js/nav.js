/**
 * Satinus — nav móvil (drawer) + franja de redes sociales
 * El menú se monta en document.body al abrir para evitar que
 * backdrop-filter / sticky del header rompan position:fixed.
 */
(function () {
  'use strict';

  var FA_HREF =
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';

  var SOCIAL = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/satinus/',
      icon: 'fa-brands fa-linkedin-in',
    },
    {
      name: 'Threads',
      href: 'https://www.threads.com/@satinuseirl',
      icon: 'fa-brands fa-threads',
    },
    {
      name: 'X',
      href: 'https://x.com/SatinusTech',
      icon: 'fa-brands fa-x-twitter',
    },
    {
      name: 'GitHub',
      href: 'https://github.com/satinus-EIRL',
      icon: 'fa-brands fa-github',
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@SatinusEIRL',
      icon: 'fa-brands fa-youtube',
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/satinuseirl/',
      icon: 'fa-brands fa-instagram',
    },
  ];

  function ensureFontAwesome() {
    if (document.querySelector('link[data-satinus-fa]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FA_HREF;
    link.crossOrigin = 'anonymous';
    link.referrerPolicy = 'no-referrer';
    link.setAttribute('data-satinus-fa', '1');
    document.head.appendChild(link);
  }

  function ensureSocialBar() {
    if (document.querySelector('.site-social')) return;
    var nav = document.querySelector('.site-nav');
    if (!nav || !nav.parentNode) return;

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
      a.setAttribute('aria-label', item.name);
      a.title = item.name;

      var icon = document.createElement('i');
      icon.className = item.icon;
      icon.setAttribute('aria-hidden', 'true');

      a.appendChild(icon);
      li.appendChild(a);
      list.appendChild(li);
    });

    bar.appendChild(list);
    nav.parentNode.insertBefore(bar, nav);
  }

  ensureFontAwesome();
  ensureSocialBar();

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

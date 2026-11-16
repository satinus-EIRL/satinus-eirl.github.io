/**
 * Satinus — carrusel de boletines (inicio)
 */
(function () {
  'use strict';

  var root = document.getElementById('boletin-carousel');
  if (!root || !window.SatinusBoletin) return;

  var track = root.querySelector('.carousel-track');
  var dots = root.querySelector('.carousel-dots');
  var prevBtn = root.querySelector('.carousel-prev');
  var nextBtn = root.querySelector('.carousel-next');
  var status = root.querySelector('.carousel-status');
  var index = 0;
  var slides = [];
  var timer = null;
  var INTERVAL = 7000;

  function t(key, fallback) {
    return window.SatinusI18n ? window.SatinusI18n.t(key) : fallback;
  }

  function go(i) {
    if (!slides.length) return;
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + index * 100 + '%)';
    if (dots) {
      Array.prototype.forEach.call(dots.children, function (d, di) {
        d.setAttribute('aria-current', di === index ? 'true' : 'false');
      });
    }
    if (status) {
      status.textContent = t('carousel.of', '{n} / {t}')
        .replace('{n}', String(index + 1))
        .replace('{t}', String(slides.length));
    }
  }

  function next() {
    go(index + 1);
  }

  function prev() {
    go(index - 1);
  }

  function restart() {
    if (timer) clearInterval(timer);
    if (slides.length > 1) timer = setInterval(next, INTERVAL);
  }

  function render(posts) {
    var latest = posts.slice(0, 5);
    if (!latest.length) {
      root.hidden = true;
      return;
    }

    track.innerHTML = '';
    if (dots) dots.innerHTML = '';
    slides = latest;

    latest.forEach(function (post, i) {
      var article = document.createElement('article');
      article.className = 'carousel-slide';
      article.setAttribute('role', 'group');
      article.setAttribute('aria-roledescription', 'slide');
      article.setAttribute('aria-label', String(i + 1) + ' / ' + latest.length);

      var tag = document.createElement('span');
      tag.className = 'carousel-tag';
      tag.textContent = window.SatinusBoletin.pick(post, 'tag');

      var date = document.createElement('time');
      date.className = 'carousel-date';
      date.setAttribute('datetime', post.date || '');
      date.textContent = window.SatinusBoletin.formatDate(post.date);

      var meta = document.createElement('div');
      meta.className = 'carousel-meta';
      meta.appendChild(tag);
      meta.appendChild(date);

      var h = document.createElement('h2');
      h.className = 'carousel-title';
      h.textContent = window.SatinusBoletin.pick(post, 'title');

      var p = document.createElement('p');
      p.className = 'carousel-excerpt';
      p.textContent = window.SatinusBoletin.pick(post, 'excerpt');

      var a = document.createElement('a');
      a.className = 'btn btn-primary';
      a.href = window.SatinusBoletin.href(post);
      a.textContent = t('carousel.read', 'Leer boletín →');

      article.appendChild(meta);
      article.appendChild(h);
      article.appendChild(p);
      article.appendChild(a);
      track.appendChild(article);

      if (dots) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', t('carousel.goto', 'Ir al boletín') + ' ' + (i + 1));
        dot.addEventListener('click', function () {
          go(i);
          restart();
        });
        dots.appendChild(dot);
      }
    });

    go(0);
    restart();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      prev();
      restart();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      next();
      restart();
    });
  }

  root.addEventListener('mouseenter', function () {
    if (timer) clearInterval(timer);
  });
  root.addEventListener('mouseleave', restart);

  document.addEventListener('keydown', function (e) {
    if (!root.contains(document.activeElement) && document.activeElement !== document.body) return;
    if (e.key === 'ArrowRight') {
      next();
      restart();
    }
    if (e.key === 'ArrowLeft') {
      prev();
      restart();
    }
  });

  window.addEventListener('satinus:lang', function () {
    window.SatinusBoletin.loadManifest().then(render).catch(function () {
      root.hidden = true;
    });
  });

  window.SatinusBoletin.loadManifest().then(render).catch(function () {
    root.hidden = true;
  });
})();

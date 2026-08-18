/**
 * Satinus E.I.R.L. — Centro de documentación
 */
(function () {
  'use strict';

  var listEl = document.getElementById('docs-list');
  var statsEl = document.getElementById('docs-stats');
  var filterEl = document.getElementById('docs-filter');
  if (!listEl) return;

  var activeFilter = 'all';

  function t(key, vars) {
    if (window.SatinusI18n) return window.SatinusI18n.t(key, vars);
    return key;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function docHref(file) {
    if (!file) return '#';
    if (/^https?:\/\//i.test(file)) return file;
    return file.charAt(0) === '/' ? file : '/' + file;
  }

  function statusInfo(status) {
    var map = {
      published: { key: 'docs.status.published', className: 'doc-status--live' },
      'coming-soon': { key: 'docs.status.soon', className: 'doc-status--soon' },
      draft: { key: 'docs.status.draft', className: 'doc-status--draft' },
    };
    var info = map[status] || map['coming-soon'];
    return { label: t(info.key), className: info.className };
  }

  function pick(doc, field) {
    if (window.SatinusI18n && window.SatinusI18n.pick) {
      return window.SatinusI18n.pick(doc, field);
    }
    return doc[field] || '';
  }

  function categoryLabel(doc) {
    return pick(doc, 'categoryLabel') || doc.categoryLabel || doc.category;
  }

  function actionLabel(doc) {
    var localized = pick(doc, 'actionLabel');
    if (localized) return localized;
    if (doc.format === 'pdf') return t('docs.action.pdf');
    if (doc.format === 'html') {
      if (doc.category === 'informes') return t('docs.action.informe');
      if (doc.category === 'preprints') return t('docs.action.preprint');
      if (doc.category === 'materiales') return t('docs.action.tool');
      return t('docs.action.default');
    }
    return t('docs.action.default');
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      var lang = window.SatinusI18n ? window.SatinusI18n.getLang() : 'es';
      return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(iso + 'T12:00:00'));
    } catch (e) {
      return iso;
    }
  }

  function renderStats(docs) {
    if (!statsEl) return;
    var published = docs.filter(function (d) { return d.status === 'published'; }).length;
    var pending = docs.length - published;
    if (published) {
      statsEl.textContent = t('docs.stats.published', {
        n: String(published),
        s: published !== 1 ? 's' : '',
        p: String(pending),
      });
    } else {
      statsEl.textContent = t('docs.stats.total', {
        n: String(docs.length),
        s: docs.length !== 1 ? 's' : '',
      });
    }
  }

  function renderFilters(docs) {
    if (!filterEl) return;
    var categories = [{ id: 'all', label: t('docs.filter.all') }];
    var seen = {};
    docs.forEach(function (doc) {
      if (!seen[doc.category]) {
        seen[doc.category] = true;
        categories.push({ id: doc.category, label: categoryLabel(doc) });
      }
    });
    filterEl.innerHTML = categories.map(function (cat) {
      var active = cat.id === activeFilter ? ' is-active' : '';
      return '<button type="button" class="docs-filter-btn' + active + '" data-filter="' +
        escapeHtml(cat.id) + '">' + escapeHtml(cat.label) + '</button>';
    }).join('');
  }

  if (filterEl) {
    filterEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;
      activeFilter = btn.getAttribute('data-filter');
      filterEl.querySelectorAll('.docs-filter-btn').forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
      });
      renderList(window.__docsCatalog || []);
    });
  }

  function renderList(docs) {
    var filtered = activeFilter === 'all'
      ? docs
      : docs.filter(function (d) { return d.category === activeFilter; });

    if (!filtered.length) {
      listEl.innerHTML = '<p class="docs-empty">' + escapeHtml(t('docs.empty')) + '</p>';
      return;
    }

    listEl.innerHTML = filtered.map(function (doc) {
      var status = statusInfo(doc.status);
      var isPublished = doc.status === 'published' && doc.file;
      var itemClass = 'doc-item' + (isPublished ? ' doc-item--live' : ' doc-item--empty');
      var meta = [categoryLabel(doc), doc.format && doc.format.toUpperCase()].filter(Boolean).join(' · ');
      var versionLine = doc.version ? 'v' + escapeHtml(doc.version) : '';
      var dateLine = doc.date ? formatDate(doc.date) : '';
      var metaExtra = [versionLine, dateLine].filter(Boolean).join(' · ');

      var action = isPublished
        ? (function () {
            var href = docHref(doc.file);
            var label = actionLabel(doc);
            var attrs = '';
            if (doc.format === 'pdf') {
              attrs = ' target="_blank" rel="noopener noreferrer"';
            } else if (doc.format === 'external') {
              attrs = ' target="_blank" rel="noopener noreferrer"';
            }
            return '<a class="btn btn-primary btn-sm" href="' + escapeHtml(href) + '"' + attrs + '>' +
              escapeHtml(label) + '</a>';
          })()
        : '<span class="doc-status ' + status.className + '">' + escapeHtml(status.label) + '</span>';

      var tags = (doc.tags || []).map(function (tag) {
        return '<span class="doc-tag">' + escapeHtml(tag) + '</span>';
      }).join('');

      var title = pick(doc, 'title');
      var description = pick(doc, 'description');

      return (
        '<article class="' + itemClass + '" role="listitem" id="doc-' + escapeHtml(doc.id) + '">' +
          '<div class="doc-body">' +
            '<p class="doc-meta">' + escapeHtml(meta) +
              (metaExtra ? ' <span class="doc-meta-extra">' + metaExtra + '</span>' : '') +
            '</p>' +
            '<h2>' + escapeHtml(title) + '</h2>' +
            '<p>' + escapeHtml(description) + '</p>' +
            (tags ? '<div class="doc-tags">' + tags + '</div>' : '') +
          '</div>' +
          '<div class="doc-action">' + action + '</div>' +
        '</article>'
      );
    }).join('');
  }

  function showError() {
    listEl.innerHTML =
      '<p class="docs-empty">' + escapeHtml(t('docs.error')) + ' ' +
      '<a href="mailto:satinuseirl@gmail.com">' + escapeHtml(t('docs.errorSupport')) + '</a>.</p>';
    if (statsEl) statsEl.textContent = '';
  }

  function loadCatalog() {
    fetch('/docs/manifest.json', { cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) throw new Error('manifest');
        return res.json();
      })
      .then(function (data) {
        var docs = (data && data.documents) || [];
        window.__docsCatalog = docs;
        renderStats(docs);
        renderFilters(docs);
        renderList(docs);
      })
      .catch(showError);
  }

  window.addEventListener('satinus:lang', loadCatalog);
  document.addEventListener('DOMContentLoaded', loadCatalog);
}());

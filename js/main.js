/**
 * Satinus E.I.R.L. — Lógica de página principal
 */
(function () {
  'use strict';

  var form = document.querySelector('.contact-form');
  if (!form) return;

  var btn = form.querySelector('button[type="submit"]');
  var defaultLabel = btn ? btn.textContent : '';
  var cfg = window.SatinusSiteConfig || {};

  window.addEventListener('satinus:lang', function () {
    if (btn && !btn.disabled) {
      defaultLabel = window.SatinusI18n ? window.SatinusI18n.t('form.submit') : defaultLabel;
      btn.textContent = defaultLabel;
    }
  });

  function showError() {
    if (!btn) return;
    btn.disabled = false;
    btn.textContent = window.SatinusI18n ? window.SatinusI18n.t('form.submit') : defaultLabel;
    var error = form.querySelector('.form-error');
    if (error) error.classList.remove('form-msg-hidden');
  }

  function showSuccess(resetForm) {
    if (!btn) return;
    var sent = window.SatinusI18n ? window.SatinusI18n.t('form.sent') : 'Mensaje enviado ✓';
    btn.textContent = sent;
    btn.style.background = '#166534';
    btn.style.color = '#fff';
    var success = form.querySelector('.form-success');
    if (success) success.classList.remove('form-msg-hidden');
    if (resetForm) form.reset();
  }

  function mailtoFallback(data) {
    var nombre = data.get('nombre') || '';
    var email = data.get('email') || '';
    var asunto = data.get('asunto') || 'Contacto web Satinus';
    var mensaje = data.get('mensaje') || '';
    var body = 'Nombre: ' + nombre + '\nEmail: ' + email + '\n\n' + mensaje;

    var mailto =
      'mailto:satinuseirl@gmail.com?subject=' +
      encodeURIComponent(asunto) +
      '&body=' +
      encodeURIComponent(body);

    // Abrir el cliente de correo de la forma mas compatible posible.
    // Evitamos reseteo inmediato para que el usuario pueda reenviar si el cliente no se abre.
    btn.disabled = false;
    btn.textContent = window.SatinusI18n ? window.SatinusI18n.t('form.submit') : defaultLabel;
    btn.style.background = '';
    btn.style.color = '';

    var a = document.createElement('a');
    a.href = mailto;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Mensaje informativo: el envío lo realiza el usuario desde su cliente de correo.
    // (No reseteamos el form para que no se pierdan los datos.)
    showSuccess(false);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var success = form.querySelector('.form-success');
    var error = form.querySelector('.form-error');
    var sending = window.SatinusI18n ? window.SatinusI18n.t('form.sending') : 'Enviando...';

    btn.disabled = true;
    btn.textContent = sending;
    if (success) success.classList.add('form-msg-hidden');
    if (error) error.classList.add('form-msg-hidden');

    var data = new FormData(form);
    var endpoint = cfg.contactFormEndpoint;

    if (!endpoint) {
      mailtoFallback(data);
      return;
    }

    fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: data,
    })
      .then(function (res) {
        if (!res.ok) throw new Error('form error');
        showSuccess();
      })
      .catch(function () {
        showError();
      });
  });
}());

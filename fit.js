/* Cada tela do quiz cabe na altura do celular, sem rolagem.
   1) compacta espaçamentos; 2) diminui as imagens (a maior primeiro); 3) esconde o que é opcional ([data-fit-opt]).
   Não mexe em pixel, GA, rótulos de etapa nem na página de vendas (p54). */
(function () {
  'use strict';
  var kind = document.body.getAttribute('data-replica-kind') || '';
  if (kind === 'checkoutPersonalized') return;
  var root = document.documentElement;
  var css = document.createElement('style');
  css.textContent =
    '.sda-fit1 [class*="question-layout_title"],.sda-fit1 [data-test$="__title"]{margin-bottom:8px!important}' +
    '.sda-fit1 [class*="question-layout_question"]{padding-top:8px!important}' +
    '.sda-fit1 [class*="list_list__"]{gap:8px!important}' +
    '.sda-fit1 [class*="option-tile_optionTile"]{min-height:46px!important;padding-top:8px!important;padding-bottom:8px!important}' +
    '.sda-fit1 [class*="list_listItem"]{margin-bottom:0!important}' +
    '.sda-fit1 .sda-dor,.sda-fit1 .sda-fig{margin:0 0 6px!important}' +
    '.sda-fit2 [class*="option-tile_optionTile"]{min-height:40px!important;padding-top:6px!important;padding-bottom:6px!important}' +
    '.sda-fit2 [data-test$="__title"]{font-size:21px!important;line-height:1.2!important}' +
    '.sda-fit2 [class*="question-layout_description"],.sda-fit2 [data-test="infoPage__textContainer"]{font-size:14px!important;line-height:1.4!important}' +
    '.sda-fit3 [data-fit-opt]{display:none!important}';
  document.head.appendChild(css);

  function alto() { return Math.max(root.scrollHeight, document.body.scrollHeight); }
  function sobra() { return alto() - window.innerHeight; }
  function visivel(el) { var r = el.getBoundingClientRect(); return r.width > 40 && r.height > 90 && getComputedStyle(el).display !== 'none'; }
  function imagens() {
    var list = [].slice.call(document.querySelectorAll('img, [data-fit]')).filter(function (el) {
      if (el.closest('[data-test^="header"], [data-test^="sidebar"], [data-test*="__option"], [data-test="firstPageCard__base"], #sda-entrada, [data-fit] img')) return false;
      return visivel(el);
    });
    return list.sort(function (a, b) { return b.getBoundingClientRect().height - a.getBoundingClientRect().height; });
  }
  function encolhe(el, px) {
    var h = el.getBoundingClientRect().height, nh = Math.max(px.min, h - px.falta);
    if (nh >= h - 1) return false;
    if (el.getAttribute('data-fit') === 'box') { el.style.setProperty('width', nh + 'px', 'important'); el.style.setProperty('max-width', nh + 'px', 'important'); }
    else { el.style.setProperty('height', nh + 'px', 'important'); el.style.setProperty('max-height', nh + 'px', 'important'); el.style.setProperty('width', 'auto', 'important'); el.style.setProperty('max-width', '100%', 'important'); el.style.setProperty('object-fit', 'contain', 'important'); }
    return true;
  }
  var rodando = false;
  function ajusta() {
    if (rodando) return; rodando = true;
    try {
      root.classList.remove('sda-fit1', 'sda-fit2', 'sda-fit3');
      [].slice.call(document.querySelectorAll('[data-fit-h]')).forEach(function (el) { var o = el.getAttribute('data-fit-h'); if (o) el.setAttribute('style', o); else el.removeAttribute('style'); el.removeAttribute('data-fit-h'); });
      if (sobra() <= 2) return;
      root.classList.add('sda-fit1'); if (sobra() <= 2) return;
      imagens().forEach(function (el) { var f = sobra(); if (f <= 2) return; if (!el.hasAttribute('data-fit-h')) el.setAttribute('data-fit-h', el.getAttribute('style') || ''); encolhe(el, { falta: f, min: 110 }); });
      if (sobra() <= 2) return;
      root.classList.add('sda-fit2'); if (sobra() <= 2) return;
      imagens().forEach(function (el) { var f = sobra(); if (f <= 2) return; encolhe(el, { falta: f, min: 70 }); });
      if (sobra() <= 2) return;
      root.classList.add('sda-fit3');
    } finally { rodando = false; }
  }
  function agenda() { setTimeout(ajusta, 30); }
  if (document.readyState === 'complete') agenda(); else window.addEventListener('load', agenda);
  document.addEventListener('DOMContentLoaded', agenda);
  [].slice.call(document.images).forEach(function (im) { if (!im.complete) im.addEventListener('load', agenda); });
  var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(ajusta, 150); });
})();

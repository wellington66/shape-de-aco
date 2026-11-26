/* Carrossel das telas do app (p54): arrastar, bolinhas e avanço automático. */
(function () {
  'use strict';
  var root = document.getElementById('splide02');
  if (!root) return;
  var track = document.getElementById('splide02-track');
  var list = document.getElementById('splide02-list');
  if (!track || !list) return;

  // Mantém só os slides reais (o original trazia cópias para o modo em laço).
  Array.prototype.slice.call(list.querySelectorAll('.splide__slide--clone')).forEach(function (n) { n.remove(); });
  // 25/11: sem as telas de alimentação (refeição e ingredientes) — some o slide e a bolinha dele
  Array.prototype.slice.call(list.querySelectorAll('.splide__slide')).forEach(function (n) {
    if (n.querySelector('img[src*="app-refeicao"], img[src*="app-ingredientes"]')) {
      var d = root.parentNode.querySelector('[aria-controls="' + n.id + '"]'); if (d) (d.closest('li') || d).remove();
      n.remove();
    }
  });
  var slides = Array.prototype.slice.call(list.querySelectorAll('.splide__slide'));
  var dots = Array.prototype.slice.call(root.parentNode.querySelectorAll('[aria-controls^="splide02-slide"]'));
  if (!slides.length) return;

  var css = document.createElement('style');
  css.textContent =
    '#splide02-track{overflow-x:auto!important;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;user-select:auto!important}' +
    '#splide02-track::-webkit-scrollbar{display:none}' +
    '#splide02-list{transform:none!important;transition:none!important}' +
    '#splide02-list .splide__slide{scroll-snap-align:center;transition:transform .35s ease,opacity .35s ease;transform:scale(.88);opacity:.6}' +
    '#splide02-list .splide__slide.is-active{transform:scale(1);opacity:1}' +
    '#splide02-list img{-webkit-user-drag:none;pointer-events:none}';
  document.head.appendChild(css);

  function pad() {
    var w = slides[0].offsetWidth || 190;
    var p = Math.max(20, (track.clientWidth - w) / 2);
    track.style.paddingLeft = p + 'px';
    track.style.paddingRight = p + 'px';
  }

  function centerOf(el) { return el.offsetLeft + el.offsetWidth / 2; }

  function current() {
    var mid = track.scrollLeft + track.clientWidth / 2, best = 0, d = 1e9;
    slides.forEach(function (s, i) {
      var x = Math.abs(centerOf(s) - mid);
      if (x < d) { d = x; best = i; }
    });
    return best;
  }

  function mark(i) {
    slides.forEach(function (s, k) {
      var on = k === i;
      s.classList.toggle('is-active', on);
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    dots.forEach(function (b, k) {
      var on = k === i;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
  }

  function go(i, smooth) {
    i = (i + slides.length) % slides.length;
    track.scrollTo({ left: centerOf(slides[i]) - track.clientWidth / 2, behavior: smooth === false ? 'auto' : 'smooth' });
    mark(i);
  }

  var idx = 0, ticking = false;
  track.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var i = current();
      if (i !== idx) { idx = i; mark(i); }
    });
  }, { passive: true });

  dots.forEach(function (b, k) {
    b.addEventListener('click', function () { stopAuto(); go(k); startAuto(6000); });
  });

  // Arrastar com o mouse no computador (no celular o toque já rola sozinho).
  var down = false, sx = 0, sl = 0;
  track.addEventListener('mousedown', function (e) {
    down = true; sx = e.pageX; sl = track.scrollLeft;
    track.style.scrollSnapType = 'none'; stopAuto();
  });
  window.addEventListener('mousemove', function (e) { if (down) track.scrollLeft = sl - (e.pageX - sx); });
  window.addEventListener('mouseup', function () {
    if (!down) return;
    down = false; track.style.scrollSnapType = ''; go(current()); startAuto(6000);
  });
  track.addEventListener('touchstart', stopAuto, { passive: true });
  track.addEventListener('touchend', function () { startAuto(6000); }, { passive: true });

  // Avanço automático, só enquanto o carrossel está na tela.
  var timer = null, visible = true;
  function stopAuto() { clearTimeout(timer); timer = null; }
  function startAuto(delay) {
    stopAuto();
    timer = setTimeout(function () {
      if (visible && !document.hidden) go(current() + 1);
      startAuto(3000);
    }, delay || 3000);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.4 }).observe(root);
  }

  pad();
  window.addEventListener('resize', function () { pad(); go(current(), false); });
  window.addEventListener('load', function () { pad(); go(0, false); });
  go(0, false);
  startAuto(2500);
})();

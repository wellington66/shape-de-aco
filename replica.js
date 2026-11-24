window.REPLICA_TOTAL=55; window.REPLICA_SKIP=[36, 6, 13, 14, 15, 21, 23, 24, 25, 27, 28, 29, 30, 31, 33, 34, 35, 40, 42, 43];
/* Navegação da réplica: liga as telas capturadas em sequência */
(function () {
  var step = parseInt(document.body.getAttribute('data-replica-step'), 10);
  var kind = document.body.getAttribute('data-replica-kind') || '';
  var TOTAL = window.REPLICA_TOTAL || 999;
  function file(i) { return i === 0 ? 'index.html' : 'p' + String(i).padStart(2, '0') + '.html'; }
  var SKIP = window.REPLICA_SKIP || [];
  // ordem do funil (copy Lastafit): idade, bem-vindo, conhece, ponte, objetivo, corpo, incômodo, desejado, áreas, foco, 15 min, frequência,
  // agachamento, flexões, flexível, dia típico, peso muda, biótipo, orgulho, dores, ponte dor, intensidade, ponte semanas, altura, peso, meta,
  // água, sono, alimentação, energia, loader, previsão, perfil, libido/testosterona, confiança, e-mail, nome, gráfico, raspadinha, oferta
  var ORDER = window.REPLICA_ORDER = [0, 1, 2, 3, 4, 7, 45, 8, 17, 18, 16, 19, 13, 12, 14, 24, 10, 11, 9, 47, 46, 20, 22, 37, 38, 39, 27, 28, 31, 25, 49, 44, 41, 26, 48, 50, 51, 52, 53, 54];
  function next() { var k = ORDER.indexOf(step), n;
    if (k >= 0 && k < ORDER.length - 1) n = ORDER[k + 1];
    else { n = step + 1; while (SKIP.indexOf(n) >= 0) n++; }
    if (n < TOTAL) location.href = file(n) + location.search; }

  // mobile-first: em tela larga vira uma coluna de celular de 430px
  function desk() {
    var on = window.innerWidth > 460;
    document.documentElement.classList.toggle('sda-desk', on);
    Array.prototype.forEach.call(document.querySelectorAll('body *'), function (el) {
      if (el.closest('[data-test^="sidebar"]')) return;
      if (el.dataset.sdaFix === undefined && getComputedStyle(el).position !== 'fixed') return;
      el.dataset.sdaFix = '1';
      if (on) {
        var full = el.getBoundingClientRect().width >= Math.min(window.innerWidth, 430) - 2 || el.dataset.sdaFull;
        if (full) { el.dataset.sdaFull = '1'; el.style.left = 'calc(50% - 215px)'; el.style.right = 'auto'; el.style.width = '430px'; el.style.maxWidth = '430px'; }
        else {
          if (el.dataset.sdaR === undefined) { var cs = getComputedStyle(el); el.dataset.sdaR = (cs.right !== 'auto' && parseFloat(cs.right) < 200) ? cs.right : ''; el.dataset.sdaL = (cs.left !== 'auto' && parseFloat(cs.left) < 200) ? cs.left : ''; }
          if (el.dataset.sdaR) el.style.right = 'calc(50% - 215px + ' + el.dataset.sdaR + ')';
          else if (el.dataset.sdaL) el.style.left = 'calc(50% - 215px + ' + el.dataset.sdaL + ')';
        }
      } else { el.style.left = el.style.right = el.style.width = el.style.maxWidth = ''; }
    });
  }
  desk(); window.addEventListener('load', desk); window.addEventListener('resize', desk);
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // botões nunca ficam travados por validação
  $$('[data-test*="goNext"], [data-test*="GoNext"]').forEach(function (b) { b.removeAttribute('disabled'); });

  var SEL_TILE = 'option-tile_selected__iNKyz', SEL_CHECK = 'option-checkbox_checked__4wV1r';
  function markOption(btn, on) {
    var tile = $('[class*="option-tile_optionTile"]', btn), cb = $('[class*="option-checkbox_optionCheckbox"]', btn);
    if (tile) tile.classList.toggle(SEL_TILE, on);
    if (cb) cb.classList.toggle(SEL_CHECK, on);
    btn.setAttribute(btn.hasAttribute('aria-checked') ? 'aria-checked' : 'aria-selected', on ? 'true' : 'false');
  }

  // seleção de planos no checkout (copia o padrão de classes do plano já selecionado)
  var planCards = $$('[data-test^="PlanItem-"]');
  var selPairs = [];
  (function () {
    var sel = planCards.filter(function (c) { return c.getAttribute('data-selected') === 'true' || /isSelected/.test(c.className); })[0];
    if (!sel) return;
    [sel].concat($$('*', sel)).forEach(function (el) {
      if (typeof el.className !== 'string') return;
      var cls = el.className.split(/\s+/);
      var s = cls.filter(function (c) { return /isSelected|_selected|_active/.test(c); });
      var base = cls.filter(function (c) { return !/isSelected|_selected|_active/.test(c); })[0];
      s.forEach(function (x) { if (base) selPairs.push([base, x]); });
    });
  })();
  function selectPlan(card) {
    planCards.forEach(function (c) {
      var on = c.getAttribute('data-test') === card.getAttribute('data-test');   // as duas listas de planos ficam iguais
      c.setAttribute('data-selected', on ? 'true' : 'false');
      selPairs.forEach(function (p) {
        [c].concat($$('.' + p[0], c)).forEach(function (el) { if (el.classList.contains(p[0])) el.classList.toggle(p[1], on); });
      });
    });
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    var a = t.closest('a[href="#"]'); if (a) e.preventDefault();
    if (t.closest('[data-test="header__backButton"]')) { e.preventDefault(); history.back(); return; }
    if (t.closest('[data-test="firstPageCard__base"]')) { e.preventDefault(); next(); return; }
    var plan = t.closest('[data-test^="PlanItem-"]'); if (plan) { e.preventDefault(); selectPlan(plan); return; }
    var opt = t.closest('[data-test*="__option "]');
    if (opt && !/option--value_/.test(opt.getAttribute('data-test'))) {
      e.preventDefault();
      if (/multiSelect/.test(opt.getAttribute('data-test'))) {
        markOption(opt, !($('[class*="option-tile"]', opt) || opt).classList.contains(SEL_TILE));
      } else {
        $$('[data-test*="__option "]').forEach(function (o) { markOption(o, o === opt); });
        if (!$('[data-test*="goNext"]') || /singleSelect/.test(kind)) setTimeout(next, 300);
      }
      return;
    }
    var unit = t.closest('[data-test*="option--value_"]');
    if (unit) { e.preventDefault(); return; }
    if (t.closest('[data-test*="goNext"], [data-test*="GoNext"]')) { e.preventDefault(); next(); return; }
    var lab = t.closest('[data-test="checkboxControl__label"]');
    if (lab) { var i = $('input[type=checkbox]', lab.parentNode) ; if (i && e.target !== i) { i.checked = !i.checked; } }
  }, true);

  // loader: anima % e avança
  if (/^loader/.test(kind)) {
    var pct = $$('[data-test="loader__progressCircle"] *').filter(function (el) { return /\d+\s*%/.test(el.textContent) && el.children.length === 0; })[0];
    if (!pct) pct = $$('[data-test="loader__progressCircle"] span').filter(function (el) { return /^\d+$/.test(el.textContent.trim()); })[0];   // número e % em spans separados
    var p = 0, iv = setInterval(function () {
      p = Math.min(100, p + 1); if (pct) pct.textContent = pct.textContent.replace(/\d+/, p);
      if (p >= 100) { clearInterval(iv); setTimeout(next, 400); }
    }, document.getElementById('sda-provas') ? 120 : 45);   // com as provas passando, o carregamento dura ~12 s
  }

  // raspadinha: o dedo/mouse apaga a camada (máscara SVG), depois revela tudo e avança
  if (kind === 'scratchCard') {
    var svg = $('svg[class*="scratch-card_scratchCard"]'), mask = svg && svg.querySelector('mask');
    var anim = $('[data-test="scratchCardBlock__scratchAnimation"]');
    var NS = 'http://www.w3.org/2000/svg', down = false, pts = 0, done = false;
    var vb = svg ? svg.viewBox.baseVal : null;
    function at(e) {
      var t = e.touches ? e.touches[0] : e, r = svg.getBoundingClientRect();
      return [(t.clientX - r.left) * vb.width / r.width, (t.clientY - r.top) * vb.height / r.height];
    }
    function scratch(e) {
      if (!down || done || !mask) return; e.preventDefault();
      var p = at(e), c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', p[0]); c.setAttribute('cy', p[1]); c.setAttribute('r', 32); c.setAttribute('fill', 'black');
      mask.appendChild(c); pts++;
      if (pts > 35) finish();
    }
    function finish() {
      if (done) return; done = true;
      var big = document.createElementNS(NS, 'circle');
      big.setAttribute('cx', vb.width / 2); big.setAttribute('cy', vb.height / 2); big.setAttribute('r', 0); big.setAttribute('fill', 'black');
      mask.appendChild(big);
      var r = 0, iv = setInterval(function () { r += 12; big.setAttribute('r', r); if (r > 360) clearInterval(iv); }, 16);
      setTimeout(next, 2500);
    }
    if (svg) {
      svg.style.touchAction = 'none'; svg.style.cursor = 'pointer';
      svg.addEventListener('pointerdown', function (e) { down = true; if (anim) anim.style.display = 'none'; scratch(e); setTimeout(finish, 1800); });
      svg.addEventListener('pointermove', scratch);
      window.addEventListener('pointerup', function () { if (down && pts >= 1) setTimeout(finish, 250); down = false; });
    }
  }

  // contagem regressiva do checkout (10:00)
  $$('[data-test="header__countdown"], [data-test*="__timer"], [data-test*="Timer__"]').forEach(function (box) {
    var spans = $$('span', box).filter(function (s) { return /^\d+$/.test(s.textContent.trim()); });
    if (spans.length < 2 || box.dataset.cd) return; box.dataset.cd = 1;
    var left = 10 * 60;
    setInterval(function () {
      left = Math.max(0, left - 1);
      spans[0].textContent = String(Math.floor(left / 60)).padStart(2, '0');
      spans[1].textContent = String(left % 60).padStart(2, '0');
    }, 1000);
  });
})();

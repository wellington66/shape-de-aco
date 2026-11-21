/* Motor das telas do funil v2: lê o spec, desenha a tela, guarda a resposta e avança. */
(function () {
  'use strict';
  var N = window.V2_N, S = window.V2[N - 1], TOTAL = window.V2.length;
  var app = document.getElementById('app');
  var A = {}; try { A = JSON.parse(localStorage.getItem('sda') || '{}'); } catch (e) {}
  function save() { try { localStorage.setItem('sda', JSON.stringify(A)); } catch (e) {} }
  var pad = function (n) { return ('0' + n).slice(-2); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var fmt1 = function (x) { return (Math.round(x * 10) / 10).toString().replace('.', ','); };
  var IMG = '../assets/sda/';

  /* ---------- valores derivados das respostas ---------- */
  var MES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var fim = new Date(Date.now() + 28 * 864e5);
  function D() {
    var d = {};
    d.faixa = ['18 a 29 anos', '30 a 39 anos', '40 a 49 anos', '50 anos ou mais'][A.idade != null ? A.idade : 1];
    d.w = A.w || 85; d.g = A.g || (A.obj === 1 ? d.w + 3 : d.w - 8); d.h = A.h || 175;
    var diff = d.w - d.g;
    d.verbo = diff >= 0 ? 'perder' : 'ganhar'; d.d = Math.abs(Math.round(diff * 10) / 10).toString().replace('.', ',');
    d.dias = [3, 4, 5, 6][A.dias != null ? A.dias : 1]; d.min = [15, 20, 30][A.min != null ? A.min : 0];
    d.haN = Math.round(100 * d.dias * 4 / 60); d.hnN = Math.round(d.min * d.dias * 4 / 6) / 10;
    d.ha = d.haN; d.hn = fmt1(d.hnN); d.eco = Math.max(1, Math.round(d.haN - d.hnN));
    var f = A.flx != null ? A.flx : 0; d.nivelIdx = f <= 1 ? 0 : f === 2 ? 1 : 2; d.nivel = ['Iniciante', 'Intermediário', 'Avançado'][d.nivelIdx];
    d.data = fim.getDate() + ' de ' + MES[fim.getMonth()];
    d.imc = d.w / Math.pow(d.h / 100, 2); d.nome = A.nome || '';
    return d;
  }
  var DV = D();
  function f(s) { return String(s == null ? '' : s).replace(/\{(\w+)\}/g, function (m, k) { return DV[k] != null ? esc(DV[k]) : m; }); }

  /* ---------- gráficos ---------- */
  var ANI = '<style>.dr{stroke-dasharray:420;stroke-dashoffset:420;animation:dr 1.6s .3s forwards}@keyframes dr{to{stroke-dashoffset:0}}.fd{opacity:0;animation:fd .8s 1.3s forwards}@keyframes fd{to{opacity:1}}</style>';
  function chartAging() {
    return '<div class="chart"><svg viewBox="0 0 320 200">' + ANI +
      '<text x="12" y="16" fill="#A9B0B9" font-size="11" font-weight="600">Energia e condicionamento</text>' +
      '<line x1="20" y1="170" x2="305" y2="170" stroke="#2A2D33"/><line x1="20" y1="30" x2="20" y2="170" stroke="#2A2D33"/>' +
      '<path class="dr" d="M20 78 C110 88 200 126 300 160" fill="none" stroke="#FF4D4D" stroke-width="4" stroke-linecap="round"/>' +
      '<path class="dr" d="M20 112 C110 100 200 60 300 34" fill="none" stroke="#3DD68C" stroke-width="4" stroke-linecap="round"/>' +
      '<g class="fd"><rect x="196" y="140" width="112" height="22" rx="11" fill="#FF4D4D"/><text x="252" y="155" fill="#fff" font-size="11" font-weight="800" text-anchor="middle">SEM MUDAR NADA</text>' +
      '<rect x="190" y="38" width="118" height="22" rx="11" fill="#3DD68C"/><text x="249" y="53" fill="#06210F" font-size="11" font-weight="800" text-anchor="middle">COM O DESAFIO</text></g>' +
      '<g fill="#7D858F" font-size="11" text-anchor="middle"><text x="26" y="188">Hoje</text><text x="112" y="188">3 meses</text><text x="206" y="188">6 meses</text><text x="292" y="188">12 meses</text></g>' +
      '</svg><div class="cap">Gráfico ilustrativo, não é promessa de resultado.</div></div>';
  }
  function chartTime() {
    var wN = Math.max(0.12, DV.hnN / DV.haN);
    return '<div class="chart"><svg viewBox="0 0 320 190">' + ANI +
      '<text x="4" y="18" fill="#A9B0B9" font-size="12" font-weight="700">Academia (ir + treinar + voltar)</text>' +
      '<rect x="4" y="26" width="312" height="30" rx="8" fill="#2A1618"/><rect x="4" y="26" width="312" height="30" rx="8" fill="#FF4D4D" style="transform-box:fill-box;transform-origin:left center;animation:gw 1.2s .2s both"/>' +
      '<text x="14" y="46" fill="#fff" font-size="14" font-weight="800">' + DV.ha + ' horas no mês</text>' +
      '<text x="4" y="92" fill="#A9B0B9" font-size="12" font-weight="700">Desafio Treino de Aço (em casa)</text>' +
      '<rect x="4" y="100" width="312" height="30" rx="8" fill="#1A2018"/>' +
      '<rect x="4" y="100" width="' + (312 * wN).toFixed(0) + '" height="30" rx="8" fill="#FF5B1F" style="transform-box:fill-box;transform-origin:left center;animation:gw 1.2s .6s both"/>' +
      '<text x="' + Math.max(14, 312 * wN + 12).toFixed(0) + '" y="120" fill="#fff" font-size="14" font-weight="800">' + DV.hn + ' horas</text>' +
      '<style>@keyframes gw{from{transform:scaleX(0)}to{transform:scaleX(1)}}</style>' +
      '<rect x="4" y="146" width="312" height="34" rx="10" fill="rgba(61,214,140,.14)" stroke="#3DD68C"/>' +
      '<text x="160" y="168" fill="#3DD68C" font-size="14" font-weight="800" text-anchor="middle">+ ' + DV.eco + ' horas livres e R$ 0 de mensalidade</text>' +
      '</svg><div class="cap">Estimativa: 40 min de deslocamento + 60 min de treino por dia de academia.</div></div>';
  }
  function chartNivel() {
    var lv = ['Iniciante', 'Intermediário', 'Avançado'], h = [50, 85, 120], out = '';
    lv.forEach(function (n, i) {
      var on = i === DV.nivelIdx, x = 14 + i * 104;
      out += '<rect x="' + x + '" y="' + (150 - h[i]) + '" width="96" height="' + h[i] + '" rx="10" fill="' + (on ? '#FF5B1F' : '#23262C') + '"/>' +
        '<text x="' + (x + 48) + '" y="' + (150 - h[i] + 22) + '" fill="' + (on ? '#fff' : '#7D858F') + '" font-size="12" font-weight="800" text-anchor="middle">' + n + '</text>' +
        (on ? '<text x="' + (x + 48) + '" y="' + (150 - h[i] - 8) + '" fill="#FF8A4C" font-size="12" font-weight="800" text-anchor="middle">▼ VOCÊ COMEÇA AQUI</text>' : '');
    });
    return '<div class="chart"><svg viewBox="0 0 320 170">' + out + '</svg><div class="cap">Semana a semana você sobe de nível.</div></div>';
  }
  function chartPeso() {
    var w = DV.w, g = DV.g, pts = [0, .22, .52, 1].map(function (p) { return w + (g - w) * p; });
    var lo = Math.min(w, g), hi = Math.max(w, g), span = Math.max(1, hi - lo);
    var X = [30, 120, 210, 296], Y = pts.map(function (v) { return 30 + (hi - v) / span * 100; }), lab = ['Hoje', '7 dias', '14 dias', '28 dias'];
    var path = 'M' + X[0] + ' ' + Y[0] + ' C' + (X[0] + 50) + ' ' + Y[0] + ' ' + (X[1] - 30) + ' ' + Y[1] + ' ' + X[1] + ' ' + Y[1] +
      ' S' + (X[2] - 30) + ' ' + Y[2] + ' ' + X[2] + ' ' + Y[2] + ' S' + (X[3] - 40) + ' ' + Y[3] + ' ' + X[3] + ' ' + Y[3];
    var dots = '', txt = '';
    for (var i = 0; i < 4; i++) {
      dots += '<circle class="fd" cx="' + X[i] + '" cy="' + Y[i] + '" r="6" fill="' + (i === 3 ? '#3DD68C' : '#FF5B1F') + '" stroke="#fff" stroke-width="2"/>';
      txt += '<text x="' + X[i] + '" y="172" fill="#7D858F" font-size="11" text-anchor="middle">' + lab[i] + '</text>' +
        '<text class="fd" x="' + X[i] + '" y="' + (Y[i] - 12) + '" fill="#E8EBEF" font-size="12" font-weight="800" text-anchor="middle">' + fmt1(pts[i]) + ' kg</text>';
    }
    return '<div class="chart"><svg viewBox="0 0 320 185">' + ANI +
      '<line x1="14" y1="150" x2="310" y2="150" stroke="#2A2D33"/>' +
      '<path class="dr" d="' + path + '" fill="none" stroke="#FF5B1F" stroke-width="4" stroke-linecap="round"/>' + dots + txt +
      '</svg><div class="cap">Estimativa ilustrativa, os resultados variam de pessoa para pessoa.</div></div>';
  }
  function bmiCat(i) { return i < 18.5 ? 0 : i < 25 ? 1 : i < 30 ? 2 : 3; }
  function chartImc() {
    var imc = DV.imc, pts = [15, 18.5, 25, 30, 40], pos = 0;
    for (var i = 0; i < 4; i++) if (imc >= pts[i]) pos = i * 25 + Math.min(1, (imc - pts[i]) / (pts[i + 1] - pts[i])) * 25;
    pos = Math.max(2, Math.min(98, pos));
    var cat = bmiCat(imc), names = ['Abaixo do peso', 'Normal', 'Acima do peso', 'Obeso'];
    var msg = [
      ['Seu corpo precisa de força, não só de peso', 'Com pouca massa muscular, o cansaço e a falta de força chegam mais rápido. O treino certo constrói base sem te esgotar.'],
      ['Peso normal, mas o corpo pede estímulo', 'Mesmo com o peso na faixa, sedentarismo derruba energia, postura e disposição. É aí que a barriga aparece primeiro.'],
      ['Alerta: excesso de gordura abdominal', 'Acima do peso, a gordura na barriga aumenta o risco de pressão alta, diabetes e dores nas articulações. Quanto antes você agir, mais fácil é reverter.'],
      ['Alerta crítico: seu corpo está sobrecarregado', 'Nessa faixa o risco para coração, pressão e articulações já é alto. Por isso o seu plano começa com baixo impacto e evolui devagar.']][cat];
    var exp = ['Sedentário', 'Já tentou e parou', 'Treina às vezes'][A.exp != null ? A.exp : 0];
    return '<div class="chart" style="padding:16px"><div style="font-weight:700;font-size:14px;margin-bottom:12px">Índice de Massa Corporal (IMC)</div>' +
      '<div style="position:relative;margin:30px 4px 6px"><div style="position:absolute;left:' + pos + '%;top:-28px;transform:translateX(-50%);background:#fff;color:#111;font-weight:800;font-size:12px;border-radius:6px;padding:2px 8px;white-space:nowrap">Você: ' + fmt1(imc) + '</div>' +
      '<div style="height:12px;border-radius:8px;background:linear-gradient(90deg,#4DA3FF 0 25%,#3DD68C 25% 50%,#FFC24D 50% 75%,#FF4D4D 75% 100%)"></div>' +
      '<div style="position:absolute;left:' + pos + '%;top:-4px;width:20px;height:20px;border-radius:50%;background:#fff;border:4px solid #0B0C0E;transform:translateX(-50%)"></div></div>' +
      '<div style="display:flex;justify-content:space-between;font-size:10.5px;color:#A9B0B9;margin-top:8px">' + names.map(function (n, i) { return '<span style="' + (i === cat ? 'color:#fff;font-weight:800' : '') + '">' + n + '</span>'; }).join('') + '</div></div>' +
      '<div class="alert"><b>' + msg[0] + '</b>' + msg[1] + '</div>' +
      '<div class="stats"><div><small>Estilo de vida</small><b>' + exp + '</b></div><div><small>Nível de condicionamento</small><b>' + DV.nivel + '</b></div><div><small>Foco do seu plano</small><b>Eliminar a gordura da barriga e recuperar energia</b></div></div>' +
      '<div class="fine">O IMC é uma referência e não substitui avaliação médica.</div>';
  }

  /* ---------- placar ---------- */
  function scores() {
    var inc = A.inc || [], pain = inc.length, org = A.org != null ? A.org : 1, esp = A.esp != null ? A.esp : 1, rec = A.rec != null ? A.rec : 1, flx = A.flx != null ? A.flx : 0;
    var cl = function (v, a, b) { return Math.max(a, Math.min(b, Math.round(v))); };
    var imcPen = DV.imc >= 30 ? 14 : DV.imc >= 25 ? 8 : 0;
    return [
      ['Autoestima', cl(56 - org * 7 - esp * 4 - pain * 2, 14, 62), 0],
      ['Energia no dia a dia', cl(60 - pain * 4 - (inc.indexOf(2) >= 0 ? 8 : 0) - rec * 2, 14, 62), 0],
      ['Condicionamento físico', cl(22 + flx * 12 - imcPen, 10, 70), 0],
      ['Risco de gordura abdominal', cl(36 + imcPen * 2 + pain * 4 + org * 3, 30, 90), 1]
    ];
  }

  /* ---------- montagem ---------- */
  var h = '<div class="hd">' + (N > 1 ? '<button id="bk" aria-label="Voltar">‹</button>' : '<span class="sp"></span>') +
    '<img src="../marca/logo-header.svg" alt="Desafio Treino de Aço"><span class="sp"></span></div><div class="bar"><i style="width:' + Math.round(N / TOTAL * 100) + '%"></i></div>';
  var cta = '';
  function ctaBtn(label, id, dis) { cta = '<div class="cta"><button id="' + (id || 'go') + '"' + (dis ? ' disabled' : '') + '>' + esc(label) + '</button></div>'; }
  function go() {
    document.documentElement.style.opacity = .6;
    location.href = N < TOTAL ? 'q' + pad(N + 1) + '.html' + location.search : 'p53.html' + location.search;
  }

  if (S.kind) document.body.setAttribute('data-replica-kind', S.kind);
  var title = S.title ? '<h1>' + f(S.title) + '</h1>' : '';
  var kick = S.kicker ? '<div class="kick">' + f(S.kicker) + '</div>' : '';
  var sub = S.sub ? '<p class="sub">' + f(S.sub) + '</p>' : '';

  if (S.t === 'choice' || S.t === 'multi') {
    var multi = S.t === 'multi', sel = multi ? (A[S.key] || []) : [];
    var o = S.opts.map(function (op, i) {
      var inner = (op.img ? '<img src="' + IMG + op.img + '" alt="">' : '') + (op.e ? '<span class="em">' + op.e + '</span>' : '') + '<span class="tx">' + esc(op.l) + '</span>' + '<span class="ck">✓</span>';
      return '<button class="opt' + (op.img ? ' img' : '') + (multi && sel.indexOf(i) >= 0 ? ' on' : '') + '" data-i="' + i + '">' + inner + '</button>';
    }).join('');
    app.innerHTML = h + kick + title + sub + (S.img ? '<img class="qimg" src="' + IMG + S.img + '" alt="">' : '') +
      '<div class="opts ' + (S.cols === 2 ? 'c2 ' : '') + (multi ? 'multi' : '') + '" id="ops">' + o + '</div>';
    if (multi) { ctaBtn('Continuar', 'go', !sel.length); }
    document.getElementById('ops').addEventListener('click', function (e) {
      var b = e.target.closest('.opt'); if (!b) return; var i = +b.dataset.i;
      if (!multi) {
        A[S.key] = i; if (S.key === 'fis') A['singleSelect_21642'] = i; if (S.key === 'flx') A['singleSelect_21644'] = i; save();
        Array.prototype.forEach.call(document.querySelectorAll('.opt'), function (x) { x.classList.toggle('on', x === b); });
        setTimeout(go, 240);
      } else {
        var k = sel.indexOf(i); if (k >= 0) sel.splice(k, 1); else sel.push(i); b.classList.toggle('on'); A[S.key] = sel.slice(); save();
        document.getElementById('go').disabled = !sel.length;
      }
    });
  } else if (S.t === 'info') {
    var media = '';
    if (S.chart === 'aging') media = chartAging(); else if (S.chart === 'time') media = chartTime(); else if (S.chart === 'nivel') media = chartNivel();
    else if (S.chart === 'peso') media = chartPeso(); else if (S.chart === 'imc') media = chartImc();
    else if (S.img) media = '<img class="hero' + (S.imgWide ? ' wide' : '') + (S.imgPose ? ' pose' : '') + '" src="' + IMG + S.img + '" alt="">';
    var bl = S.bullets ? '<ul class="bul">' + S.bullets.map(function (b) { return '<li>' + f(b) + '</li>'; }).join('') + '</ul>' : '';
    app.innerHTML = h + title + media + (S.body ? '<p class="body" style="margin-top:14px">' + f(S.body) + '</p>' : '') + bl;
    ctaBtn(S.cta || 'Continuar');
  } else if (S.t === 'delta') {
    app.innerHTML = h + '<div class="delta"><div style="color:#A9B0B9;font-weight:700;margin-top:22px">Para chegar à sua meta, você precisa</div><div class="big">' + (DV.verbo === 'perder' ? '−' : '+') + DV.d + ' kg</div>' +
      '<div class="row"><div class="pill"><small>Balança hoje</small>' + fmt1(DV.w) + ' kg</div><span style="color:#FF5B1F;font-size:22px">→</span><div class="pill"><small>Sua meta</small>' + fmt1(DV.g) + ' kg</div></div></div>' +
      '<p class="body">' + f(S.body) + '</p>';
    ctaBtn(S.cta);
  } else if (S.t === 'ruler' || S.t === 'scale') {
    var key = S.key, def = A[key] || (key === 'g' ? DV.g : S.def), val = Math.max(S.min, Math.min(S.max, def));
    var scaleSvg = S.t === 'scale' ?
      '<svg class="scale" viewBox="0 0 230 230"><rect x="10" y="10" width="210" height="210" rx="34" fill="#1E2126" stroke="#2A2D33" stroke-width="3"/>' +
      '<rect x="48" y="30" width="134" height="62" rx="14" fill="#0B0C0E" stroke="#FF5B1F" stroke-width="3"/>' +
      '<text id="sv" x="115" y="76" fill="#FF5B1F" font-size="40" font-weight="800" text-anchor="middle" font-family="Anton,Impact,sans-serif">' + val + '</text>' +
      '<g fill="#2A2D33"><ellipse cx="88" cy="150" rx="22" ry="40"/><ellipse cx="142" cy="150" rx="22" ry="40"/></g>' +
      '<text x="115" y="106" fill="#7D858F" font-size="12" text-anchor="middle">KG</text></svg>' : '';
    app.innerHTML = h + title + sub + scaleSvg + '<div class="rv"><span id="rv">' + val + '</span><small>' + S.unit + '</small></div>' +
      '<div class="rng"><button id="mn" aria-label="Menos">−</button><input id="rg" type="range" min="' + S.min + '" max="' + S.max + '" value="' + val + '"><button id="mx" aria-label="Mais">+</button></div>';
    ctaBtn('Continuar');
    var rg = document.getElementById('rg');
    var upd = function () { document.getElementById('rv').textContent = rg.value; var sv = document.getElementById('sv'); if (sv) sv.textContent = rg.value; };
    rg.addEventListener('input', upd);
    document.getElementById('mn').onclick = function () { rg.value = +rg.value - 1; upd(); };
    document.getElementById('mx').onclick = function () { rg.value = +rg.value + 1; upd(); };
    window.__saveRuler = function () { A[key] = +rg.value; save(); };
  } else if (S.t === 'input') {
    app.innerHTML = h + title + sub + '<input class="inp" id="in" type="' + S.type + '" placeholder="' + esc(S.ph) + '" autocomplete="' + (S.key === 'email' ? 'email' : 'given-name') + '" value="' + esc(A[S.key] || '') + '"><div class="err" id="er">' + esc(S.err) + '</div>';
    ctaBtn(S.cta, 'go');
    window.__saveInput = function () {
      var v = document.getElementById('in').value.trim();
      var ok = S.key === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) : v.length >= 2;
      if (!ok) { var er = document.getElementById('er'); er.style.display = 'block'; return false; }
      A[S.key] = S.key === 'nome' ? v.split(' ')[0] : v; save(); return true;
    };
  } else if (S.t === 'loader') {
    var steps = ['Lendo o seu perfil', 'Calculando o seu IMC e a sua meta', 'Montando as 4 semanas do seu desafio', 'Ajustando para ' + DV.dias + ' dias de ' + DV.min + ' minutos', 'Plano pronto'];
    app.innerHTML = h + '<div class="ld"><h1 style="margin-top:6px">Montando o seu Desafio Treino de Aço</h1><div class="pc" id="pc">0%</div><div class="tk"><i id="tk"></i></div>' +
      '<ul>' + steps.map(function (s) { return '<li><i>✓</i>' + esc(s) + '</li>'; }).join('') + '</ul></div>';
    var li = document.querySelectorAll('.ld li'), t0 = Date.now(), dur = 6800;
    var iv = setInterval(function () {
      var p = Math.min(1, (Date.now() - t0) / dur); document.getElementById('pc').textContent = Math.round(p * 100) + '%'; document.getElementById('tk').style.width = p * 100 + '%';
      Array.prototype.forEach.call(li, function (e, k) { e.classList.toggle('on', p >= (k + 1) / steps.length - .02); });
      if (p >= 1) { clearInterval(iv); setTimeout(go, 500); }
    }, 90);
  } else if (S.t === 'result') {
    var sc = scores();
    app.innerHTML = h + '<div class="kick">RESULTADO DO SEU TESTE</div><h1>' + (DV.nome ? esc(DV.nome) + ', do ' : 'Do ') + 'jeito que está, <em>seu corpo está te travando</em></h1>' +
      '<p class="body">Mas dá para mudar em 28 dias. Esta é a sua pontuação de hoje, calculada com as suas respostas:</p><div class="score">' +
      sc.map(function (r) { var col = r[2] ? (r[1] > 60 ? '#FF4D4D' : '#FFC24D') : (r[1] < 35 ? '#FF4D4D' : '#FFC24D');
        return '<div class="r"><div class="t"><span>' + r[0] + '</span><span style="color:' + col + '">' + r[1] + '</span></div><div class="tr"><i data-w="' + r[1] + '" style="background:' + col + '"></i></div></div>'; }).join('') +
      '</div><div class="fine">Pontuação estimada de 0 a 100 (quanto mais alto o risco, pior). Não é diagnóstico médico.</div>' +
      '<div class="alert" style="margin-top:18px"><b>A próxima tela mostra o que muda em 28 dias</b>Prepare-se: você ganhou um desconto especial por ter concluído o teste.</div>';
    ctaBtn('Quero mudar isso agora');
    setTimeout(function () { Array.prototype.forEach.call(document.querySelectorAll('.tr i'), function (i) { i.style.width = i.dataset.w + '%'; }); }, 80);
  }

  if (N === 1) app.insertAdjacentHTML('beforeend', '<div class="legal">Ao continuar você concorda com os <a href="../legal/termos.html">Termos de Uso</a> e a <a href="../legal/privacidade.html">Política de Privacidade</a>.</div>');
  if (cta) app.insertAdjacentHTML('beforeend', cta);
  var bk = document.getElementById('bk'); if (bk) bk.onclick = function () { history.back(); };
  var gb = document.getElementById('go');
  if (gb) gb.addEventListener('click', function () {
    if (window.__saveRuler) window.__saveRuler();
    if (window.__saveInput && !window.__saveInput()) return;
    go();
  }, true);
  /* o botão do e-mail/nome também precisa ser reconhecido pelo personal.js (Lead) */
  if (gb && S.t === 'input') gb.setAttribute('data-test', 'goNext');
  window.addEventListener('pageshow', function () { document.documentElement.style.opacity = ''; });
  window.scrollTo(0, 0);
})();

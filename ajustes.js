/* Ajustes de coerência e validação do funil. Não mexe em pixel, GA, Clarity, al.js nem nos rótulos das etapas.
   Carregado ANTES do personal.js: as travas (capture na janela) rodam antes dele, e os textos são trocados depois que ele termina. */
(function () {
  'use strict';
  var kind = document.body.getAttribute('data-replica-kind') || '';
  var A = {}; try { A = JSON.parse(localStorage.getItem('sda') || '{}'); } catch (e) {}
  function save() { try { localStorage.setItem('sda', JSON.stringify(A)); } catch (e) {} }
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var num = function (v) { return parseFloat(String(v || '').replace(',', '.')); };
  function txt(fn) { var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n; while ((n = w.nextNode())) { var v = fn(n.nodeValue, n); if (v != null && v !== n.nodeValue) n.nodeValue = v; } }
  function erro(msg) {
    var el = $('#sda-erro');
    if (!el) { el = document.createElement('p'); el.id = 'sda-erro'; el.setAttribute('role', 'alert');
      el.style.cssText = 'color:#FF6B6B;font-size:14px;line-height:1.4;margin:10px 20px 0;text-align:center;font-weight:600';
      var inp = $('input:not([type=checkbox])'); (inp && inp.closest('form,div') ? inp.closest('div').parentNode : document.body).appendChild(el); }
    el.textContent = msg; el.style.display = 'block';
  }

  /* ---------- 1) travas: o replica.js destrava todos os botões, então qualquer valor passava (e o Lead disparava com e-mail vazio) ---------- */
  var REG = { questionHeight: [90, 243, 'Digite uma altura entre 90 e 243 cm.'], questionCurrentWeight: [25, 300, 'Digite um peso entre 25 e 300 kg.'], questionTargetWeight: [25, 300, 'Digite um peso entre 25 e 300 kg.'] };
  var regra = Object.keys(REG).filter(function (k) { return kind.indexOf(k) === 0; })[0];
  var isEmail = /email/.test(kind);
  if (regra || isEmail) {
    window.addEventListener('click', function (e) {
      if (!e.target.closest || !e.target.closest('[data-test*="goNext"], [data-test*="GoNext"]')) return;
      var inp = $('input:not([type=checkbox])'), v = inp ? inp.value.trim() : '', ok;
      if (isEmail) ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      else { var x = num(v); ok = isFinite(x) && x >= REG[regra][0] && x <= REG[regra][1]; }
      if (ok) { var er = $('#sda-erro'); if (er) er.style.display = 'none'; return; }
      e.preventDefault(); e.stopImmediatePropagation();      // não avança e não dispara o Lead
      erro(isEmail ? 'Digite um e-mail válido para receber o seu acesso.' : REG[regra][2]);
    }, true);
  }

  /* ---------- 2) meta de peso realista na projeção (antes do personal.js ler) ---------- */
  if (/^infoPage_12101/.test(kind) && A.w && A.g) {
    var w = A.w, g = A.g;
    if (w - g > 6) A.g = Math.round(w - 6); else if (g - w > 5) A.g = Math.round(w + 5);
    if (A.g !== g) save();
  }

  /* ---------- 3) regiões de foco escolhidas (p17) para a p18 ---------- */
  if (/^multiSelect_21686/.test(kind)) {
    window.addEventListener('click', function (e) {
      if (!e.target.closest || !e.target.closest('[data-test*="goNext"], [data-test*="GoNext"]')) return;
      var sel = $$('[class*="option-checkbox_checked"]').map(function (c) { var b = c.closest('[role="button"]') || c.parentNode; var t = $('[class*="list-option_title"]', b); return t ? t.textContent.trim() : ''; }).filter(Boolean);
      A = JSON.parse(localStorage.getItem('sda') || '{}'); A.regioes = sel; save();
    }, true);
  }

  /* ---------- 4) textos que seguem as respostas (depois que o personal.js termina) ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    try { A = JSON.parse(localStorage.getItem('sda') || '{}'); } catch (e) {}
    var goal = A.singleSelect_21632;
    var G = [
      { verbo: 'perder peso e secar a barriga', curto: 'perder peso', obj: 'perder peso e secar a barriga' },
      { verbo: 'ganhar força e músculos', curto: 'ganhar força', obj: 'ganhar força e músculos' },
      { verbo: 'ter mais saúde e disposição', curto: 'ter mais saúde', obj: 'ter mais saúde e disposição' }
    ][goal];

    // p47 / p48 / p52: o objetivo da p04 em vez de "ganhar músculo" para todo mundo
    if (G && /^multiSelect_21672/.test(kind)) txt(function (v) { return v.replace('ganhar massa muscular', G.verbo); });
    if (G && /^singleSelect_21673/.test(kind)) txt(function (v) { return v.replace('ganhar músculo', G.curto); });
    if (G && /progress-graph/.test(kind)) txt(function (v) { return v.replace('Objetivo: ganhar músculo e definir o corpo', 'Objetivo: ' + G.obj); });

    // p11: nome e texto do tipo físico (copy Lastafit), pela resposta da p10 (0 ecto, 1 meso, 2 endo)
    if (/^infoPage_8289/.test(kind)) {
      var bi = A.singleSelect_21642 || 0;
      var bn = $('#sda-bio-nome'), bt = $('#sda-bio-txt');
      if (bn) bn.textContent = ['Ectomorfo', 'Mesomorfo', 'Endomorfo'][bi] || 'Ectomorfo';
      if (bt) bt.textContent = [
        'Pro seu corpo é mais difícil ganhar massa e ver mudança no espelho. Mas com a rotina certa isso muda.',
        'Seu corpo ganha peso fácil e solta devagar. Mas a mudança está ao seu alcance.',
        'Você engorda fácil e demora mais pra emagrecer. Mas isso tem jeito.'][bi] || bt.textContent;
    }

    // p18: foco = regiões marcadas na p17
    if (/^infoPage_8317/.test(kind) && A.regioes && A.regioes.length) {
      var nomes = { 'Barriga grande': 'barriga', 'Peitoral caído': 'peitoral', 'Braços finos': 'braços', 'Pernas finas': 'pernas' };
      var lista = A.regioes.map(function (r) { return nomes[r]; }).filter(Boolean);
      var fo = $('#sda-foco');
      if (fo && lista.length) fo.textContent = lista.length > 1 ? lista.slice(0, -1).join(', ') + ' e ' + lista[lista.length - 1] : lista[0];
    }

    // p22: intensidade escolhida na p20
    if (/^infoPage_8297/.test(kind)) { var pf = ['Bem leve', 'Intermediário', 'Mais ativo', 'Ideal para você'][A.singleSelect_21653];
      var pe = $('#sda-pref'); if (pf && pe) pe.textContent = pf; }

    // p41: nível de energia vem da p25
    if (/^infoPage_8309/.test(kind)) { var en = ['Quase Nulo', 'Instável', 'Enérgico'][A.singleSelect_21661];
      if (en) $$('p').forEach(function (p) { if (p.textContent.trim() === 'Baixo') p.textContent = en; }); }

    // p41: a pergunta de estilo de vida foi cortada, então não mostramos uma resposta inventada
    if (/^infoPage_8309/.test(kind)) $$('p').forEach(function (p) { if (p.textContent.trim() === 'Estilo de vida') { var li = p.closest('li'); if (li) li.style.display = 'none'; } });

    // p49: o tempo por treino que a pessoa escolheu na p20 (dentro da faixa de 10 a 25 min do app)
    if (/^loader_11576/.test(kind)) { var m = '15 minutos';
      var lt = $('[data-test="loader__title"]'); if (m && lt) lt.textContent = m + ' por dia'; }
  });
})();

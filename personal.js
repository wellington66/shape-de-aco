/* Shape de Aço: guarda as respostas e personaliza as telas */
(function () {
  var kind = document.body.getAttribute('data-replica-kind') || '';
  var A = {}; try { A = JSON.parse(localStorage.getItem('sda') || '{}'); } catch (e) {}
  function save() { localStorage.setItem('sda', JSON.stringify(A)); }
  var $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  function txt(fn) { var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); var n; while ((n = w.nextNode())) { var v = fn(n.nodeValue, n); if (v != null && v !== n.nodeValue) n.nodeValue = v; } }
  var MES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  var MC = ['jan.','fev.','mar.','abr.','mai.','jun.','jul.','ago.','set.','out.','nov.','dez.'];
  var hoje = new Date(), fim = new Date(Date.now() + 28 * 864e5);
  function longa(d, ano) { return d.getDate() + ' de ' + MES[d.getMonth()] + (ano ? ' de ' + d.getFullYear() : ''); }
  function curta(d) { return d.getDate() + ' de ' + MC[d.getMonth()]; }
  var num = function (v) { return parseFloat(String(v || '').replace(',', '.')); };

  // ---- guardar respostas ----
  document.addEventListener('click', function (e) {
    var card = e.target.closest('[data-test="firstPageCard__base"]');
    if (card) { A.idade = $$('[data-test="firstPageCard__base"]').indexOf(card); save(); }
    var opt = e.target.closest('[data-test*="__option "]');
    if (opt) { var m = /idx_(\d+)/.exec(opt.getAttribute('data-test')); if (m) { A[kind] = +m[1]; save(); } }
    if (e.target.closest('[data-test*="goNext"]')) {
      var v = ($('input:not([type=checkbox])') || {}).value;
      if (v) {
        if (/^questionHeight/.test(kind)) A.h = num(v);
        else if (/^questionCurrentWeight/.test(kind)) A.w = num(v);
        else if (/^questionTargetWeight/.test(kind)) A.g = num(v);
        else if (/^questionAge/.test(kind)) A.anos = num(v);
        else if (/email/.test(kind)) A.email = v.trim();
        else if (/funnel-prompts/.test(kind)) A.nome = v.trim().split(' ')[0];
        save();
      }
    }
  }, true);


  // ---- pixel Meta (mesmo do Treino Pro); não dispara em teste local ----
  var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === 'file:';
  function fb() { if (window.fbq) window.fbq.apply(null, arguments); }
  if (!LOCAL) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1566100141500586'); fbq('track', 'PageView');
    if (kind === 'checkoutPersonalized') fbq('track', 'ViewContent', { content_name: 'Shape de Aço - checkout', currency: 'BRL', value: 29.90 });
  }
  document.addEventListener('click', function (e) {
    if (/email/.test(kind) && e.target.closest('[data-test*="goNext"]')) fb('track', 'Lead');
  }, true);

  // ---- checkout: botões levam à oferta da Cakto do plano escolhido ----
  if (kind === 'checkoutPersonalized') {
    var OF = { 'PlanItem-Teste-de-1-semana': ['pmotdrk', 19.90], 'PlanItem-Plano-de-4-Semanas': ['38ynh82', 29.90], 'PlanItem-Plano-de-12-Semanas': ['qjk7tw4', 39.90] };
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-test="header__ctaButton"]')) {
        e.preventDefault(); e.stopPropagation();
        var lst = $('[data-test="checkoutChoosePlan__planListContainer"]'); if (lst) lst.scrollIntoView({ behavior: 'smooth', block: 'center' }); return;
      }
      var b = e.target.closest('[data-test="checkout__mainButton"], [data-test="checkout__bottomButton"]');
      if (!b) return;
      e.preventDefault(); e.stopPropagation();
      var sec = b.closest('[data-test^="checkoutChoosePlan__base"]') || document;
      var sel = sec.querySelector('[data-test^="PlanItem-"][data-selected="true"]') || document.querySelector('[data-test^="PlanItem-"][data-selected="true"]');
      var o = OF[sel ? sel.getAttribute('data-test') : 'PlanItem-Plano-de-4-Semanas'] || OF['PlanItem-Plano-de-4-Semanas'];
      fb('track', 'InitiateCheckout', { currency: 'BRL', value: o[1] });
      var url = 'https://pay.cakto.com.br/' + o[0] + location.search;
      // painel de rastreio: registra a ida ao checkout e leva a sessão (alsid) e as utm para a venda voltar ligada à visita
      if (window.alCheckout) url = window.alCheckout(url, { pmotdrk: '7d', '38ynh82': '28d', qjk7tw4: '90d' }[o[0]]);
      location.href = url;
    }, true);
  }

  // ---- derivados ----
  var bio = ['Ectomorfo', 'Mesomorfo', 'Endomorfo'][A['singleSelect_21642'] || 0];
  var flex = A['singleSelect_21644']; var nivel = flex == null ? 'Iniciante' : ['Iniciante', 'Iniciante', 'Intermediário', 'Avançado'][flex];
  var vida = ['Sedentário', 'Ativo', 'Moderado', 'Variável'][A['singleSelect_21660'] || 0];
  var meta = { Ectomorfo: 'Rápido, dificuldade para ganhar músculo', Mesomorfo: 'Equilibrado, responde bem ao treino', Endomorfo: 'Lento, tende a acumular gordura' }[bio];

  // ---- aplicar ----
  if (kind === 'infoPage_8319' && A.idade != null) {
    var faixa = ['casa dos 20 anos', 'casa dos 30 anos', 'casa dos 40 anos', 'casa dos 50 anos ou mais'][A.idade];
    txt(function (v) { return v.replace('casa dos 20 anos', faixa); });
  }
  if (kind === 'infoPage_8289') {
    var desc = { Mesomorfo: 'Você ganha e perde peso com facilidade. Isso é ótimo: com o treino certo, seu corpo responde rápido e define com facilidade.',
                 Endomorfo: 'Você tende a ganhar peso com facilidade, mas isso não é um limite. Com o treino certo dá para queimar gordura e ganhar músculo ao mesmo tempo.' }[bio];
    txt(function (v) { v = v.replace('biótipo Ectomorfo', 'biótipo ' + bio); if (desc && /^Você pode ter dificuldade/.test(v.trim())) v = desc; return v; });
  }
  if (kind === 'infoPage_8309') {
    if (A.h && A.w) {
      var imc = A.w / Math.pow(A.h / 100, 2), pts = [15, 18.5, 25, 30, 40], pos = 0;
      for (var i = 0; i < 4; i++) if (imc >= pts[i]) pos = i * 25 + Math.min(1, (imc - pts[i]) / (pts[i + 1] - pts[i])) * 25;
      pos = Math.max(0, Math.min(100, pos));
      var sl = $('[class*="bmi-scale_slider_"]'); if (sl) sl.style.insetInlineStart = 'calc(' + pos.toFixed(2) + '% - 8px)';
      txt(function (v) { return v.replace(/Você: [\d,]+/, 'Você: ' + imc.toFixed(1).replace('.', ',')); });
      var cat = imc < 18.5 ? 0 : imc < 25 ? 1 : imc < 30 ? 2 : 3;
      $$('[class*="bmi-scale_scaleValue"]').forEach(function (p, k) { p.classList.toggle('bmi-scale_isSelected__QKL23', k === cat); });
      var note = $('[class*="bmi-note_container"]'); if (note && cat < 2) note.style.display = 'none';
    }
    txt(function (v) { var t = v.trim();
      if (t === 'Ectomorfo') return v.replace(t, bio); if (t === 'Sedentário') return v.replace(t, vida);
      if (t === 'Avançado') return v.replace(t, nivel); if (t === 'Rápido, dificuldade para ganhar músculo') return v.replace(t, meta); });
  }
  if (kind === 'infoPage_12101') {
    var g = A.g || A.w;
    txt(function (v, n) { var t = v.trim();
      if (g && t === '85' && n.parentNode.tagName === 'B') return v.replace('85', Math.round(g));
      if (t === '9 de novembro de 2026') return v.replace(t, longa(fim, true));
      if (t === '2 de nov.') return v.replace(t, curta(hoje)); if (t === '9 de nov.') return v.replace(t, curta(fim));
      if (g && /^Objetivo/.test(t)) return v.replace('85', Math.round(g));
    });
    if (g) $$('[class*="weightLabel"]').forEach(function (s, k, all) { s.textContent = Math.round(g) - 2 + k; });
  }
  if (kind === 'singleSelect_21673') txt(function (v) { return v.replace('até 9 de novembro', 'até ' + longa(fim)); });
  if (kind === '/pt/progress-graph/default') txt(function (v) { return v.trim() === 'Teste' ? v.replace('Teste', A.nome || 'Atleta') : v; });
  if (kind === 'checkoutPersonalized') {
    var cur = $$('[data-test="conditionalInfo__infoValue infoValue--block_current"]');
    if (cur[1]) cur[1].textContent = nivel;
  }
})();

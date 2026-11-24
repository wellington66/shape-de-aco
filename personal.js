/* Desafio Treino de Aço: guarda as respostas e personaliza as telas */
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
        else if (/email/.test(kind)) {
          A.email = v.trim();
          // guarda o e-mail para recuperar a venda (Recupera Pix / lista de leads)
          if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(A.email)) {
            try { fetch('https://recupera-pix-eosin.vercel.app/api/lead', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ email: A.email, nome: A.nome || '', utm: location.search.slice(0, 400) }) }).catch(function () {}); } catch (e) {}
          }
        }
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
    if (kind === 'checkoutPersonalized') fbq('track', 'ViewContent', { content_name: 'Desafio Treino de Aço - checkout', currency: 'BRL', value: 29.90 });
  }
  document.addEventListener('click', function (e) {
    if (/email/.test(kind) && e.target.closest('[data-test*="goNext"]')) { fb('track', 'Lead'); ga('event', 'generate_lead', { currency: 'BRL', value: 0 }); cl('event', 'lead'); }
  }, true);

  // ---- Google Analytics 4 (G-9DZ4FVST4X) + Microsoft Clarity (z9hm23z554); não disparam em teste local ----
  // etapa do funil (meta al-passo: "NN|título") vira etiqueta no Clarity
  var passo = (document.querySelector('meta[name="al-passo"]') || {}).content || '';
  var etapa = passo ? ('0' + passo.split('|')[0]).slice(-2) + ' ' + passo.split('|').slice(1).join('|') : document.title;
  var qs = new URLSearchParams(location.search);
  function ga() { if (window.gtag) window.gtag.apply(null, arguments); }
  function cl() { if (window.clarity) window.clarity.apply(null, arguments); }
  if (!LOCAL) {
    var gs = document.createElement('script'); gs.async = true; gs.src = 'https://www.googletagmanager.com/gtag/js?id=G-9DZ4FVST4X'; document.head.appendChild(gs);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    // a tag do Google manda o page_view sozinha (com o <title>, igual em todas); a etapa aparece pelo caminho (p05.html...)
    gtag('config', 'G-9DZ4FVST4X');
    (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "z9hm23z554");
    // etiquetas do Clarity: filtrar gravações e mapas de calor por etapa, origem e campanha
    cl('set', 'etapa', etapa);
    ['utm_source', 'utm_campaign', 'utm_medium', 'utm_content'].forEach(function (k) { if (qs.get(k)) cl('set', k, qs.get(k)); });
    if (kind === 'checkoutPersonalized') {
      ga('event', 'view_item', { currency: 'BRL', value: 29.90, items: [{ item_id: '38ynh82', item_name: 'Desafio Treino de Aço - 28 dias', price: 29.90 }] });
      cl('event', 'viu_checkout');
    }
  }

  // ---- checkout: botões levam à oferta da Cakto do plano escolhido ----
  if (kind === 'checkoutPersonalized') {
    var OF = { 'PlanItem-Teste-de-1-semana': ['pmotdrk', 19.90], 'PlanItem-Plano-de-4-Semanas': ['38ynh82', 29.90], 'PlanItem-Plano-de-12-Semanas': ['qjk7tw4', 49.90] };
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-test="header__ctaButton"], [data-test="checkout__mainButton"], [data-test="checkout__bottomButton"]');
      if (!b) return;
      e.preventDefault(); e.stopPropagation();
      var sec = b.closest('[data-test^="checkoutChoosePlan__base"]') || document;
      var sel = sec.querySelector('[data-test^="PlanItem-"][data-selected="true"]') || document.querySelector('[data-test^="PlanItem-"][data-selected="true"]');
      var o = OF[sel ? sel.getAttribute('data-test') : 'PlanItem-Plano-de-4-Semanas'] || OF['PlanItem-Plano-de-4-Semanas'];
      // InitiateCheckout fica só com a Cakto (dispara ao abrir o checkout); disparar aqui também contava em dobro
      // checkout atual: Wiapy (um link por plano). Os códigos curtos antigos (pmotdrk, 38ynh82, qjk7tw4) continuam como chave interna do plano.
      var url = 'https://pay.wiapy.com/' + { pmotdrk: 'wnqwKqL0b3fc', '38ynh82': '5jGsM3YvdZxi', qjk7tw4: 'LFVM1ODpEndQ' }[o[0]] + location.search;
      // painel de rastreio: registra a ida ao checkout e leva a sessão (alsid) e as utm para a venda voltar ligada à visita
      if (window.alCheckout) url = window.alCheckout(url, { pmotdrk: '7d', '38ynh82': '28d', qjk7tw4: '90d' }[o[0]]);
      var plano = { pmotdrk: '7 dias', '38ynh82': '28 dias', qjk7tw4: '90 dias' }[o[0]];
      cl('set', 'plano', plano); cl('event', 'clicou_checkout');
      // GA manda por beacon; o callback (ou 800 ms) garante o envio antes de sair para a Cakto
      var foi = false; function ir() { if (!foi) { foi = true; try { localStorage.setItem('sda_tentou', String(Date.now())); } catch (e) {} location.href = url; } }
      if (window.gtag && !LOCAL) {
        gtag('event', 'begin_checkout', { currency: 'BRL', value: o[1], items: [{ item_id: o[0], item_name: 'Desafio Treino de Aço - ' + plano, price: o[1] }], transport_type: 'beacon', event_callback: ir });
        setTimeout(ir, 800);
      } else ir();
    }, true);
  }

  // ---- 3º toque seguido no mesmo plano leva ao checkout dele (1º e 2º só marcam; a seleção é do replica.js) ----
  if (kind === 'checkoutPersonalized') {
    var ultimoPlano = null, toques = 0;
    document.addEventListener('click', function (e) {
      var pl = e.target.closest('[data-test^="PlanItem-"]'); if (!pl) return;
      var id = pl.getAttribute('data-test');
      if (ultimoPlano !== id) { ultimoPlano = id; toques = 1; return; }    // 1º toque: o replica.js marca o plano
      if (++toques < 3) return;                                          // 2º toque: só marca
      toques = 0; e.preventDefault(); e.stopImmediatePropagation();
      var bt = $('[data-test="checkout__mainButton"]'); if (bt) bt.click();   // mesmo caminho do botão (aviso do 7 dias, GA, painel, Cakto)
    }, true);
    var tm = document.createElement('style'); tm.textContent = '[data-test^="PlanItem-"],[data-test^="checkout"][data-test$="Button"],[data-test="header__ctaButton"]{touch-action:manipulation}'; document.head.appendChild(tm);
  }

  // ---- derivados ----
  var bio = ['Ectomorfo', 'Mesomorfo', 'Endomorfo'][A['singleSelect_21642'] || 0];
  var flex = A['singleSelect_21644']; var nivel = flex == null ? 'Iniciante' : ['Iniciante', 'Iniciante', 'Intermediário', 'Avançado'][flex];
  var vida = ['Sedentário', 'Ativo', 'Moderado', 'Variável'][A['singleSelect_21660'] || 0];
  var meta = { Ectomorfo: 'Rápido, dificuldade para ganhar músculo', Mesomorfo: 'Equilibrado, responde bem ao treino', Endomorfo: 'Lento, tende a acumular gordura' }[bio];

  // ---- aplicar ----
  if (kind === 'infoPage_8319' && A.idade != null) {
    var faixa = ['casa dos 30 anos', 'casa dos 40 anos', 'casa dos 50 anos', 'casa dos 60 anos ou mais'][A.idade];
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
      // celular: balão "Você: X" não pode sair do cartão (IMC muito alto ou muito baixo)
      var box = $('[class*="bmi-scale_container"]'), lab = $('[class*="bmi-scale_sliderLabel"]');
      var prenderBalao = function () {
        if (!box || !lab) return;
        var W = box.clientWidth, lw = lab.offsetWidth, centro = W * pos / 100;
        var esq = Math.max(0, Math.min(W - lw, centro - lw / 2));
        lab.style.setProperty('left', (esq - (centro - 8)) + 'px', 'important');
        lab.style.setProperty('transform', 'none', 'important');
        lab.style.setProperty('transition', 'opacity .7s ease-in-out 3s', 'important');
      };
      prenderBalao(); setTimeout(prenderBalao, 300); window.addEventListener('resize', prenderBalao);
    }
    // celular: as 4 faixas (Abaixo do peso / Normal / Acima do peso / Obeso) cabem numa linha só
    var st = document.createElement('style');
    st.textContent = '[class*="bmi-scale_scaleValue"]{white-space:nowrap;word-break:normal!important;font-size:clamp(9.5px,3.1vw,12px)!important;letter-spacing:-.1px}' +
      // celular estreito: "Ectomorfo"/"Condicionamento" sem quebrar no meio da palavra
      '[class*="bmi-block-list_list"] *{word-break:normal!important;overflow-wrap:normal!important;hyphens:none!important}' +
      '@media (max-width:400px){[class*="bmi-block-list_list"]{min-width:165px}[class*="bmi-block_image"]{max-width:105px!important}}';
    document.head.appendChild(st);
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
  if (kind === '/pt/progress-graph/default') txt(function (v) { return v.trim() === 'Perfeito para iniciantes' ? v.replace('Perfeito para iniciantes', 'Feito para o nível ' + nivel) : v; });
  if (kind === 'checkoutPersonalized') {
    var cur = $$('[data-test="conditionalInfo__infoValue infoValue--block_current"]');
    if (cur[1]) cur[1].textContent = nivel;
    if (A.nome) { var h = $('[data-test="beforeAfterResultsSection__heading"]'); if (h) h.innerHTML = String(A.nome).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }) + ', seu desafio de 28 dias de <span style="color:var(--themeAccentColor)">calistenia militar</span> começa hoje'; }
    // FAQ abre e fecha ao tocar na pergunta
    document.addEventListener('click', function (e) {
      var q = e.target.closest('[data-test^="faqItem__question"]'); if (!q) return;
      var it = q.closest('[data-test="faq__item"]'), ab = !it.classList.contains('faq-item_faqItemOpened__fTPGw');
      it.classList.toggle('faq-item_faqItemOpened__fTPGw', ab); it.classList.toggle('faq-item_faqItem__bV4M6', !ab);
    });
  }
})();

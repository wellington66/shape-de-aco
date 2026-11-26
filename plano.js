/* Entrada da página de vendas: antes/depois que cabe no celular + "seu plano personalizado" com as respostas do quiz */
(function () {
  if ((document.body.getAttribute('data-replica-kind') || '') !== 'checkoutPersonalized') return;
  var A = {}; try { A = JSON.parse(localStorage.getItem('sda') || '{}'); } catch (e) {}
  var hero = document.querySelector('.before-after-results-section_heroContainer__BeciP'); if (!hero) return;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var kg = function (n) { return Math.round(n) + ' kg'; };
  var bio = ['Ectomorfo', 'Mesomorfo', 'Endomorfo'][A['singleSelect_21642']];
  var fx = A['singleSelect_21644'], nivel = A.nivel || (fx == null ? 'Iniciante' : ['Iniciante', 'Iniciante', 'Intermediário', 'Avançado'][fx]);
  // fotos do topo conforme o quiz: ANTES = porte físico atual, DEPOIS = físico que ele quer
  var ANTES = { 'Magro': 'magro', 'Porte médio': 'medio', 'Forte / encorpado': 'encorpado', 'Acima do peso': 'acima' };
  var DEPOIS = { 'Alguns quilos a menos': 'seco', 'Atlético': 'atletico', 'Definido': 'definido', 'Forte e volumoso': 'forte' };
  // sem resposta do quiz: padrão acima do peso → atlético (mesmo homem do funil)
  var imgA = 'assets/sda/ba/antes-' + (ANTES[A.porte] || 'acima') + '.webp?v=2';
  var imgD = 'assets/sda/ba/depois-' + (DEPOIS[A.fisico] || 'atletico') + '.webp?v=2';
  var porteTx = { 'Forte / encorpado': 'Encorpado' }[A.porte] || A.porte;
  var fisTx = { 'Alguns quilos a menos': 'Mais seco' }[A.fisico] || A.fisico;
  var freqTx = A.freq ? A.freq.replace(' vezes', 'x') + '/semana' : '';
  var durTx = A.duracao && A.duracao !== 'Não sei' ? A.duracao : '';
  var nome = A.nome ? esc(A.nome) : '';
  var imc = (A.h && A.w) ? A.w / Math.pow(A.h / 100, 2) : 0;
  var faixa = !imc ? '' : imc < 18.5 ? 'abaixo do ideal' : imc < 25 ? 'na faixa normal' : imc < 30 ? 'acima do ideal' : 'acima do ideal';
  var passos = ['Seu corpo e seu biotipo', 'Seu peso e sua meta', 'Seu nível de condicionamento', 'Seu tempo e rotina'];
  var lido = [];
  if (A.w && A.g) lido.push(['Peso', kg(A.w) + ' → meta ' + kg(A.g)]);
  if (imc) lido.push(['IMC', imc.toFixed(1).replace('.', ',') + ' (' + faixa + ')']);
  if (porteTx) lido.push(['Corpo hoje', porteTx + (fisTx ? ' → ' + fisTx : '')]);
  else if (bio) lido.push(['Biotipo', bio]);
  lido.push(['Nível', nivel]);
  if (durTx || freqTx) lido.push(['Seu treino', [durTx, freqTx].filter(Boolean).join(' · ')]);
  if (A.intensidade) lido.push(['Intensidade', A.intensidade]);
  if (A.areas && A.areas.length && A.areas[0] !== 'Nenhuma das anteriores') lido.push(['Foco', A.areas.slice(0, 2).join(', ')]);
  if (A.objetivo) lido.push(['Objetivo', A.objetivo]);
  if (A.libido) lido.push(['Vigor', 'Libido e disposição de volta']);
  if (lido.length % 2) lido[lido.length - 1].push('full');
  var motivo = bio === 'Endomorfo' ? 'Seu corpo acumula gordura com facilidade, então o plano combina queima de gordura com força.' :
    bio === 'Ectomorfo' ? 'Seu corpo tem dificuldade de ganhar massa, então o plano foca em força e músculo.' :
    bio === 'Mesomorfo' ? 'Seu corpo responde rápido ao treino, então o plano acelera definição e força.' :
    'Cada corpo responde de um jeito, por isso o plano é ajustado ao seu.';
  var css = '.sda-hero{width:100%;box-sizing:border-box;padding:0 4px;font-family:var(--font),sans-serif;color:#E8EBEF}' +
    '.sda-hero *{box-sizing:border-box}' +
    '.sda-sel{display:flex;align-items:center;gap:8px;justify-content:center;background:rgba(58,174,146,.14);border:1px solid rgba(58,174,146,.5);color:#8FE0C8;border-radius:999px;padding:8px 14px;font-size:13px;font-weight:700;letter-spacing:.3px;margin:4px auto 12px;width:max-content;max-width:100%}' +
    '.sda-t{font-size:23px;line-height:1.2;font-weight:800;text-align:center;margin:0 0 8px}.sda-t em{font-style:normal;color:#FF5B1F}' +
    '.sda-s{font-size:14.5px;line-height:1.45;color:#A9B0B9;text-align:center;margin:0 4px 14px}.sda-s b{color:#E8EBEF}' +
    '.sda-ck{list-style:none;margin:0 0 14px;padding:12px 14px;background:#16181C;border:1px solid #2a2d33;border-radius:16px}' +
    '.sda-ck li{display:flex;align-items:center;gap:10px;font-size:14px;padding:5px 0}' +
    '.sda-ck li:before{content:"✓";flex:none;width:20px;height:20px;border-radius:50%;background:#3AAE92;color:#0B0C0E;font-weight:900;font-size:12px;display:flex;align-items:center;justify-content:center}' +
    '.sda-card{background:#16181C;border:1px solid #2a2d33;border-radius:16px;padding:14px;margin-bottom:14px}' +
    '.sda-card h4{margin:0 0 10px;font-size:15px;font-weight:800;text-align:center}.sda-card h4 em{font-style:normal;color:#FF5B1F}' +
    '.sda-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.sda-grid div{background:#0B0C0E;border-radius:12px;padding:10px}.sda-grid small{display:block;font-size:11px;color:#A9B0B9;margin-bottom:2px}.sda-grid b{display:block;font-size:14px;font-weight:800;line-height:1.25}' +
    '.sda-card p{margin:10px 0 0;font-size:13.5px;color:#C9CED5;text-align:center;line-height:1.45}' +
    '.sda-ba{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.sda-ba figure{margin:0;position:relative;border-radius:16px;overflow:hidden;background:#1A1C20;aspect-ratio:4/5}' +
    '.sda-ba img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 12%}' +
    '.sda-ba figcaption{position:absolute;left:8px;right:8px;bottom:8px;text-align:center;font-size:12px;font-weight:800;letter-spacing:.6px;padding:7px 4px;border-radius:10px;background:rgba(11,12,14,.82);color:#E8EBEF}' +
    '.sda-ba figure.dep{box-shadow:0 0 0 2px #FF5B1F}.sda-ba figure.dep figcaption{background:#FF5B1F;color:#0B0C0E}' +
    '.sda-ba .seta{position:absolute;left:50%;top:50%;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;background:#FF5B1F;color:#0B0C0E;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;z-index:2;border:3px solid #0B0C0E}' +
    '.sda-nt{font-size:11.5px;color:#7D858F;text-align:center;margin:8px 0 14px}' +
    '.sda-inc{list-style:none;margin:0 0 14px;padding:0}.sda-inc li{display:flex;gap:10px;font-size:14px;line-height:1.4;padding:6px 0;border-bottom:1px solid #22252a}.sda-inc li:last-child{border:0}.sda-inc li:before{content:"→";color:#FF5B1F;font-weight:900}' +
    '.sda-cta{display:block;width:100%;text-align:center;background:#FF5B1F;color:#0B0C0E;font-weight:800;font-size:16px;border-radius:24px;padding:15px 12px;text-decoration:none;margin-bottom:6px}' +
    '.sda-fn{font-size:12px;color:#A9B0B9;text-align:center;margin:0 0 6px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var box = document.createElement('div'); box.className = 'sda-hero';
  box.innerHTML =
    '<div class="sda-sel">✓ ANÁLISE CONCLUÍDA</div>' +
    '<h2 class="sda-t">' + (nome ? nome + ', seu' : 'Seu') + ' plano <em>personalizado</em> está pronto</h2>' +
    '<div class="sda-ba"><figure><img src="' + imgA + '" alt="Antes" fetchpriority="high"><figcaption>HOJE</figcaption></figure><div class="seta">›</div>' +
    '<figure class="dep"><img src="' + imgD + '" alt="Depois" fetchpriority="high"><figcaption>EM 28 DIAS</figcaption></figure></div>' +
    '<p class="sda-nt">Imagem ilustrativa. Resultados variam de pessoa para pessoa.</p>' +
    '<div class="sda-card"><h4>O que suas respostas <em>revelaram</em></h4><div class="sda-grid">' +
    lido.map(function (i) { return '<div' + (i[2] ? ' style="grid-column:1/-1"' : '') + '><small>' + i[0] + '</small><b>' + esc(i[1]) + '</b></div>'; }).join('') +
    '</div></div>' +
    '<a class="sda-cta" href="#oferta">Quero meu plano personalizado</a><p class="sda-fn">Pagamento único · Acesso vitalício · 30 dias de garantia</p>';
  Array.prototype.slice.call(hero.children).forEach(function (c) { c.style.display = 'none'; });
  hero.insertBefore(box, hero.firstChild);

  // ---- ordem: primeiro o que ela recebe, depois as provas sociais; CTAs com texto melhor ----
  var seps = Array.prototype.slice.call(document.querySelectorAll('.pv-sep')), tx = function (e) { return (e.textContent || '').trim(); };
  var sRes = seps.filter(function (e) { return /RESULTADOS REAIS/.test(tx(e)); })[0];
  var sRec = seps.filter(function (e) { return /O QUE VOCÊ RECEBE/.test(tx(e)); })[0];
  var sPara = seps.filter(function (e) { return /PARA QUEM/.test(tx(e)); })[0];
  var head = document.querySelector('.pv-head');
  if (head) head.innerHTML = '<h2>Veja tudo o que <em>você vai receber</em></h2><p>Seu plano de 28 dias fica no celular assim que o pagamento for confirmado.</p>';
  if (sRes && sRec && sPara && sRes.parentNode === sRec.parentNode) {
    var grupo = [], n = sRec;
    while (n && n !== sPara) { grupo.push(n); n = n.nextElementSibling; }
    var cta = document.createElement('div'); cta.className = 'sda-bloco pv';
    cta.innerHTML = '<a class="pv-cta" href="#oferta">Quero receber tudo isso agora</a><p class="sda-fn" style="margin-top:8px">Pagamento único · Acesso vitalício · 30 dias de garantia</p>';
    grupo.forEach(function (g) { sRes.parentNode.insertBefore(g, sRes); });
    sRes.parentNode.insertBefore(cta, sRes);
  }

  // ---- logo depois das provas, a oferta; "Para quem é" vai para depois dos planos ----
  var plano = document.querySelector('[data-test="checkoutPlanSelectWithBonusInsidePlanSection__base"]');
  var sPara2 = seps.filter(function (e) { return /PARA QUEM/.test(tx(e)); })[0];
  if (plano && sPara2) {
    var cont = plano; while (cont && cont.parentNode !== sPara2.parentNode) cont = cont.parentNode;
    var obj = sPara2.nextElementSibling;
    if (cont && obj) { cont.parentNode.insertBefore(obj, cont.nextSibling); cont.parentNode.insertBefore(sPara2, obj); }
  }
})();

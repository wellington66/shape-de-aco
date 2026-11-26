/* Ordem da p54 (pedido 25/11): antes/depois → o que recebe → benefícios → bônus → provas sociais → checkout (planos + formulário).
   Depois do checkout: garantia, para quem é, dúvidas. "Quanto custa" e o 2º bloco de planos ficam escondidos (o checkout já está acima). Nada é apagado. */
(function () {
  var hero = document.querySelector('.before-after-results-section_heroContainer__BeciP');
  var par = document.querySelector('.page_pageContainerNoHeader__5TsgJ') || (hero && hero.closest('section') && hero.closest('section').parentNode);
  if (!par) return;
  var kids = Array.prototype.slice.call(par.children);
  var tx = function (e) { return (e.textContent || '').replace(/\s+/g, ' ').trim(); };
  var kidOf = function (el) { while (el && el.parentNode !== par) el = el.parentNode; return el; };
  var sep = function (re) { return kids.filter(function (k) { return k.classList.contains('pv-sep') && re.test(tx(k)); })[0]; };
  var ate = function (ini, fim) { var r = [], n = ini; while (n && n !== fim) { r.push(n); n = n.nextElementSibling; } return r; };

  var heroK = kidOf(hero);
  var planos = Array.prototype.slice.call(par.querySelectorAll('[data-test="checkoutChoosePlan__base"]')).map(kidOf);
  var p1 = planos[0], p2 = planos[planos.length - 1];
  var head = par.querySelector('.pv-head'); head = head && kidOf(head);
  var sRec = sep(/O QUE VOCÊ RECEBE/), sBon = sep(/BÔNUS/), sRes = sep(/RESULTADOS REAIS/), sPara = sep(/PARA QUEM/), sDuv = sep(/DÚVIDAS/), sOf = sep(/SUA OFERTA/), sGar = sep(/GARANTIA/);
  var fim = kids.filter(function (k) { return /horizontal-divider/.test(k.className); })[0] || kids.filter(function (k) { return /page_legals/.test(k.className); })[0];
  if (!heroK || !p1 || !fim || !sBon || !sRes) return;

  // cada bloco vai do seu marcador até o próximo marcador (vale qualquer que seja a ordem atual)
  var marcas = [head, sRec, sBon, sRes, sPara, sDuv, sOf, sGar, p1, p2, fim].filter(Boolean);
  var corte = function (ini) { if (!ini) return []; var r = [ini], n = ini.nextElementSibling; while (n && marcas.indexOf(n) < 0) { r.push(n); n = n.nextElementSibling; } return r; };
  var recebe = corte(head).concat(corte(sRec));
  var bonus = corte(sBon);
  var provas = corte(sRes);
  var paraQuem = corte(sPara);
  var duvidas = corte(sDuv);
  var oferta = corte(sOf);
  var plan1 = corte(p1);
  var plan2 = p2 !== p1 ? corte(p2) : [];
  var garantia = corte(sGar);

  // ---- benefícios (bloco novo, mesmo visual dos separadores e cartões da página) ----
  var css = document.createElement('style');
  css.textContent = '#sda-benef{padding:4px 16px 8px;max-width:520px;margin:0 auto;width:100%;box-sizing:border-box}' +
    '#sda-benef h3{font-size:24px;font-weight:700;line-height:1.2;text-align:center;color:#EBE1D3;margin:4px 0 16px}' +
    '#sda-benef ul{list-style:none;margin:0;padding:0;display:grid;gap:10px}' +
    '#sda-benef li{display:flex;gap:12px;align-items:flex-start;background:#201E19;border:1px solid #2E2B24;border-radius:16px;padding:14px}' +
    '#sda-benef li i{flex:none;width:26px;height:26px;border-radius:50%;background:#A6A055;color:#050300;font-style:normal;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:14px}' +
    '#sda-benef b{display:block;color:#EBE1D3;font-size:16px;margin-bottom:2px}#sda-benef span{color:#B3AA9C;font-size:14px;line-height:1.4}';
  css.textContent += '#sda-provas .pv-quotes{display:none}.pv-bonus .pv-car{display:none}'; // e sem o carrossel de prints da comunidade no bônus // 25/11: sem as 2 mensagens de elogio abaixo dos prints
  document.head.appendChild(css);
  var bSep = sBon.cloneNode(true); bSep.textContent = 'BENEFÍCIOS';
  var bBox = document.createElement('div'); bBox.id = 'sda-benef';
  var B = [
    ['Barriga menor e roupa mais folgada', 'Treino de corpo inteiro que acelera a queima de gordura, semana após semana.'],
    ['Mais força e disposição', 'Você sente o corpo mais firme e o cansaço do dia a dia diminuir.'],
    ['Só 15 minutos por dia', 'Cabe antes do trabalho ou à noite, sem mudar sua rotina.'],
    ['Em casa, sem academia e sem equipamento', 'Só com o peso do próprio corpo. Nada de mensalidade.'],
    ['Confiança de volta', 'Tirar a camisa na praia ou em casa sem vergonha.']
  ];
  bBox.innerHTML = '<h3>O que muda na sua vida</h3><ul>' + B.map(function (b) { return '<li><i>✓</i><div><b>' + b[0] + '</b><span>' + b[1] + '</span></div></li>'; }).join('') + '</ul>';

  var ordem = [heroK].concat(recebe, [bSep, bBox], bonus, provas, plan1, garantia, paraQuem, duvidas);
  ordem.forEach(function (el) { if (el) par.insertBefore(el, fim); });
  // escondidos (não apagados): "Quanto custa" e o 2º bloco de planos
  oferta.concat(plan2).forEach(function (el) { if (el) { par.insertBefore(el, fim); el.style.display = 'none'; } });
  // separador "SUA OFERTA" vira o título do checkout
  if (sOf) { var sCk = sOf.cloneNode(true); sCk.style.display = ''; sCk.textContent = 'GARANTA SEU DESAFIO'; par.insertBefore(sCk, p1); }
  // o formulário fica sempre no 1º bloco de planos
  var mb = p1.querySelector('[data-test="checkout__mainButton"]'); var ck = document.getElementById('ck');
  if (mb && ck && ck.previousSibling !== mb) mb.parentNode.insertBefore(ck, mb.nextSibling);
})();

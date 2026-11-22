/* Pop-ups da página de vendas (p54). Não mexe em pixel, GA, Clarity, al.js nem nos rótulos das etapas.
   1) Quem escolhe o plano de 7 dias e toca no botão vê a oferta dos 28 dias por R$ 24,90 (botão "não quero" continua com 7 dias).
   2) Ao tentar sair: 1º ("espere, queremos te ajudar") = R$ 24,90; 2º (irônico, "você ganhou") = R$ 19,90; 3º (desesperado) = R$ 19,90 com garantia.
   Os cupons (VOLTA17 = 24,90 e ULTIMA33 = 19,90) estão no produto da Cakto e entram pelo link (?coupon=). */
(function () {
  'use strict';
  if ((document.body.getAttribute('data-replica-kind') || '') !== 'checkoutPersonalized') return;
  var BASE = 'https://pay.kirvano.com/ff03c33f-12cd-48dd-8f6f-d5687c28c0f5';           // plano de 28 dias (checkout principal)
  var OFERTAS = {
    up:   { img: 'assets/saida/saida-up.png', cupom: 'VOLTA17', btn: 'QUERO OS 28 DIAS POR R$ 24,90', nao: 'Não quero, continuar com o plano de 7 dias' },
    s24:  { cupom: 'VOLTA17', de: 'R$ 29,90', por: 'R$ 24,90', t: 'Espere, não saia ainda!', p: 'A gente quer te ajudar a começar o seu desafio. Por isso liberamos um <b>desconto especial</b> só para você, agora.', btn: 'QUERO MEU DESCONTO ESPECIAL', nao: 'Não, obrigado' },
    s19:  { cupom: 'ULTIMA33', de: 'R$ 24,90', por: 'R$ 19,90', t: 'Tá bom… você ganhou.', p: 'Pode ir. Sério. Só que, olha que coincidência, o preço caiu de novo: <b>R$ 19,90</b>. Mas fique à vontade, a gente não vai insistir. <i>(muito)</i>', btn: 'TÁ BOM, VOU LEVAR POR R$ 19,90', nao: 'Vou sair mesmo assim' },
    s19b: { cupom: 'ULTIMA33', de: 'R$ 29,90', por: 'R$ 19,90', t: 'Por favor, não vá embora!', p: 'A gente está implorando: é o <b>menor preço</b> que conseguimos fazer, menos que um lanche. E ainda tem <b>7 dias de garantia</b>: se não gostar, devolvemos tudo.', btn: 'TÁ BEM, EU FICO POR R$ 19,90', nao: 'Não, deixa eu ir' }
  };
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) {} return null; }
  var aberto = false, ultimoFechar = 0;

  // pré-carrega as imagens quando a página fica parada, para o pop-up abrir na hora
  setTimeout(function () { Object.keys(OFERTAS).forEach(function (k) { if (OFERTAS[k].img) { var i = new Image(); i.src = OFERTAS[k].img; } }); }, 2500);

  var css = document.createElement('style');
  css.textContent = '#sda-pop{position:fixed;inset:0;z-index:2147483000;background:rgba(0,0,0,.78);display:flex;align-items:center;justify-content:center;padding:14px;-webkit-overflow-scrolling:touch}' +
    '#sda-pop .bx{position:relative;width:100%;max-width:430px;max-height:100%;overflow:auto;background:#0B0C0E;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.6);text-align:center}' +
    '#sda-pop img{display:block;width:100%;height:auto;border-radius:18px 18px 0 0}' +
    '#sda-pop .x{position:absolute;top:8px;right:10px;width:36px;height:36px;border:0;border-radius:50%;background:rgba(0,0,0,.55);color:#fff;font-size:22px;line-height:36px;cursor:pointer}' +
    '#sda-pop .tx{padding:34px 20px 4px;font-family:Arial,Helvetica,sans-serif;color:#E8EBEF}' +
    '#sda-pop .tx small{display:block;font-size:12px;font-weight:800;letter-spacing:.14em;color:#FF5B1F;margin-bottom:14px}' +
    '#sda-pop .tx h2{margin:0 0 12px;font-size:28px;line-height:1.12;font-weight:900}' +
    '#sda-pop .tx p{margin:0 0 16px;font-size:16px;line-height:1.45;color:#C9CED5}' +
    '#sda-pop .tx p b{color:#fff}' +
    '#sda-pop .pr{display:flex;align-items:center;justify-content:center;gap:12px;margin:0 0 4px}' +
    '#sda-pop .pr s{color:#9aa1ab;font-size:16px}' +
    '#sda-pop .pr strong{background:#FF5B1F;color:#0B0C0E;font-size:34px;font-weight:900;padding:8px 18px;border-radius:12px}' +
    '#sda-pop .go{display:block;width:calc(100% - 32px);margin:14px 16px 6px;padding:16px 10px;border:0;border-radius:14px;background:#FF5B1F;color:#0B0C0E;font:900 17px/1.1 Arial,Helvetica,sans-serif;letter-spacing:.3px;cursor:pointer}' +
    '#sda-pop .no{display:block;width:100%;padding:12px 16px 18px;border:0;background:none;color:#9aa1ab;font:14px Arial,Helvetica,sans-serif;text-decoration:underline;cursor:pointer}';
  document.head.appendChild(css);

  function irPara(of) {
    var o = OFERTAS[of], url = BASE + '?coupon=' + o.cupom + (location.search ? '&' + location.search.slice(1) : '');
    if (window.alCheckout) url = window.alCheckout(url, '28d');   // só avisa o painel de rastreio (sessão e utm)
    location.href = url;
  }

  function abrir(of, aoFechar) {
    if (aberto) return; aberto = true;
    var o = OFERTAS[of], d = document.createElement('div');
    d.id = 'sda-pop'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
    var topo = o.img ? '<img src="' + o.img + '" alt="Oferta do Desafio Treino de Aço">' :
      '<div class="tx"><small>TREINO DE AÇO · 28 DIAS</small><h2>' + o.t + '</h2><p>' + o.p + '</p><div class="pr"><s>' + o.de + '</s><strong>' + o.por + '</strong></div></div>';
    d.innerHTML = '<div class="bx"><button class="x" aria-label="Fechar">×</button>' + topo +
      '<button class="go">' + o.btn + '</button><button class="no">' + o.nao + '</button></div>';
    document.body.appendChild(d);
    function fechar(cont) { if (d.parentNode) d.parentNode.removeChild(d); aberto = false; ultimoFechar = Date.now(); if (cont && aoFechar) aoFechar(); }
    d.querySelector('.go').onclick = function () { irPara(of); };
    d.querySelector('.no').onclick = function () { fechar(true); };
    d.querySelector('.x').onclick = function () { fechar(of !== 'up'); };
    d.addEventListener('click', function (e) { if (e.target === d) fechar(of !== 'up'); });
  }

  // 1) plano de 7 dias: antes de ir ao checkout, oferece os 28 dias
  window.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-test="header__ctaButton"], [data-test="checkout__mainButton"], [data-test="checkout__bottomButton"]');
    if (!b || ss('sda_up') === '1') return;
    var sec = b.closest('[data-test^="checkoutChoosePlan__base"]') || document;
    var sel = sec.querySelector('[data-test^="PlanItem-"][data-selected="true"]') || document.querySelector('[data-test^="PlanItem-"][data-selected="true"]');
    if (!sel || sel.getAttribute('data-test') !== 'PlanItem-Teste-de-1-semana') return;
    e.preventDefault(); e.stopImmediatePropagation();
    ss('sda_up', '1');
    abrir('up', function () { b.click(); });                      // "não quero": segue com o plano de 7 dias
  }, true);

  // 2) tentativa de sair: 1º = 24,90, 2º = 19,90
  function sair() {
    if (aberto || Date.now() - ultimoFechar < 4000) return;
    var n = +(ss('sda_exit') || 0);
    if (n >= 3) return;
    ss('sda_exit', String(n + 1));
    abrir(['s24', 's19', 's19b'][n]);
  }
  // computador: mouse sai pelo topo da janela
  document.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY <= 0) sair(); });
  // celular: botão voltar (as 3 primeiras vezes mostram o pop-up; depois deixa sair)
  try {
    history.pushState({ sda: 1 }, '', location.href);
    window.addEventListener('popstate', function () {
      var n = +(ss('sda_exit') || 0);
      if (n < 3) { history.pushState({ sda: 1 }, '', location.href); sair(); }
    });
  } catch (e) {}
})();

/* Checkout Cakto embutido na própria página (teste). Pix: QR Code aqui mesmo. Cartão: SDK da Cakto gera o token no navegador. */
(function () {
  var PLANOS = { pmotdrk: ['7d', 'Desafio 7 dias', 19.90], '38ynh82': ['28d', 'Desafio 28 dias', 29.90], qjk7tw4: ['90d', 'Desafio 90 dias', 49.90] };
  var APP = 'https://shape-de-aco-app.vercel.app/';
  var API = location.origin + '/api/';
  var TAXA = 0.99; // taxa de serviço da Cakto, paga pelo comprador por cima do preço da oferta
  var st = { plano: '28d', nome: 'Desafio 28 dias', preco: 29.90, metodo: 'pix', pedido: null, timer: null, sdk: null, idem: null };

  function uuid() { return (crypto.randomUUID && crypto.randomUUID()) || ('x' + Date.now() + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)); }
  function brl(v) { return 'R$ ' + Number(v).toFixed(2).replace('.', ','); }
  function $(s, r) { return (r || document).querySelector(s); }
  function carregar(src) { return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
  function fp() { try { var k = localStorage.getItem('ck_fp'); if (!k) { k = 'fp_' + uuid(); localStorage.setItem('ck_fp', k); } return k; } catch (e) { return 'fp_' + uuid(); } }
  function utm() { var q = new URLSearchParams(location.search), o = {}; ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'sck'].forEach(function (k) { if (q.get(k)) o[k] = q.get(k); });
    try { var sid = localStorage.getItem('al_sid'); if (sid && !o.sck) o.sck = 'al_' + sid; } catch (e) {} return o; }

  // ---------- estilo: mesmo visual da página (fundo escuro, cartões dos planos, fonte e botão dela) ----------
  var css = document.createElement('style');
  css.textContent = [
    '#ck{--t:#EBE1D3;--t2:rgba(235,225,211,.62);--ln:rgba(235,225,211,.12);--cd:#201E19;--bg:#050300;--or:#A6A055;width:100%;margin:18px 0 8px;color:var(--t);font-family:gilroyFont,"gilroyFont Fallback",var(--font-aeonik-pro),system-ui,sans-serif;text-align:left;scroll-margin-top:96px}',
    '#ck *{box-sizing:border-box;font-family:inherit}',
    '.ck-h{font-size:24px;font-weight:600;line-height:1.2;margin:0 0 6px;text-align:center}',
    '.ck-hs{font-size:14px;color:var(--t2);margin:0 0 18px;text-align:center}',
    '.ck-et{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--or);margin:18px 0 10px}',
    '.ck-et i{font-style:normal;display:inline-flex;width:20px;height:20px;border-radius:50%;background:var(--or);color:var(--bg);align-items:center;justify-content:center;font-size:11px}',
    '.ck-card{background:var(--cd);border:1px solid var(--ln);border-radius:16px;padding:14px}',
    '.ck-campo{position:relative;margin-bottom:10px}.ck-campo:last-child{margin-bottom:0}',
    '.ck-campo input{width:100%;height:54px;border:1px solid rgba(235,225,211,.16);border-radius:12px;padding:20px 14px 6px;font-size:16px;outline:none;background:var(--bg);color:var(--t);transition:border-color .15s,box-shadow .15s;-webkit-appearance:none}',
    '.ck-campo label{position:absolute;left:15px;top:17px;font-size:15px;color:var(--t2);pointer-events:none;transition:all .15s}',
    '.ck-campo input:focus{border-color:var(--or);box-shadow:0 0 0 3px rgba(166,160,85,.18)}',
    '.ck-campo input:focus+label,.ck-campo input:not(:placeholder-shown)+label{top:8px;font-size:11px;letter-spacing:.02em}',
    '.ck-campo input::placeholder{color:transparent}',
    '.ck-campo input:-webkit-autofill{-webkit-box-shadow:0 0 0 40px var(--bg) inset;-webkit-text-fill-color:var(--t)}',
    '.ck-lin{display:flex;gap:10px;margin-bottom:10px}.ck-lin .ck-campo{flex:1;min-width:0;margin-bottom:0}',
    '.ck-met{display:flex;align-items:center;gap:12px;width:100%;min-height:60px;background:var(--cd);border:1px solid var(--ln);border-radius:16px;padding:12px 16px;margin-bottom:10px;cursor:pointer;color:var(--t);font-size:16px;font-weight:600;text-align:left;transition:all .15s}',
    '.ck-met .ck-rd{width:22px;height:22px;border-radius:50%;border:2px solid rgba(235,225,211,.4);flex:none;display:flex;align-items:center;justify-content:center}',
    '.ck-met.on{background:var(--bg);border-color:var(--t);box-shadow:0 2px 16px rgba(22,42,65,.14)}',
    '.ck-met.on .ck-rd{border-color:var(--t);background:var(--t)}',
    '.ck-met.on .ck-rd:after{content:"";width:8px;height:5px;border:2px solid var(--bg);border-top:0;border-right:0;transform:rotate(-45deg) translate(1px,-1px)}',
    '.ck-met small{display:block;font-size:12px;font-weight:400;color:var(--t2);margin-top:2px}',
    '.ck-met .ck-ics{margin-left:auto;display:flex;gap:4px;align-items:center}',
    '.ck-bd{height:22px;min-width:34px;padding:0 5px;border-radius:4px;background:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:800;color:#1A1F71;letter-spacing:.02em}',
    '.ck-tag{font-size:11px;font-weight:700;color:#3AAE92;background:rgba(166,160,85,.16);border-radius:6px;padding:3px 7px;margin-left:6px;vertical-align:middle}',
    '#ck-cartao{margin:-2px 0 10px}',
    '.ck-tot{display:flex;justify-content:space-between;align-items:baseline;margin:16px 2px 12px;font-size:15px;color:var(--t2)}',
    '.ck-tot b{font-size:22px;font-weight:700;color:var(--t)}',
    '.ck-lin2{display:flex;justify-content:space-between;margin:14px 2px -8px;font-size:13px;color:var(--t2)}',
    '#ck-pagar{width:100%;margin:0}',
    '#ck-pagar[disabled]{opacity:.65;cursor:wait}',
    '.ck-erro{color:#FF6B6B;font-size:14px;margin:10px 0 0;min-height:0;text-align:center}',
    '.ck-seg{display:flex;justify-content:center;align-items:center;gap:6px;font-size:12px;color:var(--t2);margin-top:12px}',
    '.ck-seg svg{flex:none}',
    '.ck-pix{text-align:center}.ck-pix p{margin:6px 0;font-size:15px;color:var(--t2)}.ck-pix p b{color:var(--t)}',
    '#ck-qr{display:inline-block;padding:12px;background:#fff;border-radius:16px;margin:10px 0}',
    '#ck-qr img,#ck-qr canvas{width:200px!important;height:200px!important;display:block}',
    '.ck-copia{width:100%;font-size:12px;border:1px dashed rgba(235,225,211,.25);border-radius:10px;padding:10px;word-break:break-all;background:var(--bg);color:var(--t2);max-height:62px;overflow:auto;text-align:left;margin-bottom:10px}',
    '.ck-espera{display:flex;align-items:center;justify-content:center;gap:8px;font-size:14px;color:var(--t2);margin-top:14px}',
    '.ck-spin{width:16px;height:16px;border:2px solid rgba(235,225,211,.2);border-top-color:var(--or);border-radius:50%;animation:ckr 1s linear infinite}',
    '@keyframes ckr{to{transform:rotate(360deg)}}',
    '.ck-ok{text-align:center;padding:8px 0}.ck-ok .ck-ic{width:64px;height:64px;border-radius:50%;background:#3AAE92;margin:0 auto 10px;display:flex;align-items:center;justify-content:center}.ck-ok h3{margin:6px 0;font-size:24px;font-weight:600}.ck-ok p{color:var(--t2);font-size:15px;margin:6px 0 14px}',
    '.ck-passos{font-size:13px;color:var(--t2);text-align:left;margin:14px 0 0;padding-left:18px;line-height:1.6}'
  ].join('');
  document.head.appendChild(css);

  var PIXSVG = '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="#32BCAD" d="M17.6 17.1a2.9 2.9 0 0 1-2.1-.9l-3-3a.6.6 0 0 0-.8 0l-3 3a2.9 2.9 0 0 1-2.1.9H6l3.8 3.8a3 3 0 0 0 4.3 0l3.8-3.8h-.3zM6.6 6.9c.8 0 1.5.3 2.1.9l3 3c.2.2.6.2.8 0l3-3c.6-.6 1.3-.9 2.1-.9h.3L14.1 3.1a3 3 0 0 0-4.3 0L6 6.9h.6zm14.3 3l-2.3-2.3h-1c-.5 0-1 .2-1.4.6l-3 3a1.7 1.7 0 0 1-2.4 0l-3-3c-.4-.4-.9-.6-1.4-.6H5.2L2.9 9.9a3 3 0 0 0 0 4.3l2.3 2.3h1.2c.5 0 1-.2 1.4-.6l3-3c.7-.6 1.8-.6 2.4 0l3 3c.4.4.9.6 1.4.6h1l2.3-2.3a3 3 0 0 0 0-4.3z"/></svg>';
  var CARTSVG = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EBE1D3" stroke-width="1.8" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6 15h4"/></svg>';
  var LOCK = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  function campo(id, rot, attrs) { return '<div class="ck-campo"><input id="ck-' + id + '" placeholder=" " ' + (attrs || '') + '><label for="ck-' + id + '">' + rot + '</label></div>'; }

  // botão de pagar = mesmo botão da página (mesmas classes), não um botão "de fora"
  var orig = document.querySelector('[data-test="checkout__mainButton"]');
  var btnCls = orig ? orig.className : '', spanCls = orig && orig.querySelector('span') ? orig.querySelector('span').className : '';

  // ---------- estrutura ----------
  var bg = document.createElement('div'); bg.id = 'ck';
  bg.innerHTML =
      '<div id="ck-form">' +
        '<p class="ck-h">Finalize sua inscrição</p><p class="ck-hs">Leva menos de 1 minuto. Você paga aqui mesmo.</p>' +
        '<div class="ck-et"><i>1</i>Seus dados</div>' +
        '<div class="ck-card">' +
          campo('nome', 'Nome completo', 'autocomplete="name"') +
          campo('email', 'E-mail (seu acesso chega aqui)', 'type="email" autocomplete="email" inputmode="email"') +
          '<div class="ck-lin">' + campo('tel', 'WhatsApp com DDD', 'autocomplete="tel" inputmode="tel"') + campo('cpf', 'CPF', 'inputmode="numeric"') + '</div>' +
        '</div>' +
        '<div class="ck-et"><i>2</i>Forma de pagamento</div>' +
        '<button type="button" class="ck-met on" data-m="pix"><span class="ck-rd"></span><span>Pix<span class="ck-tag">APROVAÇÃO NA HORA</span><small>Pague com o app do seu banco</small></span><span class="ck-ics">' + PIXSVG + '</span></button>' +
        '<button type="button" class="ck-met" data-m="cartao"><span class="ck-rd"></span><span>Cartão de crédito<small>Visa, Mastercard, Elo e outros</small></span><span class="ck-ics"><span class="ck-bd">VISA</span><span class="ck-bd" style="color:#EB001B">MC</span></span></button>' +
        '<div id="ck-cartao" class="ck-card" style="display:none">' +
          campo('num', 'Número do cartão', 'autocomplete="cc-number" inputmode="numeric"') +
          '<div class="ck-lin">' + campo('val', 'Validade (MM/AA)', 'autocomplete="cc-exp" inputmode="numeric"') + campo('cvv', 'CVV', 'autocomplete="cc-csc" inputmode="numeric"') + '</div>' +
          campo('tit', 'Nome impresso no cartão', 'autocomplete="cc-name"') +
        '</div>' +
        '<div class="ck-lin2"><span id="ck-pnome">Desafio 28 dias</span><span id="ck-pval">R$ 29,90</span></div>' +
        '<div class="ck-lin2"><span>Taxa de serviço</span><span>' + brl(TAXA) + '</span></div>' +
        '<div class="ck-tot"><span>Total</span><b id="ck-ppreco">R$ 30,89</b></div>' +
        '<button type="button" id="ck-pagar" class="' + btnCls + '"><span class="' + spanCls + '">GERAR PIX</span></button>' +
        '<div class="ck-erro" id="ck-erro"></div>' +
        '<div class="ck-seg">' + LOCK + 'Pagamento 100% seguro · Garantia de 30 dias</div>' +
      '</div>' +
      '<div id="ck-pix" class="ck-pix" style="display:none"></div>' +
      '<div id="ck-fim" class="ck-ok" style="display:none"></div>';
  function txtBtn(t) { var s = $('#ck-pagar span') || $('#ck-pagar'); s.textContent = t; }
  function rotulo() { return st.metodo === 'cartao' ? 'PAGAR ' + brl(st.preco + TAXA) + ' E COMEÇAR' : 'GERAR PIX E COMEÇAR'; }

  // o formulário fica logo abaixo dos planos, no lugar do botão (vai para o bloco de planos que a pessoa estiver usando)
  var BOTOES = '[data-test="checkout__mainButton"],[data-test="checkout__bottomButton"]';
  function colocar(btn) {
    if (!btn) return;
    document.querySelectorAll(BOTOES).forEach(function (b) { b.style.display = b === btn ? 'none' : ''; });
    if (btn.nextSibling !== bg) btn.parentNode.insertBefore(bg, btn.nextSibling);
  }
  colocar(orig);
  if (!bg.parentNode) document.body.appendChild(bg);

  // trocar o plano na página atualiza o total
  var DT = { 'PlanItem-Teste-de-1-semana': 'pmotdrk', 'PlanItem-Plano-de-4-Semanas': '38ynh82', 'PlanItem-Plano-de-12-Semanas': 'qjk7tw4' };
  function plano(offerId) {
    var p = PLANOS[offerId] || PLANOS['38ynh82'];
    if (st.plano !== p[0]) st.idem = null;
    st.plano = p[0]; st.nome = p[1]; st.preco = p[2];
    $('#ck-pnome').textContent = p[1]; $('#ck-pval').textContent = brl(p[2]); $('#ck-ppreco').textContent = brl(p[2] + TAXA);
    txtBtn(rotulo());
  }
  document.addEventListener('click', function (e) {
    var pl = e.target.closest('[data-test^="PlanItem-"]'); if (!pl) return;
    var id = DT[pl.getAttribute('data-test')]; if (!id) return;
    plano(id);
    var sec = pl.closest('[data-test="checkoutChoosePlan__base"]');
    if (sec && !st.pedido) { var b = sec.querySelector(BOTOES); if (b) colocar(b); }
  });
  var ini = document.querySelector('[data-test^="PlanItem-"][data-selected="true"]');
  plano(ini ? DT[ini.getAttribute('data-test')] : '38ynh82');

  // máscaras simples
  function mask(el, f) { el.addEventListener('input', function () { el.value = f(el.value.replace(/\D/g, '')); }); }
  mask($('#ck-cpf'), function (d) { d = d.slice(0, 11); return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2'); });
  mask($('#ck-tel'), function (d) { d = d.slice(0, 11); return d.length > 6 ? '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4) : d.length > 2 ? '(' + d.slice(0, 2) + ') ' + d.slice(2) : d; });
  mask($('#ck-num'), function (d) { return d.slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 '); });
  mask($('#ck-val'), function (d) { d = d.slice(0, 4); return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; });
  mask($('#ck-cvv'), function (d) { return d.slice(0, 4); });

  try { var salvo = JSON.parse(localStorage.getItem('ck_dados') || '{}'); ['nome', 'email', 'tel', 'cpf'].forEach(function (k) { if (salvo[k]) $('#ck-' + k).value = salvo[k]; }); } catch (e) {}

  // 'input' só dispara quando alguém escreve (ou o navegador preenche): foco e dados já salvos não contam
  bg.addEventListener('input', function (e) { var t = e.target; if (t && t.id && t.value) marcarCampo(t.id.replace('ck-', '')); });

  bg.querySelectorAll('.ck-met').forEach(function (b) {
    b.addEventListener('click', function () {
      st.metodo = b.getAttribute('data-m');
      marcarMetodo(st.metodo);
      bg.querySelectorAll('.ck-met').forEach(function (x) { x.classList.toggle('on', x === b); });
      $('#ck-cartao').style.display = st.metodo === 'cartao' ? '' : 'none';
      txtBtn(rotulo());
      if (st.metodo === 'cartao') prepararSdk();
    });
  });

  // ---------- medição do checkout (separada da "oferta vista") ----------
  // Cada etapa conta 1 vez por visita. NUNCA envia o que a pessoa digitou, só o nome da etapa.
  var IDS = { '7d': 'pmotdrk', '28d': '38ynh82', '90d': 'qjk7tw4' };
  var ja = {};
  function umaVez(k) { if (ja[k]) return false; ja[k] = 1; try { if (sessionStorage.getItem('ckm_' + k)) return false; sessionStorage.setItem('ckm_' + k, '1'); } catch (e) {} return true; }
  function meta(tipo, nome, dados, extra) { try { if (window.fbq) fbq(tipo, nome, dados, extra || {}); } catch (e) {} }
  function ga4(nome, p) { try { if (window.gtag) gtag('event', nome, p); } catch (e) {} }
  function clar(nome) { try { if (window.clarity) clarity('event', nome); } catch (e) {} }
  // painel: se o al.js ainda não carregou, a etapa fica na fila e ele envia quando chegar
  function painel(id, rotulo) { if (window.alPasso) window.alPasso(id, rotulo); else (window.alFila = window.alFila || []).push([id, rotulo]); }
  function painelInicio() { if (window.alPasso) window.alCheckout(location.href, st.plano); else (window.alFila = window.alFila || []).push(['_inicio', st.plano]); }
  function junta(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  function dadosEv(valor) {
    var oid = IDS[st.plano], v = valor || st.preco, nome = 'Desafio Treino de Aço - ' + st.nome;
    return { meta: { currency: 'BRL', value: v, content_ids: [oid], content_type: 'product', content_name: nome },
      ga: { currency: 'BRL', value: v, items: [{ item_id: oid, item_name: nome, price: st.preco }] } };
  }
  // 0. viu a oferta: só quando os PLANOS aparecem na tela (não quando a página abre)
  (function () {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      if (!es.some(function (e) { return e.isIntersecting; })) return;
      io.disconnect();
      if (!umaVez('oferta')) return;
      var d = dadosEv(); meta('track', 'ViewContent', d.meta); ga4('view_item', d.ga); clar('ck_viu_oferta');
    }, { threshold: 0.25 });
    document.querySelectorAll('[data-test="checkoutChoosePlan__planListContainer"]').forEach(function (el) { io.observe(el); });
  })();

  // 1. começou a preencher = início de checkout
  function marcarInicio() {
    if (!umaVez('inicio')) return;
    var d = dadosEv();
    meta('track', 'InitiateCheckout', d.meta); ga4('begin_checkout', d.ga); clar('ck_inicio');
    painelInicio(); painel('ck_inicio', 'Começou a preencher o checkout');
  }
  // 2. cada campo que começou a digitar
  var CAMPOS = { nome: ['nome', 'nome'], email: ['email', 'e-mail'], tel: ['tel', 'WhatsApp'], cpf: ['cpf', 'CPF'], num: ['dcartao', 'dados do cartão'], val: ['dcartao', 'dados do cartão'], cvv: ['dcartao', 'dados do cartão'], tit: ['dcartao', 'dados do cartão'] };
  function marcarCampo(idCampo) {
    var c = CAMPOS[idCampo]; if (!c) return;
    marcarInicio();
    if (!umaVez('campo_' + c[0])) return;
    ga4('checkout_campo', { campo: c[0] }); clar('ck_' + c[0]); painel('ck_' + c[0], 'Digitou ' + c[1]);
  }
  // 3. tocou numa forma de pagamento (o Pix já vem marcado: quem não toca só aparece no clique de pagar)
  function marcarMetodo(m) {
    if (!umaVez('metodo_' + m)) return;
    meta('trackCustom', 'EscolheuPagamento', junta(dadosEv().meta, { metodo: m })); ga4('checkout_metodo', { payment_type: m }); clar('ck_escolheu_' + m);
    painel('ck_' + m, 'Escolheu ' + (m === 'pix' ? 'Pix' : 'cartão'));
  }
  // 4. clicou no botão de pagar com os dados certos
  function marcarPagar() {
    var m = st.metodo;
    marcarInicio();
    if (!umaVez('pagar_' + m)) return;
    var d = dadosEv();
    meta('track', 'AddPaymentInfo', d.meta); ga4('add_payment_info', junta(d.ga, { payment_type: m })); clar('ck_clicou_pagar_' + m);
    painel('ck_pagar', 'Clicou no botão de pagar'); painel('ck_pagar_' + m, 'Clicou em pagar com ' + (m === 'pix' ? 'Pix' : 'cartão'));
  }
  function marcarErro() { if (!umaVez('erro')) return; ga4('checkout_erro', { payment_type: st.metodo }); clar('ck_erro_formulario'); painel('ck_erro', 'Clicou em pagar com dado errado ou faltando'); }
  function marcarPix() { if (!umaVez('pixgerado')) return; meta('trackCustom', 'PixGerado', dadosEv().meta); ga4('pix_gerado', { currency: 'BRL', value: st.preco }); clar('ck_pix_gerado'); painel('ck_pix_gerado', 'Pix gerado'); }
  // 5. compra: SÓ com pagamento aprovado. eventID = id do pedido (o mesmo que o painel manda pela API de Conversões)
  function marcarCompra(id, valor) {
    try { if (localStorage.getItem('ck_compra_' + id)) return; localStorage.setItem('ck_compra_' + id, '1'); } catch (e) {}
    var d = dadosEv(valor);
    meta('track', 'Purchase', d.meta, { eventID: id }); ga4('purchase', junta(d.ga, { transaction_id: id, payment_type: st.metodo })); clar('ck_comprou'); painel('ck_comprou', 'Pagamento aprovado');
  }

  function erro(t) { $('#ck-erro').textContent = t || ''; }

  // botões do topo/fim da página: rolam até o formulário (não saem da página)
  window.ckAbrir = function (offerId) {
    plano(offerId); erro('');
    bg.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function () { var n = $('#ck-nome'); if (n && !n.value) n.focus({ preventScroll: true }); }, 600);
  };

  function dados() {
    var d = { nome: $('#ck-nome').value.trim(), email: $('#ck-email').value.trim(), tel: $('#ck-tel').value, cpf: $('#ck-cpf').value };
    try { localStorage.setItem('ck_dados', JSON.stringify(d)); } catch (e) {}
    return { plano: st.plano, nome: d.nome, email: d.email, telefone: d.tel, cpf: d.cpf, fingerprint: fp(), utm: utm() };
  }
  function checar(b) {
    if (b.nome.split(/\s+/).length < 2) return 'Digite seu nome completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(b.email)) return 'Confira seu e-mail.';
    if (b.telefone.replace(/\D/g, '').length < 10) return 'Confira seu WhatsApp com DDD.';
    if (b.cpf.replace(/\D/g, '').length !== 11) return 'Confira seu CPF.';
    return '';
  }
  async function post(rota, corpo) {
    var r = await fetch(API + rota, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });
    var j = {}; try { j = await r.json(); } catch (e) {}
    if (!r.ok) throw new Error(j.erro || 'Não foi possível concluir. Tente de novo.');
    return j;
  }

  $('#ck-pagar').addEventListener('click', async function () {
    var btn = this; erro(''); st.silencioso = false;
    var b = dados(); var e = checar(b); if (e) { marcarErro(); return erro(e); }
    marcarPagar();
    if (!st.idem) st.idem = uuid();
    b.idem = st.idem;
    btn.disabled = true; txtBtn('AGUARDE…');
    try {
      if (st.metodo === 'pix') await pagarPix(b); else await pagarCartao(b);
    } catch (x) { erro(x.message); st.idem = null; }
    btn.disabled = false; txtBtn(rotulo());
  });

  // ---------- Pix ----------
  async function pagarPix(b) {
    var j = await post('pix', b);
    st.pedido = j.id;
    guardar(j);
    marcarPix();
    await telaPix(j);
  }
  function guardar(j) { try { localStorage.setItem('ck_pend', JSON.stringify({ id: j.id, qr: j.qr || '', valor: Number(j.valor) || 0, plano: st.plano, metodo: st.metodo, t: Date.now() })); } catch (e) {} }
  function esquecer() { try { localStorage.removeItem('ck_pend'); } catch (e) {} }

  async function telaPix(j) {
    try { if (!window.QRCode) await carregar('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'); } catch (e) {}
    $('#ck-form').style.display = 'none';
    var box = $('#ck-pix'); box.style.display = '';
    box.innerHTML =
      '<p style="font-size:16px"><b>Pague ' + brl(j.valor || (st.preco + TAXA)) + ' com Pix</b></p>' +
      '<p>Abra o app do seu banco e escaneie o código:</p>' +
      '<div id="ck-qr"></div>' +
      '<p>Ou copie o código Pix:</p>' +
      '<div class="ck-copia" id="ck-codigo"></div>' +
      '<button type="button" class="' + btnCls + '" id="ck-copiar" style="width:100%"><span class="' + spanCls + '">COPIAR CÓDIGO PIX</span></button>' +
      '<div class="ck-espera"><span class="ck-spin"></span>Aguardando o pagamento… a tela muda sozinha.</div>' +
      '<ol class="ck-passos"><li>Copie o código acima</li><li>No app do banco, escolha Pix &gt; Copia e Cola</li><li>Cole, confira e pague. O acesso chega no seu e-mail</li></ol>';
    $('#ck-codigo').textContent = j.qr || '';
    if (window.QRCode && j.qr) new QRCode($('#ck-qr'), { text: j.qr, width: 210, height: 210, correctLevel: QRCode.CorrectLevel.M });
    else $('#ck-qr').style.display = 'none';
    $('#ck-copiar').addEventListener('click', function () {
      var t = j.qr || ''; var bt = this.querySelector('span') || this;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).catch(function () {
        var a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove();
      }).finally(function () { bt.textContent = 'CÓDIGO COPIADO ✓'; setTimeout(function () { bt.textContent = 'COPIAR CÓDIGO PIX'; }, 2500); });
    });
    st.valor = Number(j.valor) || 0;
    acompanhar(j.id);
  }

  function acompanhar(id) {
    clearInterval(st.timer); var n = 0;
    st.consultar = async function () {
      try {
        var r = await fetch(API + 'status?id=' + encodeURIComponent(id), { cache: 'no-store' }); if (!r.ok) return;
        var j = await r.json();
        if (st.pedido !== id) return;
        if (j.status === 'paid' || j.status === 'authorized') { clearInterval(st.timer); st.consultar = null; aprovado(); }
        else if (['refused', 'blocked', 'canceled'].indexOf(j.status) >= 0) { clearInterval(st.timer); st.consultar = null; recusado(j.motivo); }
      } catch (e) {}
    };
    st.timer = setInterval(function () { if (++n > 400) return clearInterval(st.timer); if (st.consultar) st.consultar(); }, 5000); // ~33 min
  }
  // voltou do app do banco: confere na hora
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible' && st.consultar) st.consultar(); });

  // ---------- Cartão ----------
  async function prepararSdk() {
    if (st.sdk) return st.sdk;
    st.sdk = (async function () {
      var cfg = await fetch(API + 'config').then(function (r) { return r.json(); });
      if (!cfg.clientId) throw new Error('Cartão indisponível no momento. Use o Pix.');
      if (!window.Cakto) await carregar('https://cakto-sdk.pages.dev/cakto-sdk.min.js');
      var s = new Cakto.CaktoSDK({ client_id: cfg.clientId });
      try { await s.initAntifraud(); } catch (e) {}
      return s;
    })();
    st.sdk.catch(function () { st.sdk = null; });
    return st.sdk;
  }

  function luhn(n) { var s = 0, d = false; for (var i = n.length - 1; i >= 0; i--) { var x = +n[i]; if (d) { x *= 2; if (x > 9) x -= 9; } s += x; d = !d; } return n.length >= 13 && s % 10 === 0; }

  async function pagarCartao(b) {
    var num = $('#ck-num').value.replace(/\D/g, ''), val = $('#ck-val').value.replace(/\D/g, ''), cvv = $('#ck-cvv').value.replace(/\D/g, '');
    if (!luhn(num)) throw new Error('Confira o número do cartão.');
    if (val.length !== 4 || +val.slice(0, 2) < 1 || +val.slice(0, 2) > 12) throw new Error('Confira a validade (MM/AA).');
    if (cvv.length < 3) throw new Error('Confira o CVV.');
    var sdk = await prepararSdk();
    var card = { holderName: $('#ck-tit').value.trim() || b.nome, cardNumber: num, cvv: cvv, expMonth: val.slice(0, 2), expYear: val.slice(2) };
    var tk = await sdk.createToken(card);
    if (!tk || !tk.cardToken) throw new Error('Não foi possível validar o cartão.');
    var tres = null;
    try {
      var a = await sdk.authenticate3DS({ card: card, customer: { amount: Math.round((st.preco + TAXA) * 100), currency: 'BRL', email: b.email, name: b.nome, phone: b.telefone.replace(/\D/g, ''), paymentMethod: 'credit' } });
      if (a && a.success) tres = { cavv: a.cavv, eci: a.eci, xid: a.xid, referenceId: a.referenceId, version: a.version };
      else if (a && a.error && /recus|fail|nega|denied/i.test(a.error)) throw new Error('O banco não autenticou o cartão. Tente outro cartão ou use o Pix.');
    } catch (x) { if (/banco não autenticou/.test(x.message)) throw x; console.warn('3DS indisponível, seguindo sem', x); }
    await sdk.completeAntifraudProfile();
    b.cardToken = tk.cardToken; b.threeDSecure = tres; b.antifraude = sdk.getAntifraudReference();
    var j = await post('cartao', b);
    st.pedido = j.id;
    st.valor = Number(j.valor) || 0;
    if (j.status === 'paid' || j.status === 'authorized') return aprovado();
    if (['refused', 'blocked', 'canceled'].indexOf(j.status) >= 0) { st.pedido = null; st.idem = null; throw new Error('Pagamento recusado pelo banco. Tente outro cartão ou use o Pix.'); }
    $('#ck-form').style.display = 'none';
    var box = $('#ck-pix'); box.style.display = '';
    box.innerHTML = '<div class="ck-espera"><span class="ck-spin"></span>Processando seu pagamento…</div>';
    guardar(j);
    acompanhar(j.id);
  }

  // ---------- resultado ----------
  function aprovado() {
    if (st.compraOk) return; st.compraOk = 1;
    if (st.pedido) marcarCompra(st.pedido, st.valor);
    esquecer();
    try { localStorage.setItem('sda_comprou', String(Date.now())); localStorage.removeItem('ck_dados'); } catch (e) {}
    $('#ck-form').style.display = 'none'; $('#ck-pix').style.display = 'none';
    var f = $('#ck-fim'); f.style.display = '';
    f.innerHTML = '<div class="ck-ic"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#050300" stroke-width="3"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div><h3>Pagamento aprovado!</h3>' +
      '<p>Seu acesso ao <b>' + st.nome + '</b> foi enviado para o seu e-mail.</p>' +
      '<p>Para entrar agora, use o mesmo e-mail da compra:</p>' +
      '<a class="' + btnCls + '" style="display:flex;align-items:center;justify-content:center;text-decoration:none;width:100%" href="' + APP + '"><span class="' + spanCls + '">ACESSAR MEU DESAFIO</span></a>';
  }
  function recusado(m) {
    esquecer();
    if (st.silencioso) { st.pedido = null; return; } // Pix antigo vencido: não assusta quem só voltou à página
    st.pedido = null; st.idem = null;
    $('#ck-pix').style.display = 'none'; $('#ck-form').style.display = '';
    erro('Pagamento não aprovado' + (m ? ' (' + m + ')' : '') + '. Tente de novo ou use outra forma.');
  }

  // ---------- retoma um pagamento pendente se a página recarregou (até 24 h) ----------
  (function retomar() {
    var p; try { p = JSON.parse(localStorage.getItem('ck_pend') || 'null'); } catch (e) {}
    if (!p || !p.id) return;
    if (Date.now() - p.t > 864e5) return esquecer();
    plano(IDS[p.plano]); st.metodo = p.metodo || 'pix'; st.pedido = p.id; st.valor = p.valor;
    if (p.metodo === 'pix' && Date.now() - p.t < 30 * 60 * 1000) { telaPix({ id: p.id, qr: p.qr, valor: p.valor }).then(function () { if (st.consultar) st.consultar(); }); } // o código vale 30 min
    else { st.silencioso = true; acompanhar(p.id); st.consultar(); }
  })();
})();

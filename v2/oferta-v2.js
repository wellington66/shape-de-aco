/* Página de vendas v2: usa as respostas do quiz para atacar a dor e mostrar o ganho de tempo. */
(function () {
  'use strict';
  var A = {}; try { A = JSON.parse(localStorage.getItem('sda') || '{}'); } catch (e) {}
  if (A.org == null && !(A.inc && A.inc.length)) return;
  var h1 = document.querySelector('[data-test="beforeAfterResultsSection__heading"]'); if (!h1) return;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var fmt1 = function (x) { return (Math.round(x * 10) / 10).toString().replace('.', ','); };

  var nome = A.nome ? esc(A.nome) : '';
  var dias = [3, 4, 5, 6][A.dias != null ? A.dias : 1], min = [15, 20, 30][A.min != null ? A.min : 0];
  var haN = Math.round(100 * dias * 4 / 60), hnN = Math.round(min * dias * 4 / 6) / 10, eco = Math.max(1, Math.round(haN - hnN));
  var w = A.w, g = A.g, diff = (w && g) ? Math.abs(Math.round((w - g) * 10) / 10) : 0, perder = !(w && g) || w >= g;

  var org = ['há menos de 1 ano', 'há 1 a 3 anos', 'há mais de 3 anos', 'há tanto tempo que você nem lembra'][A.org != null ? A.org : 1];
  var INC = ['A barriga que não sai', 'Vergonha de tirar a camisa', 'Cansaço o dia inteiro', 'Pouca disposição e desempenho com a parceira', 'Dor nas costas e corpo travado', 'Roupa que não serve mais'];
  var MOT = ['Não tinha tempo', 'Chegava cansado do trabalho', 'Academia cara', 'Não via resultado', 'Não sabia o que fazer', 'Dor ou lesão'];
  var inc = (A.inc || []).slice(0, 4).map(function (i) { return INC[i]; }).filter(Boolean);
  var mot = (A.mot || []).slice(0, 3).map(function (i) { return MOT[i]; }).filter(Boolean);
  var rec = ['uma vez', 'duas ou três vezes', 'mais de cinco vezes', 'tantas vezes que perdeu a conta'][A.rec != null ? A.rec : 1];

  var li = function (t, ico) { return '<li><span>' + ico + '</span>' + esc(t) + '</li>'; };
  var rows = '<li><span>✖</span>Você não sente orgulho do seu corpo <b>' + org + '</b></li>' +
    inc.map(function (t) { return li(t, '✖'); }).join('') +
    (A.rec != null ? '<li><span>✖</span>Já começou e parou <b>' + rec + '</b></li>' : '') +
    mot.map(function (t) { return li('Parou por quê? ' + t, '✖'); }).join('');

  var css = '#v2-dor{margin:18px 16px;padding:18px;border-radius:16px;background:#16181C;border:1.5px solid rgba(255,91,31,.55);color:#E8EBEF;font-family:inherit;direction:ltr;text-align:left}' +
    '#v2-dor h2{font-size:21px;line-height:1.25;margin:0 0 6px;font-weight:800}' +
    '#v2-dor h2 em{color:#FF5B1F;font-style:normal}' +
    '#v2-dor p{color:#A9B0B9;font-size:14.5px;margin:0 0 12px}' +
    '#v2-dor ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}' +
    '#v2-dor li{display:flex;gap:10px;align-items:flex-start;font-size:15px;line-height:1.35;background:rgba(255,77,77,.07);border:1px solid rgba(255,77,77,.3);border-radius:10px;padding:10px 12px}' +
    '#v2-dor li span{color:#FF4D4D;font-weight:800}' +
    '#v2-dor .fix{margin-top:14px;background:rgba(61,214,140,.1);border:1.5px solid #3DD68C;border-radius:12px;padding:14px;font-size:15px;line-height:1.4}' +
    '#v2-dor .fix b{color:#3DD68C}' +
    '#v2-dor .tm{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}' +
    '#v2-dor .tm div{background:#0B0C0E;border:1px solid #2A2D33;border-radius:12px;padding:12px;text-align:center}' +
    '#v2-dor .tm small{display:block;color:#A9B0B9;font-size:11.5px}' +
    '#v2-dor .tm strong{font-size:26px;font-weight:800}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var box = document.createElement('section'); box.id = 'v2-dor';
  box.innerHTML = '<h2>' + (nome ? nome + ', ' : '') + 'foi isso que você nos <em>contou</em></h2><p>Nas suas respostas, este é o retrato de hoje:</p><ul>' + rows + '</ul>' +
    (w && g ? '<div class="fix" style="margin-top:12px;background:rgba(255,91,31,.1);border-color:#FF5B1F"><b style="color:#FF8A4C">Sua meta:</b> ' + (perder ? 'perder' : 'ganhar') + ' <b style="color:#fff">' + fmt1(diff) + ' kg</b>, de ' + fmt1(w) + ' kg para ' + fmt1(g) + ' kg.</div>' : '') +
    '<div class="fix"><b>O Desafio Treino de Aço resolve isso</b> com treinos de <b>' + min + ' minutos</b>, ' + dias + ' dias por semana, em casa. Sem academia, sem mensalidade e sem depender de força de vontade.</div>' +
    '<div class="tm"><div><small>Academia (ir + treinar + voltar)</small><strong style="color:#FF4D4D">' + haN + ' h/mês</strong></div><div><small>Treino de Aço (em casa)</small><strong style="color:#3DD68C">' + fmt1(hnN) + ' h/mês</strong></div></div>' +
    '<p style="margin:12px 0 0;text-align:center;color:#E8EBEF;font-weight:700">Você ganha ' + eco + ' horas de volta em 28 dias.</p>';
  h1.insertAdjacentElement('afterend', box);
})();

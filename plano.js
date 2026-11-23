/* Entrada da página de vendas: antes/depois que cabe no celular + "seu plano personalizado" com as respostas do quiz */
(function () {
  if ((document.body.getAttribute('data-replica-kind') || '') !== 'checkoutPersonalized') return;
  var A = {}; try { A = JSON.parse(localStorage.getItem('sda') || '{}'); } catch (e) {}
  var hero = document.querySelector('.before-after-results-section_heroContainer__BeciP'); if (!hero) return;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var kg = function (n) { return Math.round(n) + ' kg'; };
  var bio = ['Ectomorfo', 'Mesomorfo', 'Endomorfo'][A['singleSelect_21642']];
  var fx = A['singleSelect_21644'], nivel = fx == null ? 'Iniciante' : ['Iniciante', 'Iniciante', 'Intermediário', 'Avançado'][fx];
  var itens = [];
  if (A.w && A.g) itens.push(['Seu objetivo', kg(A.w) + ' → ' + kg(A.g)]);
  else if (A.g) itens.push(['Peso-alvo', kg(A.g)]);
  if (A.h) itens.push(['Altura', Math.round(A.h) + ' cm']);
  itens.push(['Seu nível', nivel]);
  if (bio) itens.push(['Seu biotipo', bio]);
  itens.push(['Duração', '28 dias']);
  itens.push(['Treino por dia', '10 a 25 min']);
  var nome = A.nome ? esc(A.nome) : '';
  var css = '.sda-hero{width:100%;box-sizing:border-box;padding:0 4px;font-family:var(--font),sans-serif;color:#E8EBEF}' +
    '.sda-hero *{box-sizing:border-box}' +
    '.sda-sel{display:flex;align-items:center;gap:8px;justify-content:center;background:rgba(255,91,31,.12);border:1px solid rgba(255,91,31,.45);color:#FFB08F;border-radius:999px;padding:8px 14px;font-size:13px;font-weight:700;letter-spacing:.3px;margin:4px auto 14px;width:max-content;max-width:100%}' +
    '.sda-sel i{width:8px;height:8px;border-radius:50%;background:#3AAE92;box-shadow:0 0 0 4px rgba(58,174,146,.25)}' +
    '.sda-ba{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.sda-ba figure{margin:0;position:relative;border-radius:16px;overflow:hidden;background:#1A1C20;aspect-ratio:4/5}' +
    '.sda-ba img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 12%}' +
    '.sda-ba figcaption{position:absolute;left:8px;right:8px;bottom:8px;text-align:center;font-size:12px;font-weight:800;letter-spacing:.6px;padding:7px 4px;border-radius:10px;background:rgba(11,12,14,.82);color:#E8EBEF}' +
    '.sda-ba figure.dep{box-shadow:0 0 0 2px #FF5B1F}.sda-ba figure.dep figcaption{background:#FF5B1F;color:#0B0C0E}' +
    '.sda-ba .seta{position:absolute;left:50%;top:50%;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;background:#FF5B1F;color:#0B0C0E;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;z-index:2;border:3px solid #0B0C0E}' +
    '.sda-plan{margin-top:12px;background:#16181C;border:1px solid #2a2d33;border-radius:16px;padding:14px}' +
    '.sda-plan h4{margin:0 0 10px;font-size:15px;font-weight:800;text-align:center}' +
    '.sda-plan h4 em{font-style:normal;color:#FF5B1F}' +
    '.sda-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.sda-grid div{background:#0B0C0E;border-radius:12px;padding:10px}' +
    '.sda-grid small{display:block;font-size:11px;color:#A9B0B9;margin-bottom:2px}' +
    '.sda-grid b{display:block;font-size:15px;font-weight:800;line-height:1.2}' +
    '.sda-plan p{margin:10px 0 0;font-size:12.5px;color:#A9B0B9;text-align:center;line-height:1.4}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var box = document.createElement('div'); box.className = 'sda-hero';
  box.innerHTML = '<div class="sda-sel"><i></i>PLANO PERSONALIZADO PRONTO</div>' +
    '<div class="sda-ba"><figure><img src="assets/sda/sda-antes-b901f6.webp" alt="Antes"><figcaption>HOJE</figcaption></figure>' +
    '<div class="seta">›</div>' +
    '<figure class="dep"><img src="assets/sda/sda-depois-1db9e5.webp" alt="Depois"><figcaption>EM 28 DIAS</figcaption></figure></div>' +
    '<div class="sda-plan"><h4>' + (nome ? nome + ', montamos' : 'Montamos') + ' o plano <em>com as suas respostas</em></h4><div class="sda-grid">' +
    itens.map(function (i) { return '<div><small>' + i[0] + '</small><b>' + esc(i[1]) + '</b></div>'; }).join('') +
    '</div><p>Treinos em vídeo, em casa e sem equipamento, no ritmo do seu nível.</p></div>';
  Array.prototype.slice.call(hero.children).forEach(function (c) { c.style.display = 'none'; });
  hero.insertBefore(box, hero.firstChild);
})();

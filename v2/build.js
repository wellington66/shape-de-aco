/* Gera as páginas do funil v2: q01..q35 (a partir do spec.js) e as cópias de p53 (raspadinha) e p54 (vendas) com a personalização. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const here = __dirname, root = path.join(here, '..');
const win = {}; vm.runInNewContext(fs.readFileSync(path.join(here, 'spec.js'), 'utf8'), { window: win });
const V2 = win.V2, pad = n => ('0' + n).slice(-2);
const head = (n, name) => `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Desafio Treino de Aço – 28 dias de calistenia militar para homens</title>
<meta name="theme-color" content="#0B0C0E"><meta name="robots" content="noindex">
<meta name="al-passo" content="${100 + n}|v2 ${name}">
<link rel="icon" href="../marca/icone.svg"><link rel="apple-touch-icon" href="../marca/icone-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="v2.css"></head>
<body data-replica-kind="v2"><div id="app"></div>
<script src="spec.js"></script><script>window.V2_N=${n}</script><script src="engine.js"></script>
<script src="../personal.js"></script><script async src="https://almocos-painel.vercel.app/al.js"></script></body></html>
`;
V2.forEach((s, i) => { const n = i + 1; const h = head(n, s.name); fs.writeFileSync(path.join(here, `q${pad(n)}.html`), h); if (n === 1) fs.writeFileSync(path.join(here, 'index.html'), h); });

// cópias da raspadinha (p53) e da página de vendas (p54): caminhos apontam para a raiz
function copia(nome, extra) {
  let s = fs.readFileSync(path.join(root, nome), 'utf8');
  s = s.replace(/(src|href)="(assets|css|marca|legal)\//g, '$1="../$2/')
       .replace(/src="(replica|personal|carrossel)\.js"/g, 'src="../$1.js"')
       .replace(/al-passo" content="(\d+)\|/, (m, d) => `al-passo" content="${100 + +d - 17}|v2 `);
  if (extra) s = s.replace('</body>', extra + '</body>');
  fs.writeFileSync(path.join(here, nome), s);
}
copia('p53.html'); copia('p54.html', '<script src="oferta-v2.js"></script>');
console.log('ok', V2.length, 'telas + p53 + p54');

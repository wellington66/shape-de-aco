// Acesso à API da Cakto pelo servidor. As chaves ficam SÓ nas variáveis da Vercel:
// CAKTO_CLIENT_ID e CAKTO_CLIENT_SECRET (nunca no navegador nem no git).
const BASE = 'https://api.cakto.com.br';

// Só estas ofertas podem ser cobradas por esta página (o navegador escolhe a chave, nunca o ID livre).
const PLANOS = {
  '7d':  { offerId: 'pmotdrk', nome: 'Desafio 7 dias',  preco: 19.90 },
  '28d': { offerId: '38ynh82', nome: 'Desafio 28 dias', preco: 29.90 },
  '90d': { offerId: 'qjk7tw4', nome: 'Desafio 90 dias', preco: 49.90 },
};

let cache = { token: null, ate: 0 };

async function token() {
  if (cache.token && Date.now() < cache.ate) return cache.token;
  const id = process.env.CAKTO_CLIENT_ID, secret = process.env.CAKTO_CLIENT_SECRET;
  if (!id || !secret) throw new Error('Chaves da Cakto não configuradas no servidor.');
  const r = await fetch(BASE + '/public_api/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: id, client_secret: secret }),
  });
  if (!r.ok) throw new Error('Falha ao autenticar na Cakto (' + r.status + ').');
  const j = await r.json();
  cache = { token: j.access_token, ate: Date.now() + Math.max(60, (j.expires_in || 3600) - 300) * 1000 };
  return cache.token;
}

async function cakto(method, path, body, idem) {
  const h = { Authorization: 'Bearer ' + (await token()), 'Content-Type': 'application/json' };
  if (idem) h['X-Idempotency-Key'] = idem;
  const r = await fetch(BASE + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  let j = null; try { j = await r.json(); } catch (e) {}
  return { ok: r.ok, status: r.status, data: j };
}

const so = (s) => String(s || '').replace(/\D/g, '');

function cpfValido(c) {
  c = so(c); if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  for (let t = 9; t < 11; t++) {
    let s = 0; for (let i = 0; i < t; i++) s += +c[i] * (t + 1 - i);
    if (((s * 10) % 11) % 10 !== +c[t]) return false;
  }
  return true;
}

// Valida e monta o cliente a partir do que veio do formulário.
function cliente(b, req) {
  const nome = String(b.nome || '').trim().slice(0, 120);
  const email = String(b.email || '').trim().toLowerCase().slice(0, 200);
  let tel = so(b.telefone); if (tel.length === 10 || tel.length === 11) tel = '55' + tel;
  const cpf = so(b.cpf);
  if (nome.split(/\s+/).length < 2) return { erro: 'Digite seu nome completo.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { erro: 'Confira seu e-mail.' };
  if (tel.length < 12 || tel.length > 13) return { erro: 'Confira seu WhatsApp com DDD.' };
  if (!cpfValido(cpf)) return { erro: 'Confira seu CPF.' };
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || undefined;
  const fp = String(b.fingerprint || '').slice(0, 120) || ('fp_' + email);
  return { customer: { name: nome, email, phone: tel, docType: 'cpf', docNumber: cpf, fingerprint: fp, ip } };
}

function metadata(b) {
  const m = {}; const u = b.utm || {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'sck'].forEach(k => { if (u[k]) m[k] = String(u[k]).slice(0, 255); });
  return m;
}

// Erro da Cakto vira frase curta para o cliente (detalhe completo só no log da Vercel).
function erroCakto(r) {
  console.error('cakto', r.status, JSON.stringify(r.data));
  const d = r.data || {};
  if (typeof d.detail === 'string') return d.detail;
  const k = Object.keys(d)[0];
  if (k) { const v = d[k]; return Array.isArray(v) ? String(v[0]) : (typeof v === 'string' ? v : 'Não foi possível concluir o pagamento.'); }
  return 'Não foi possível concluir o pagamento (' + r.status + ').';
}

function lerBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (e) { return {}; }
}

module.exports = { PLANOS, cakto, cliente, metadata, erroCakto, lerBody };

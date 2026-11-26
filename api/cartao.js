const { PLANOS, cakto, cliente, metadata, erroCakto, lerBody } = require('./_cakto');

// Recebe só o TOKEN do cartão (gerado no navegador pelo SDK da Cakto). Número e CVV nunca passam por aqui.
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });
  try {
    const b = lerBody(req);
    const plano = PLANOS[b.plano];
    if (!plano) return res.status(400).json({ erro: 'Plano inválido.' });
    const c = cliente(b, req);
    if (c.erro) return res.status(400).json({ erro: c.erro });
    const idem = String(b.idem || '').slice(0, 255);
    if (idem.length < 16) return res.status(400).json({ erro: 'Requisição inválida.' });
    if (!b.cardToken || !b.antifraude) return res.status(400).json({ erro: 'Dados do cartão incompletos.' });

    const corpo = {
      paymentMethod: b.threeDSecure ? 'threeDs' : 'credit_card',
      customer: c.customer,
      items: [{ offerId: plano.offerId, quantity: 1 }],
      card: { token: String(b.cardToken) },
      installments: 1,
      antifraud_profiling_attempt_reference: String(b.antifraude),
      metadata: metadata(b),
    };
    if (b.threeDSecure) {
      const t = b.threeDSecure;
      corpo.threeDSecure = { cavv: t.cavv, eci: t.eci, xid: t.xid, referenceId: t.referenceId, version: t.version };
    }
    const r = await cakto('POST', '/public_api/payments/', corpo, idem);
    if (!r.ok) return res.status(400).json({ erro: erroCakto(r) });
    const d = r.data;
    return res.json({ id: d.id, status: d.status, valor: d.amount });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: 'Erro no servidor. Tente de novo.' });
  }
};

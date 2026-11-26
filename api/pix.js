const { PLANOS, cakto, cliente, metadata, erroCakto, lerBody } = require('./_cakto');

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

    const r = await cakto('POST', '/public_api/payments/', {
      paymentMethod: 'pix',
      customer: c.customer,
      items: [{ offerId: plano.offerId, quantity: 1 }],
      metadata: metadata(b),
      pixExpiresIn: 1800,
    }, idem);
    if (!r.ok) return res.status(400).json({ erro: erroCakto(r) });
    const d = r.data;
    return res.json({ id: d.id, status: d.status, valor: d.amount, qr: d.pix && d.pix.qrCode, expira: d.pix && d.pix.expirationDate });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: 'Erro no servidor. Tente de novo.' });
  }
};

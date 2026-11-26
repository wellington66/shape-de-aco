const { cakto } = require('./_cakto');

// Devolve só o status do pedido (nada de dados do cliente).
module.exports = async (req, res) => {
  const id = String((req.query && req.query.id) || '');
  if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ erro: 'id inválido' });
  try {
    const r = await cakto('GET', '/public_api/orders/' + id + '/');
    if (!r.ok) return res.status(r.status === 404 ? 404 : 502).json({ erro: 'não encontrado' });
    res.setHeader('Cache-Control', 'no-store');
    return res.json({ status: r.data.status, motivo: r.data.reason || null });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: 'erro' });
  }
};

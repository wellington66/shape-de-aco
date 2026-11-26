// O SDK da Cakto no navegador precisa só do client_id (público). O secret nunca sai do servidor.
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.json({ clientId: process.env.CAKTO_CLIENT_ID || null });
};

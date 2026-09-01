const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
const reply = (statusCode, body) => ({ statusCode, headers, body: JSON.stringify(body) });

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return reply(405, { error: 'Método não permitido.' });
  const id = event.queryStringParameters && event.queryStringParameters.id;
  if (!id || !/^[A-Za-z0-9_-]{4,120}$/.test(id)) return reply(400, { error: 'Cobrança inválida.' });
  if (!process.env.GOATPAY_API_KEY) return reply(503, { error: 'Pagamento ainda não configurado.' });
  try {
    const response = await fetch(`https://api.goatpay.com.br/v1/payment-pix/status/${encodeURIComponent(id)}`, { headers: { 'X-API-Key': process.env.GOATPAY_API_KEY } });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success || !result.data) return reply(502, { error: result.message || 'Não foi possível consultar o pagamento.' });
    return reply(200, { status: result.data.status, id: result.data.id || id });
  } catch (error) {
    console.error('Payment status error', error);
    return reply(500, { error: 'Erro ao consultar pagamento.' });
  }
};

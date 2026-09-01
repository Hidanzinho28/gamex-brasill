const CATALOG = require('./catalog');

const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
const reply = (statusCode, body) => ({ statusCode, headers, body: JSON.stringify(body) });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return reply(405, { error: 'Método não permitido.' });
  if (!process.env.GOATPAY_API_KEY) return reply(503, { error: 'Pagamento ainda não configurado.' });

  try {
    const { items, coupon, customer } = JSON.parse(event.body || '{}');
    if (!Array.isArray(items) || !items.length) return reply(400, { error: 'Carrinho vazio.' });
    if (!customer || !/^\S+@\S+\.\S+$/.test(customer.email || '') || String(customer.phone || '').replace(/\D/g, '').length < 10) {
      return reply(400, { error: 'Informe e-mail e telefone válidos.' });
    }

    let subtotal = 0;
    const descriptionItems = [];
    for (const item of items) {
      const product = CATALOG[item && item.id];
      const quantity = Number(item && item.qty);
      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) return reply(400, { error: 'Produto ou quantidade inválida.' });
      subtotal += product.price * quantity;
      descriptionItems.push(`${quantity}x ${product.name}`);
    }
    const validCoupons = new Set(['GAMEX', 'F0RCE', 'NASA']);
    const discount = validCoupons.has(String(coupon || '').toUpperCase()) ? subtotal * 0.10 : 0;
    const amount = Number((subtotal - discount).toFixed(2));
    const orderId = `GX-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const goatResponse = await fetch('https://api.goatpay.com.br/v1/payment-pix/create', {
      method: 'POST',
      headers: { 'X-API-Key': process.env.GOATPAY_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, description: `GameX ${orderId}: ${descriptionItems.join(', ')}`.slice(0, 180), externalReference: orderId, coverFee: false, expirationSeconds: 1800 })
    });
    const result = await goatResponse.json().catch(() => ({}));
    if (!goatResponse.ok || !result.success || !result.data) {
      console.error('GoatPay create PIX failed', goatResponse.status, result.requestId);
      return reply(502, { error: result.message || 'Não foi possível gerar o PIX. Tente novamente.' });
    }
    return reply(200, { orderId, total: amount, payment: result.data });
  } catch (error) {
    console.error('Create PIX error', error);
    return reply(500, { error: 'Erro ao iniciar o pagamento.' });
  }
};

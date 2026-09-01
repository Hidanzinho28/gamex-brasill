const crypto = require('node:crypto');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  const secret = process.env.GOATPAY_WEBHOOK_SECRET;
  const signature = event.headers['x-goatpay-signature'] || event.headers['X-GoatPay-Signature'];
  const rawBody = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64') : Buffer.from(event.body || '', 'utf8');
  if (!secret || !signature || !signature.startsWith('sha256=')) return { statusCode: 401, body: 'Invalid signature' };

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const received = signature.slice(7);
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(received, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { statusCode: 401, body: 'Invalid signature' };

  const payload = JSON.parse(rawBody.toString('utf8'));
  if (payload.event === 'payment.paid') console.log('GameX payment confirmed:', payload.data && payload.data.externalReference);
  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};

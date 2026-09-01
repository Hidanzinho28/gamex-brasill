(() => {
  document.head.insertAdjacentHTML('beforeend', '<style>.live-qr{width:130px;height:130px;object-fit:contain;background:#fff;padding:7px;border-radius:8px}.payment-wait{color:#ffb27b!important;font-weight:700}.payment-message.success{color:#7ee5a6!important;font-size:16px}.payment-message.error{color:#ff9b94!important;font-size:16px}</style>');
  const button = document.getElementById('checkout');
  const pix = document.getElementById('pix');
  if (!button || !pix) return;
  let pollTimer;
  const money = value => `R$ ${Number(value).toFixed(2).replace('.', ',')}`;

  function message(text, kind = '') {
    pix.innerHTML = `<div class="pix-head"><span class="pix-badge">PIX</span><h2>${kind === 'success' ? 'Pagamento confirmado' : 'Pagamento via PIX'}</h2></div><p class="payment-message ${kind}">${text}</p>`;
    pix.classList.add('show');
    pix.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function checkPayment(id, orderId) {
    try {
      const response = await fetch(`/.netlify/functions/payment-status?id=${encodeURIComponent(id)}`, { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) return;
      if (result.status === 'COMPLETED') {
        clearInterval(pollTimer);
        localStorage.removeItem('gamex-active-payment');
        message(`Recebemos seu pagamento. Pedido <strong>${orderId}</strong> confirmado com sucesso. Em breve nossa equipe fará a entrega.`, 'success');
      } else if (result.status === 'FAILED' || result.status === 'CANCELED' || result.status === 'REVERSED') {
        clearInterval(pollTimer);
        message('Este PIX não está mais disponível. Gere uma nova cobrança para tentar novamente.', 'error');
      }
    } catch (_) { /* A próxima consulta tentará novamente. */ }
  }

  function beginPolling(id, orderId) {
    clearInterval(pollTimer);
    checkPayment(id, orderId);
    pollTimer = setInterval(() => checkPayment(id, orderId), 5000);
  }

  function displayPayment(data) {
    const payment = data.payment;
    pix.innerHTML = `<div class="pix-head"><span class="pix-badge">PIX</span><h2>Escaneie para pagar</h2></div><p>Pedido <strong>${data.orderId}</strong> · Total: <strong>${money(data.total)}</strong></p><div class="pix-grid"><img class="live-qr" src="${payment.qrCodeBase64}" alt="QR Code PIX para pagamento"><div><p>Abra o aplicativo do seu banco, escaneie o QR Code ou copie o código abaixo.</p><div class="copycode"><code id="pix-code">${payment.copyPaste}</code><button id="copy-pix" class="copy" type="button">Copiar</button></div><p class="payment-wait">Aguardando confirmação do pagamento…</p></div></div><p class="notice">● A confirmação é automática. Não feche esta página até finalizar.</p>`;
    pix.classList.add('show');
    pix.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('copy-pix').onclick = async () => {
      try { await navigator.clipboard.writeText(payment.copyPaste); document.getElementById('copy-pix').textContent = 'Copiado!'; }
      catch (_) { document.getElementById('copy-pix').textContent = 'Selecione o código'; }
    };
    beginPolling(payment.id, data.orderId);
  }

  button.onclick = async () => {
    if (!cart.length) return;
    const email = document.getElementById('customer-email').value.trim();
    const phone = document.getElementById('customer-phone').value.replace(/\D/g, '');
    const error = document.getElementById('customer-error');
    if (!/^\S+@\S+\.\S+$/.test(email) || phone.length < 10) { error.classList.add('show'); return; }
    error.classList.remove('show');
    button.disabled = true;
    button.textContent = 'Gerando PIX…';
    try {
      const response = await fetch('/.netlify/functions/create-pix', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: cart, coupon, customer: { email, phone } }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível gerar o PIX.');
      localStorage.setItem('gamex-active-payment', JSON.stringify(data));
      displayPayment(data);
    } catch (error) {
      message(error.message || 'Não foi possível gerar o PIX.', 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'Finalizar compra via PIX';
    }
  };

  const savedPayment = JSON.parse(localStorage.getItem('gamex-active-payment') || 'null');
  if (savedPayment && savedPayment.payment && savedPayment.payment.id) displayPayment(savedPayment);
})();

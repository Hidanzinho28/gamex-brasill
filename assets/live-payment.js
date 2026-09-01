(() => {
  const checkout = document.getElementById('checkout');
  const oldPix = document.getElementById('pix');
  if (!checkout) return;
  document.head.insertAdjacentHTML('beforeend', `<style>
    @media(max-width:520px){
      body{overflow-x:hidden}.wrap{padding-left:14px!important;padding-right:14px!important}header .ticker{padding:5px 8px;font-size:10px;white-space:nowrap;overflow:hidden}.nav{height:54px!important}.brand{font-size:20px!important}.back{font-size:0}.back::before{content:'← Voltar';font-size:12px}.cart-chip{padding:7px 9px!important;font-size:11px!important}main{padding:19px 0 42px!important}.eyebrow{font-size:10px!important}.title{margin:5px 0 17px!important;font-size:29px!important}.layout{gap:13px!important}.item{padding:13px!important;gap:10px!important}.game-icon{width:44px!important;height:44px!important;font-size:20px!important}.item h2{font-size:14px!important}.item p{font-size:11px!important}.item-price{font-size:14px!important}.item-actions{margin-top:-2px}.summary{padding:16px!important;border-radius:14px!important}.summary h2{font-size:18px!important;margin-bottom:13px!important}.security{padding:9px!important;margin-bottom:13px!important;font-size:11px!important}.coupon{margin:6px 0!important}.coupon input{padding:10px!important}.coupon button{padding:10px!important}.coupon-msg{min-height:15px!important;margin-bottom:8px!important}.line{padding:7px 0!important;font-size:13px!important}.total{padding-top:11px!important;margin-top:4px!important;font-size:18px!important}.customer-details{margin-top:13px!important;padding-top:12px!important}.customer-details label{margin-top:7px!important}.customer-details input{padding:10px!important}.checkout{position:sticky;bottom:9px;margin-top:13px!important;padding:13px!important;z-index:2;box-shadow:0 9px 20px rgba(245,116,26,.24)!important}.pix-modal{padding:6px!important;align-items:flex-end!important}.pix-dialog{width:100%!important;max-height:92dvh!important;border-radius:17px 17px 12px 12px!important}.pix-inner{padding:17px 15px 18px!important}.pix-dialog h2{font-size:22px!important}.pix-sub{font-size:12px!important}.pix-price{margin:15px 0 8px!important}.pix-price strong{font-size:31px!important}.pix-status{margin:14px 0!important;padding:10px!important;font-size:11px!important}.pix-qr-frame{width:156px!important;height:156px!important;margin-bottom:14px!important;padding:8px!important}.pix-qr{width:140px!important;height:140px!important}.pix-copy-row{gap:6px!important}.pix-code{padding:10px 8px!important;font-size:10px!important}.pix-copy{padding:0 12px!important}.pix-steps{margin-top:14px!important;padding:13px!important}.pix-steps ol{gap:6px!important;font-size:12px!important}.pix-foot{margin-top:12px!important;font-size:10.5px!important}
    }
  </style>`);
  if (oldPix) oldPix.hidden = true;

  document.head.insertAdjacentHTML('beforeend', `<style>
  .pix-modal{position:fixed;inset:0;z-index:100;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(3,2,1,.8);backdrop-filter:blur(7px)}
  .pix-modal.open{display:flex;animation:pix-in .22s ease}.pix-dialog{position:relative;width:min(100%,510px);max-height:92vh;overflow:auto;background:linear-gradient(145deg,#211712,#100d0b 72%);border:1px solid rgba(245,116,26,.5);border-radius:20px;box-shadow:0 25px 80px rgba(0,0,0,.7);color:#fff}
  .pix-dialog::-webkit-scrollbar{width:7px}.pix-dialog::-webkit-scrollbar-thumb{background:rgba(245,116,26,.5);border-radius:9px}.pix-inner{padding:29px}.pix-top{display:flex;justify-content:space-between;gap:16px}.pix-kicker{display:flex;align-items:center;gap:9px;margin:0 0 6px;color:#ffad73;font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.pix-kicker:before,.pix-status i{content:"";display:block;width:9px;height:9px;flex:0 0 9px;border-radius:50%;background:var(--orange);box-shadow:0 0 0 5px rgba(245,116,26,.13);animation:pix-pulse 1.7s infinite}.pix-dialog h2{margin:0;font:800 27px Sora,sans-serif;letter-spacing:-.045em}.pix-sub{margin:7px 0 0;color:var(--muted);font-size:14px}.pix-close{display:grid;place-items:center;width:37px;height:37px;padding:0;border:1px solid var(--line);border-radius:11px;background:#261a14;color:#f6ded0;font-size:24px;line-height:1}.pix-close:hover{background:#422318;border-color:var(--orange)}.pix-close:focus-visible,.pix-copy:focus-visible,.pix-done:focus-visible{outline:3px solid rgba(255,143,61,.7);outline-offset:3px}
  .pix-price{text-align:center;margin:25px 0 12px}.pix-price span{display:block;color:#b9aaa0;font-size:11px;font-weight:900;letter-spacing:.11em;text-transform:uppercase}.pix-price strong{display:block;margin-top:5px;color:var(--light);font:800 clamp(32px,7vw,43px) Sora,sans-serif;letter-spacing:-.06em}.pix-order{margin:0;color:#887a70;text-align:center;font-size:12px}.pix-status{display:flex;gap:12px;align-items:flex-start;margin:23px 0;padding:14px;border:1px solid rgba(245,116,26,.28);border-radius:12px;background:rgba(245,116,26,.09);color:#ffe0ca;font-size:12px;font-weight:700;line-height:1.5}.pix-status i{position:relative;top:4px}
  .pix-qr-frame{display:grid;place-items:center;width:190px;height:190px;margin:0 auto 21px;padding:10px;border:1px solid rgba(255,143,61,.75);border-radius:16px;background:white;box-shadow:0 0 0 6px rgba(245,116,26,.08),0 16px 32px rgba(0,0,0,.25)}.pix-qr{display:block;width:166px;height:166px;object-fit:contain}.pix-copy-label{margin:0 0 9px;color:#d4c4b9;text-align:center;font-size:13px}.pix-copy-row{display:flex;gap:8px}.pix-code{min-width:0;flex:1;overflow:auto;padding:12px 10px;border:1px solid var(--line);border-radius:11px;background:#090706;color:#f7d8c1;font:11px/1.25 ui-monospace,Consolas,monospace;white-space:nowrap;scrollbar-width:thin}.pix-copy{border:0;border-radius:11px;background:var(--orange);color:#1d0d05;font-weight:900;padding:0 15px}.pix-copy:hover,.pix-done:hover{background:var(--light);transform:translateY(-1px)}
  .pix-steps{margin-top:22px;padding:17px;border:1px solid var(--line);border-radius:14px;background:rgba(255,255,255,.025)}.pix-steps h3{margin:0 0 12px;font:800 14px Sora,sans-serif}.pix-steps ol{display:grid;gap:9px;margin:0;padding:0;list-style:none;counter-reset:step;color:#cabbb1;font-size:13px;line-height:1.4}.pix-steps li{display:flex;gap:10px}.pix-steps li:before{counter-increment:step;content:counter(step);display:grid;place-items:center;width:20px;height:20px;flex:0 0 20px;border-radius:50%;background:#392116;color:#ffb17b;font-size:11px;font-weight:900}.pix-foot{margin:16px 0 0;color:#ffb27b;text-align:center;font-size:12px}.pix-success,.pix-error{padding:40px 30px 31px;text-align:center}.pix-success-icon{display:grid;place-items:center;width:68px;height:68px;margin:0 auto 20px;border:1px solid rgba(245,116,26,.65);border-radius:50%;background:rgba(245,116,26,.12);color:var(--light);font-size:35px;box-shadow:0 0 0 9px rgba(245,116,26,.06)}.pix-success p,.pix-error p{max-width:360px;margin:12px auto 0;color:#d0c0b6;font-size:14px;line-height:1.6}.pix-error p{color:#ffaaa3}.pix-done{width:100%;margin-top:25px;border:0;border-radius:11px;background:var(--orange);color:#1d0d05;font:800 14px Sora,sans-serif;padding:14px;transition:.16s}
  @keyframes pix-in{from{opacity:0}to{opacity:1}}@keyframes pix-pulse{50%{opacity:.45;transform:scale(.78)}}@media(max-width:540px){.pix-modal{padding:10px}.pix-dialog{max-height:94vh;border-radius:16px}.pix-inner{padding:23px 18px}.pix-dialog h2{font-size:24px}.pix-qr-frame{width:178px;height:178px}.pix-qr{width:154px;height:154px}.pix-success,.pix-error{padding:35px 22px 28px}}
  </style>`);

  let pollTimer, previousFocus;
  const modal = document.createElement('section');
  modal.className = 'pix-modal';
  modal.setAttribute('aria-hidden', 'true');
  document.body.appendChild(modal);
  const money = value => `R$ ${Number(value || 0).toFixed(2).replace('.', ',')}`;
  const clean = value => String(value || '').replace(/[<>&"']/g, '');

  function close(force = false) {
    if (modal.dataset.locked === 'true' && !force) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (previousFocus && previousFocus.focus) previousFocus.focus();
  }
  function open(markup, locked = false) {
    previousFocus = document.activeElement;
    modal.dataset.locked = String(locked);
    modal.innerHTML = `<div class="pix-dialog" role="dialog" aria-modal="true" aria-labelledby="pix-title">${markup}</div>`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    const focus = modal.querySelector('[data-focus]') || modal.querySelector('button');
    if (focus) focus.focus();
  }
  function paymentView(data) {
    return `<div class="pix-inner"><header class="pix-top"><div><p class="pix-kicker">Pagamento seguro</p><h2 id="pix-title">Pague com PIX</h2><p class="pix-sub">Finalize seu pedido agora</p></div><button class="pix-close" type="button" aria-label="Fechar pagamento" data-close data-focus>×</button></header><div class="pix-price"><span>Valor a pagar</span><strong>${money(data.total)}</strong></div><p class="pix-order">Pedido ${clean(data.orderId)}</p><div class="pix-status"><i></i><span>Aguardando confirmação do pagamento…<br>Assim que o PIX for aprovado, avisaremos nesta tela.</span></div><div class="pix-qr-frame"><img class="pix-qr" id="pix-live-qr" alt="QR Code PIX para pagamento"></div><p class="pix-copy-label">Ou copie o código PIX abaixo</p><div class="pix-copy-row"><code class="pix-code" id="pix-live-code" tabindex="0"></code><button class="pix-copy" id="copy-pix" type="button">Copiar</button></div><section class="pix-steps" aria-label="Como pagar"><h3>Como pagar</h3><ol><li>Abra o aplicativo do seu banco.</li><li>Escaneie o QR Code ou cole o código PIX.</li><li>Confirme o pagamento no aplicativo.</li><li>Nossa equipe fará a entrega após a confirmação.</li></ol></section><p class="pix-foot">🔒 Pagamento processado com segurança via PIX.</p></div>`;
  }
  function displayPayment(data) {
    open(paymentView(data));
    const payment = data.payment || {};
    document.getElementById('pix-live-qr').src = payment.qrCodeBase64 || '';
    document.getElementById('pix-live-code').textContent = payment.copyPaste || '';
    modal.querySelector('[data-close]').onclick = () => close();
    document.getElementById('copy-pix').onclick = async () => {
      const copy = document.getElementById('copy-pix'), value = payment.copyPaste || '';
      try { await navigator.clipboard.writeText(value); }
      catch (_) { const input = document.createElement('textarea'); input.value = value; document.body.appendChild(input); input.select(); document.execCommand('copy'); input.remove(); }
      copy.textContent = 'Copiado!';
      setTimeout(() => { if (copy) copy.textContent = 'Copiar'; }, 1800);
    };
    beginPolling(payment.id, data.orderId);
  }
  function success(orderId) {
    clearInterval(pollTimer);
    localStorage.removeItem('gamex-active-payment');
    open(`<div class="pix-success"><div class="pix-success-icon">✓</div><p class="pix-kicker" style="justify-content:center">Pagamento aprovado</p><h2 id="pix-title">PIX confirmado!</h2><p>Recebemos seu pagamento do pedido <strong>${clean(orderId)}</strong>. Nossa equipe vai preparar sua entrega e entrar em contato pelos dados informados.</p><button class="pix-done" type="button" data-done data-focus>Entendi</button></div>`, true);
    modal.querySelector('[data-done]').onclick = () => close(true);
  }
  function failure(text) {
    clearInterval(pollTimer);
    open(`<div class="pix-error"><div class="pix-success-icon" style="color:#ff9b94;border-color:rgba(255,119,113,.55);background:rgba(255,119,113,.1)">!</div><h2 id="pix-title">Não foi possível gerar o PIX</h2><p>${clean(text || 'Tente novamente em instantes.')}</p><button class="pix-done" type="button" data-error data-focus>Tentar novamente</button></div>`);
    modal.querySelector('[data-error]').onclick = () => close(true);
  }
  async function checkPayment(id, orderId) {
    try {
      const response = await fetch(`/.netlify/functions/payment-status?id=${encodeURIComponent(id)}`, { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) return;
      if (result.status === 'COMPLETED') success(orderId);
      else if (['FAILED', 'CANCELED', 'REVERSED'].includes(result.status)) failure('Este PIX não está mais disponível. Gere uma nova cobrança para tentar novamente.');
    } catch (_) { /* A próxima consulta tentará novamente. */ }
  }
  function beginPolling(id, orderId) {
    clearInterval(pollTimer);
    if (!id) return;
    checkPayment(id, orderId);
    pollTimer = setInterval(() => checkPayment(id, orderId), 5000);
  }
  modal.addEventListener('mousedown', event => { if (event.target === modal && modal.dataset.locked !== 'true') close(); });
  document.addEventListener('keydown', event => {
    if (!modal.classList.contains('open')) return;
    if (event.key === 'Escape' && modal.dataset.locked !== 'true') { event.preventDefault(); close(); }
    if (event.key === 'Tab') {
      const all = [...modal.querySelectorAll('button,[href],[tabindex]:not([tabindex="-1"])')].filter(item => !item.disabled);
      if (!all.length) return;
      const first = all[0], last = all[all.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  checkout.onclick = async () => {
    if (!cart.length) return;
    const email = document.getElementById('customer-email').value.trim();
    const phone = document.getElementById('customer-phone').value.replace(/\D/g, '');
    const error = document.getElementById('customer-error');
    if (!/^\S+@\S+\.\S+$/.test(email) || phone.length < 10) { error.classList.add('show'); return; }
    error.classList.remove('show');
    checkout.disabled = true;
    checkout.textContent = 'Gerando PIX…';
    try {
      const response = await fetch('/.netlify/functions/create-pix', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: cart, coupon, customer: { email, phone } }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível gerar o PIX.');
      localStorage.setItem('gamex-active-payment', JSON.stringify(data));
      displayPayment(data);
    } catch (error) {
      failure(error.message || 'Não foi possível gerar o PIX.');
    } finally {
      checkout.disabled = false;
      checkout.textContent = 'Finalizar compra via PIX';
    }
  };
  const saved = JSON.parse(localStorage.getItem('gamex-active-payment') || 'null');
  if (saved && saved.payment && saved.payment.id) displayPayment(saved);
})();

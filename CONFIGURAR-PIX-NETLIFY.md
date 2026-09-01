# Ativar PIX real — GameX Brasil

## 1. Publicar com Netlify Functions

O botão PIX agora usa funções do Netlify. Por isso, publique esta pasta em um repositório GitHub e conecte-o ao Netlify:

1. Crie um repositório no GitHub.
2. Envie **todo o conteúdo desta pasta** para ele, incluindo `netlify.toml`, `netlify/` e `assets/`.
3. No painel Netlify, escolha **Add new project** → **Import an existing project** → GitHub.
4. Selecione o repositório. Não use comando de build e deixe o diretório de publicação vazio (raiz do projeto).
5. Publique.

## 2. Cadastrar a chave segura

No Netlify: **Project configuration** → **Environment variables**, crie:

| Variável | Valor |
| --- | --- |
| `GOATPAY_API_KEY` | sua chave `gp_live_...` da GoatPay |

Salve e faça um novo deploy. Nunca inclua essa chave em arquivos HTML ou JavaScript do navegador.

## 3. Webhook de confirmação

Depois da primeira publicação, cadastre este endereço na GoatPay, usando o evento `payment.paid`:

`https://gaamexx.netlify.app/.netlify/functions/goatpay-webhook`

Ao criar o webhook, a GoatPay exibirá um segredo `whsec_...` uma única vez. Copie-o e crie no Netlify a variável:

| Variável | Valor |
| --- | --- |
| `GOATPAY_WEBHOOK_SECRET` | segredo `whsec_...` do webhook |

Salve e publique de novo.

## Como o fluxo funciona

O servidor calcula o total com seu próprio catálogo, aplica os cupons válidos e chama a GoatPay para gerar o QR Code. O navegador não recebe a chave da API. Após o PIX ser pago, o checkout consulta o status e mostra a tela **Pagamento confirmado**. A entrega continua manual, como solicitado.

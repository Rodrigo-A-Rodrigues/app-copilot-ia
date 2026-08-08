# Cenário Make — envio de mensagens do Copilot RH

Guia para montar o scenario no [Make.com](https://www.make.com) alinhado ao enunciado do desafio.

## Objetivo

Após o usuário gerar e aprovar um texto no app, o Next.js chama um **Webhook** do Make.
O Make encaminha a mensagem por **e-mail** e/ou **WhatsApp**.

## 1. Criar o scenario

1. Crie um scenario novo (ex.: `Copilot RH — Enviar mensagem`).
2. Módulo 1: **Webhooks → Custom webhook**
3. Copie a URL do webhook e cole em `MAKE_WEBHOOK_SEND_URL` no `.env`
4. (Opcional) Em **Advanced settings** do webhook, ative **API Key Authentication**,
   gere a chave e cole em `MAKE_WEBHOOK_SECRET` (o app envia no header `x-make-apikey`)

## 2. Payload enviado pelo app

`POST` JSON:

```json
{
  "channel": "email",
  "recipient": "colaborador@empresa.com",
  "subject": "Comunicado interno",
  "message": "Corpo em texto puro (com quebras de linha)",
  "messageHtml": "<!DOCTYPE html>...(template HTML do Copilot RH)...",
  "textType": "email",
  "tone": "formal",
  "companyName": "Nossa Empresa"
}
```

| Campo               | Descrição                                        |
| ------------------- | ------------------------------------------------ |
| `channel`           | `email` ou `whatsapp`                            |
| `recipient`         | E-mail ou telefone (E.164, ex.: `5511999999999`) |
| `subject`           | Assunto do e-mail                                |
| `message`           | Corpo em texto puro                              |
| `messageHtml`       | HTML formatado (use no módulo de e-mail)         |
| `textType` / `tone` | Metadados do assistente                          |
| `companyName`       | Identidade organizacional                        |

Autenticação (opcional): header HTTP `x-make-apikey` = valor de `MAKE_WEBHOOK_SECRET`.

## 3. Roteamento por canal

Após o Webhook, adicione um **Router**:

### Rota A — E-mail (`channel` = `email`)

- Módulo: **Email** (Gmail, Microsoft 365, SMTP, etc.)
- Para: `recipient`
- Assunto: `subject`
- **Content-Type / Content**: `HTML`
- Corpo HTML: mapeie o campo **`messageHtml`** (não use só `message`, senão chega texto corrido)

No Gmail do Make, em geral:

1. Content type → **HTML**
2. Content → `messageHtml`

### Rota B — WhatsApp (`channel` = `whatsapp`)

- Módulo: integração WhatsApp disponível no Make (Business Cloud API, Twilio, etc.)
- Destinatário: `recipient`
- Texto: `message`

## 4. Resposta ao app

Configure o Webhook para responder `200` com JSON simples, por exemplo:

```json
{ "ok": true }
```

O app trata qualquer HTTP 2xx como sucesso.

## 5. Demo acadêmica (mínimo viável)

Se WhatsApp exigir aprovação de template/número:

1. Implemente só a rota de **e-mail** para a apresentação
2. Mantenha o Router com a rota WhatsApp “pronta” (mesmo que em modo log)
3. Na fala: o mesmo webhook já diferencia o canal

## 6. Segurança

- Não exponha a URL do webhook no frontend
- O app chama Make apenas via `/api/send` (servidor, com sessão Supabase)
- Com API Key no webhook: `MAKE_WEBHOOK_SECRET` deve ser **exatamente** a key gerada no Make
- Sem API Key: deixe `MAKE_WEBHOOK_SECRET` vazio e não ative autenticação no webhook

# Cenário Make — envio de mensagens do Copilot RH

Guia para montar o scenario no [Make.com](https://www.make.com) alinhado ao enunciado do desafio.

## Objetivo

Após o usuário gerar e aprovar um texto no app, o Next.js chama um **Webhook** do Make.
O Make encaminha a mensagem por **e-mail** e/ou **WhatsApp**.

## 1. Criar o scenario

1. Crie um scenario novo (ex.: `Copilot RH — Enviar mensagem`).
2. Módulo 1: **Webhooks → Custom webhook**
3. Copie a URL do webhook e cole em `MAKE_WEBHOOK_SEND_URL` no `.env`
4. (Opcional) Defina um segredo compartilhado e use `MAKE_WEBHOOK_SECRET`

## 2. Payload enviado pelo app

`POST` JSON:

```json
{
  "channel": "email",
  "recipient": "colaborador@empresa.com",
  "subject": "Comunicado interno",
  "message": "Texto gerado pelo assistente...",
  "textType": "email",
  "tone": "formal",
  "companyName": "Nossa Empresa",
  "secret": "opcional"
}
```

| Campo | Descrição |
|---|---|
| `channel` | `email` ou `whatsapp` |
| `recipient` | E-mail ou telefone (E.164, ex.: `5511999999999`) |
| `subject` | Assunto (útil para e-mail) |
| `message` | Corpo da mensagem gerada |
| `textType` / `tone` | Metadados do assistente |
| `companyName` | Identidade organizacional |
| `secret` | Se configurado no app, o Make pode validar |

## 3. Roteamento por canal

Após o Webhook, adicione um **Router**:

### Rota A — E-mail (`channel` = `email`)

- Módulo: **Email** (Gmail, Microsoft 365, SMTP, etc.)
- Para: `recipient`
- Assunto: `subject` (fallback: “Comunicado — {{companyName}}”)
- Corpo: `message`

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
- Use `MAKE_WEBHOOK_SECRET` e filtre no Make se `secret` não bater

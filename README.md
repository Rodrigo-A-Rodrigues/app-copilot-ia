# Copilot RH

Assistente de comunicação interna com IA para o setor de RH.  
Gera e-mails, mensagens de WhatsApp, avisos institucionais e resumos de reunião a partir de inputs simples (tipo de texto, tópicos e tom de voz), com identidade organizacional — e pode enviar o resultado por e-mail ou WhatsApp via **Make.com**.

Projeto acadêmico idealizado pelo **Centro Universitário UniFECAF**.

---

## Proposta do projeto

### Problema

O RH e a comunicação interna gastam tempo demais redigindo textos repetitivos. O desafio pede um assistente inteligente baseado em LLM e prompt engineering para acelerar essa rotina, com possibilidade de automação low-code (Make, Zapier, etc.).

### Solução

1. **Núcleo:** app web onde o colaborador informa tipo, tom e tópicos; o **Gemini** gera a mensagem com prompt engineering e identidade da empresa.
2. **Complemento:** após revisar, o usuário dispara um webhook do **Make.com**, que encaminha o texto por e-mail ou WhatsApp.

```
Usuário (tipo + tópicos + tom)
    → Next.js
    → Gemini (prompt + identidade)
    → revisão / cópia
    → Make (e-mail ou WhatsApp)
```

### Stack

| Tecnologia                        | Papel                         |
| --------------------------------- | ----------------------------- |
| Next.js + TypeScript + Tailwind   | Interface e APIs              |
| shadcn/ui + React Hook Form + Zod | UI e validação de formulários |
| Supabase                          | Auth, perfil e histórico      |
| Google Gemini                     | Geração de textos             |
| Make.com                          | Orquestração de envios        |

Documentação adicional:

- [`docs/desafio.md`](./docs/desafio.md) — enunciado e resolução
- [`docs/architecture.md`](./docs/architecture.md) — arquitetura
- [`docs/make/scenario.md`](./docs/make/scenario.md) — scenario Make
- [`docs/supabase/schema.sql`](./docs/supabase/schema.sql) — schema do banco

---

## Pré-requisitos

- **Node.js** 20+ (recomendado)
- Conta no **[Supabase](https://supabase.com)**
- Chave da API **[Google Gemini](https://aistudio.google.com/apikey)** (free tier)
- Conta no **[Make.com](https://www.make.com)** (para envio por e-mail/WhatsApp)
- Git

Modelo Gemini recomendado para contas novas no free tier: `gemini-3.1-flash-lite`.

---

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Variáveis de ambiente

```bash
cp .env.example .env
```

Preencha no `.env`:

| Variável                        | Obrigatório | Descrição                                 |
| ------------------------------- | ----------- | ----------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Sim         | URL do projeto Supabase                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim         | Chave anon/publishable                    |
| `GEMINI_API_KEY`                | Sim*        | Chave do Google AI Studio                 |
| `LLM_MODEL`                     | Não         | Padrão: `gemini-3.1-flash-lite`           |
| `LLM_BASE_URL`                  | Não         | Padrão Gemini API                         |
| `LLM_MOCK`                      | Não         | `true` gera texto local sem chamar Gemini |
| `MAKE_WEBHOOK_SEND_URL`         | Para envio  | URL do Webhook do Make                    |
| `MAKE_WEBHOOK_SECRET`           | Não         | Segredo opcional validado no scenario     |

\* Sem `GEMINI_API_KEY`, o app usa geração mock (útil só para testar UI).

### 3. Supabase

1. Crie um projeto no Supabase.
2. Em **SQL Editor**, execute o conteúdo de [`docs/supabase/schema.sql`](./docs/supabase/schema.sql).
3. Copie URL e anon/publishable key para o `.env`.
4. (Opcional para demo) Em **Authentication → Providers → Email**, desative a confirmação de e-mail.

### 4. Make.com (envio)

1. Crie um scenario com **Webhooks → Custom webhook**.
2. Cole a URL em `MAKE_WEBHOOK_SEND_URL`.
3. Monte o Router (e-mail / WhatsApp) conforme [`docs/make/scenario.md`](./docs/make/scenario.md).

---

## Comandos

```bash
# Desenvolvimento (http://localhost:3000)
npm run dev

# Build de produção
npm run build

# Servir build de produção
npm run start

# Lint
npm run lint

# Formatar código (Prettier)
npm run format
```

---

## Como usar o app

1. Acesse `/signup` e crie uma conta.
2. Em `/perfil`, configure empresa e diretrizes de tom.
3. Em `/assistant`, escolha tipo de texto, tom e tópicos → **Gerar mensagem**.
4. Revise o resultado, copie ou use **Enviar pelo Make** (e-mail/WhatsApp).
5. O histórico aparece em `/dashboard`.

---

## Estrutura principal

```
src/
  app/
    (auth)/            # signin / signup
    (protected)/       # dashboard, assistant, perfil
    api/
      generate/        # geração via Gemini
      generations/     # histórico
      send/            # webhook Make
  components/          # UI e formulários
  lib/
    llm/               # cliente Gemini
    make/              # envio Make
    prompts/           # prompt engineering
    supabase/          # clients SSR
    validations/       # schemas Zod
docs/
  desafio.md
  architecture.md
  make/scenario.md
  supabase/schema.sql
```

---

## Observações

- Rotas protegidas exigem sessão Supabase (proxy/middleware Next.js 16).
- Ações de logout, edição de perfil e envio pedem confirmação em modal.
- Inputs/selects/buttons usam altura padrão `h-10`; botões usam `cursor-pointer`.

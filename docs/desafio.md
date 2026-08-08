# Desafio — Copiloto de Comunicação Interna (RH)

## Enunciado original

Você foi convidado por uma empresa de comunicação interna para idealizar uma
solução que auxilie colaboradores a escrever textos mais rápidos e assertivos no dia a
dia, como e-mails, resumos de reunião, mensagens para WhatsApp corporativo e avisos
institucionais. O RH está sobrecarregado com demandas repetitivas e percebeu que
pode ganhar tempo com uma ferramenta de IA Generativa.

Sua missão é prototipar e apresentar uma solução que utilize modelos de linguagem
(LLMs) com prompt engineering para automatizar esse tipo de tarefa. A ferramenta
pode ser uma automação usando Make.com, Zapier, Notion AI, ChatGPT (API) ou outra
de sua escolha, desde que não exija programação complexa.

O objetivo é você criar um assistente inteligente que, a partir de inputs simples do
usuário (como tópicos, tipo de texto e tom de voz desejado), gere automaticamente
mensagens corporativas coerentes, bem escritas e com identidade organizacional.

---

## Nossa resolução geral

### Problema que resolvemos

O RH e a comunicação interna gastam tempo demais redigindo textos repetitivos
(e-mails, WhatsApp corporativo, avisos e resumos). Queremos um **assistente de
escrita** que transforme inputs simples em mensagens prontas para uso, com tom e
identidade da empresa.

### Abordagem

1. **Núcleo (MVP do desafio):** copiloto de geração de textos corporativos com LLM
   (Gemini) e prompt engineering.
2. **Complemento (alinhado ao enunciado):** entrega automatizada via **Make.com**
   (e-mail / WhatsApp), sem programação complexa na orquestração.

### Stack escolhida

| Tecnologia               | Papel                                                                   |
| ------------------------ | ----------------------------------------------------------------------- |
| **Next.js + TypeScript** | Aplicação web do assistente (UI, fluxos protegidos)                     |
| **Supabase**             | Autenticação, perfil, histórico de gerações e identidade organizacional |
| **Google Gemini**        | Geração de textos a partir de prompts estruturados                      |
| **Make.com**             | Orquestração low-code de envios (e-mail / WhatsApp)                     |
| **E-mail**               | Canal de saída do texto gerado                                          |
| **WhatsApp**             | Canal de saída do texto gerado                                          |

### Fluxo principal (atende o enunciado)

```
Usuário informa: tipo de texto + tópicos/contexto + tom de voz
        ↓
Next.js envia a solicitação ao Gemini (com system prompt da empresa)
        ↓
Assistente gera mensagem corporativa (e-mail, WhatsApp, aviso ou resumo)
        ↓
Usuário revisa, copia ou aprova o envio
        ↓
Make recebe webhook e dispara e-mail ou WhatsApp
```

### Fluxo complementar (diferencial / fase 2)

```
E-mail chega na caixa monitorada
        ↓
Make processa / resume
        ↓
WhatsApp notifica o responsável com o resumo
```

### Escopo mínimo de entrega

- Tela do assistente com inputs: tipo de texto, tópicos e tom de voz
- Geração via Gemini com prompt engineering documentado
- Autenticação e histórico básico no Supabase
- Copiar texto + enviar via Make (e-mail ou WhatsApp)
- Demo cobrindo pelo menos 2–3 tipos de mensagem corporativa

### Critério de sucesso

A solução resolve o desafio quando um colaborador consegue, com poucos inputs,
obter um texto corporativo coerente, bem escrito e alinhado à identidade
organizacional — e, opcionalmente, encaminhá-lo pelos canais oficiais via Make.

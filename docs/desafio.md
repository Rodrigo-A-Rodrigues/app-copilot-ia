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

Invertemos a prioridade em relação a uma automação só de alertas:

1. **Núcleo (MVP do desafio):** copiloto de geração de textos corporativos com LLM e
   prompt engineering.
2. **Complemento (diferencial):** automações de entrega e triagem via N8N
   (e-mail / WhatsApp).

### Stack escolhida

| Tecnologia | Papel |
|---|---|
| **Next.js + TypeScript** | Aplicação web do assistente (UI, fluxos protegidos) |
| **Supabase** | Autenticação, perfil, histórico de gerações e identidade organizacional |
| **LLM (API)** | Geração de textos a partir de prompts estruturados |
| **N8N** | Orquestração de envios e automações secundárias |
| **E-mail** | Canal de saída do texto gerado e/ou monitoramento de entrada |
| **WhatsApp** | Canal de saída do texto gerado e/ou alerta ao responsável |

### Fluxo principal (atende o enunciado)

```
Usuário informa: tipo de texto + tópicos/contexto + tom de voz
        ↓
Next.js envia a solicitação ao LLM (com system prompt da empresa)
        ↓
Assistente gera mensagem corporativa (e-mail, WhatsApp, aviso ou resumo)
        ↓
Usuário revisa, copia ou aprova
        ↓
(Opcional) N8N dispara envio por e-mail ou WhatsApp
```

### Fluxo complementar (diferencial)

```
E-mail chega na caixa monitorada
        ↓
N8N processa e resume com LLM
        ↓
WhatsApp da empresa notifica o responsável com o resumo
```

Esse segundo fluxo **não substitui** o assistente de escrita; apenas reduz a carga de
triagem da caixa de entrada.

### Escopo mínimo de entrega

- Tela do assistente com inputs: tipo de texto, tópicos e tom de voz
- Geração via LLM com prompt engineering documentado (persona RH / identidade)
- Autenticação e histórico básico no Supabase
- Ações: copiar texto e, se houver tempo, enviar via N8N
- Demo cobrindo pelo menos 2–3 tipos de mensagem corporativa

### Fora do núcleo (fase 2)

- Monitoramento contínuo de e-mails com alerta no WhatsApp
- Filas de aprovação, templates avançados e multi-empresa

### Critério de sucesso

A solução resolve o desafio quando um colaborador consegue, com poucos inputs,
obter um texto corporativo coerente, bem escrito e alinhado à identidade
organizacional — e, opcionalmente, encaminhá-lo pelos canais oficiais da empresa.

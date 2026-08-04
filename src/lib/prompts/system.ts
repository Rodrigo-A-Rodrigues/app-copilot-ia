import {
  TEXT_TYPE_LABELS,
  TONE_LABELS,
  type TextType,
  type Tone,
} from "@/types/domain";

type PromptIdentity = {
  companyName: string;
  toneGuidelines: string | null;
};

type BuildUserPromptInput = {
  textType: TextType;
  tone: Tone;
  topics: string;
};

export function buildSystemPrompt(identity: PromptIdentity): string {
  const guidelines =
    identity.toneGuidelines?.trim() ||
    "Linguagem clara, objetiva e respeitosa. Evite jargões desnecessários.";

  return [
    "Você é um assistente de comunicação interna do RH.",
    `Empresa: ${identity.companyName}.`,
    "Sua função é redigir mensagens corporativas coerentes, bem escritas e alinhadas à identidade organizacional.",
    `Diretrizes de tom da empresa: ${guidelines}`,
    "Regras:",
    "- Escreva em português do Brasil.",
    "- Não invente fatos, datas, nomes ou políticas que não estejam nos tópicos.",
    "- Adapte formato e extensão ao tipo de texto solicitado.",
    "- Para e-mail: entregue Assunto e Corpo.",
    "- Para WhatsApp: mensagem curta, direta e legível em celular.",
    "- Para aviso institucional: título + texto principal.",
    "- Para resumo de reunião: bullets dos pontos + parágrafo de próximos passos.",
    "- Não use markdown com cercas de código; use texto simples e títulos claros.",
  ].join("\n");
}

export function buildUserPrompt(input: BuildUserPromptInput): string {
  return [
    `Tipo de texto: ${TEXT_TYPE_LABELS[input.textType]}`,
    `Tom de voz: ${TONE_LABELS[input.tone]}`,
    "Tópicos / contexto:",
    input.topics.trim(),
    "",
    "Gere apenas a mensagem final pronta para uso.",
  ].join("\n");
}

/** Resposta local para desenvolvimento sem chave de LLM. */
export function buildMockResult(input: BuildUserPromptInput): string {
  const typeLabel = TEXT_TYPE_LABELS[input.textType];
  const toneLabel = TONE_LABELS[input.tone];
  const topics = input.topics.trim();

  switch (input.textType) {
    case "email":
      return [
        `Assunto: Comunicação interna — ${toneLabel.toLowerCase()}`,
        "",
        "Olá, equipe,",
        "",
        `Segue comunicação (${typeLabel}) com tom ${toneLabel.toLowerCase()}:`,
        "",
        topics,
        "",
        "Ficamos à disposição para dúvidas.",
        "",
        "Atenciosamente,",
        "Equipe de RH",
      ].join("\n");
    case "whatsapp":
      return [
        `Olá! Passando um comunicado do RH (${toneLabel.toLowerCase()}):`,
        "",
        topics,
        "",
        "Qualquer dúvida, nos avise por aqui.",
      ].join("\n");
    case "notice":
      return [
        "AVISO INSTITUCIONAL",
        "",
        topics,
        "",
        `Comunicado elaborado em tom ${toneLabel.toLowerCase()}.`,
      ].join("\n");
    case "meeting_summary":
      return [
        "Resumo da reunião",
        "",
        "Pontos principais:",
        `- ${topics}`,
        "",
        "Próximos passos:",
        "- Validar pendências com os responsáveis",
        "- Compartilhar este resumo com os participantes",
      ].join("\n");
    default:
      return topics;
  }
}

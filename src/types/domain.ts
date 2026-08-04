export const TEXT_TYPES = [
  "email",
  "whatsapp",
  "notice",
  "meeting_summary",
] as const;

export type TextType = (typeof TEXT_TYPES)[number];

export const TONES = [
  "formal",
  "acolhedor",
  "urgente",
  "neutro",
  "motivacional",
] as const;

export type Tone = (typeof TONES)[number];

export const TEXT_TYPE_LABELS: Record<TextType, string> = {
  email: "E-mail",
  whatsapp: "WhatsApp corporativo",
  notice: "Aviso institucional",
  meeting_summary: "Resumo de reunião",
};

export const TONE_LABELS: Record<Tone, string> = {
  formal: "Formal",
  acolhedor: "Acolhedor",
  urgente: "Urgente",
  neutro: "Neutro",
  motivacional: "Motivacional",
};

export type Profile = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  tone_guidelines: string | null;
  created_at: string;
};

export type Generation = {
  id: string;
  user_id: string;
  text_type: TextType;
  tone: Tone;
  topics: string;
  result: string;
  created_at: string;
};

export type GenerateRequest = {
  textType: TextType;
  tone: Tone;
  topics: string;
};

export type GenerateResponse = {
  result: string;
  generationId: string | null;
};

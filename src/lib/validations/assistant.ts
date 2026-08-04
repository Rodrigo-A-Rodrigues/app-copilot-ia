import { z } from "zod";

import { TEXT_TYPES, TONES } from "@/types/domain";

export const generateSchema = z.object({
  textType: z.enum(TEXT_TYPES, {
    error: "Selecione um tipo de texto válido.",
  }),
  tone: z.enum(TONES, {
    error: "Selecione um tom de voz válido.",
  }),
  topics: z
    .string()
    .trim()
    .min(3, "Descreva os tópicos com pelo menos 3 caracteres.")
    .max(4000, "Os tópicos devem ter no máximo 4000 caracteres."),
});

export type GenerateValues = z.infer<typeof generateSchema>;

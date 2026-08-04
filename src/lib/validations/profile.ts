import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Informe o nome.").max(120),
  companyName: z.string().trim().min(1, "Informe a empresa.").max(120),
  toneGuidelines: z
    .string()
    .trim()
    .max(2000, "As diretrizes devem ter no máximo 2000 caracteres.")
    .optional()
    .or(z.literal("")),
});

export type ProfileValues = z.infer<typeof profileSchema>;

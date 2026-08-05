import { z } from "zod";

import { TEXT_TYPES, TONES } from "@/types/domain";

export const sendChannels = ["email", "whatsapp"] as const;

export const sendSchema = z
  .object({
    channel: z.enum(sendChannels, {
      error: "Selecione um canal válido.",
    }),
    recipient: z.string().trim().min(3, "Informe o destinatário."),
    subject: z.string().trim().max(200).optional().or(z.literal("")),
    message: z.string().trim().min(1, "Não há mensagem para enviar."),
    textType: z.enum(TEXT_TYPES),
    tone: z.enum(TONES),
  })
  .superRefine((data, ctx) => {
    if (data.channel === "email") {
      const emailCheck = z.email().safeParse(data.recipient);
      if (!emailCheck.success) {
        ctx.addIssue({
          code: "custom",
          path: ["recipient"],
          message: "Informe um e-mail válido.",
        });
      }
    }

    if (data.channel === "whatsapp") {
      const phone = data.recipient.replace(/[\s()-]/g, "");
      if (!/^\+?\d{10,15}$/.test(phone)) {
        ctx.addIssue({
          code: "custom",
          path: ["recipient"],
          message: "Informe o WhatsApp com DDI (ex.: 5511999999999).",
        });
      }
    }
  });

export type SendValues = z.infer<typeof sendSchema>;

import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2, "Informe seu nome completo."),
  companyName: z.string().optional(),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;

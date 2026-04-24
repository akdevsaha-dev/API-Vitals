import z from "zod";

export const signupSchema = z.object({
  email: z.email().toLowerCase().trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),
});

export type signupInput = z.infer<typeof signupSchema>;

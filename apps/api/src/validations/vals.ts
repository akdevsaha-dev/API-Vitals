import z from "zod";

export const signupSchema = z.object({
  email: z.email().toLowerCase().trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),
});

export const signinSchema = z.object({
  email: z.email().toLowerCase().trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),
});

export type signupInput = z.infer<typeof signupSchema>;
export type signinInput = z.infer<typeof signinSchema>;

export const createProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export type createProjectInput = z.infer<typeof createProjectSchema>;

export const createTargetSchema = z.object({
  url: z.string(),
  label: z.string().optional(),
});

export type createTargetInput = z.infer<typeof createTargetSchema>;

export const triggerAuditSchema = z.object({
  targetId: z.string(),
});

export type triggerInput = z.infer<typeof triggerAuditSchema>;

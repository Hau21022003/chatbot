import { z } from "zod";

export const EditPasswordBody = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Password cannot be empty",
    }),
    newPassword: z.string().min(1, {
      message: "New password cannot be empty",
    }),
    confirmPassword: z.string().min(1, {
      message: "Confirm password cannot be empty",
    }),
  })
  .superRefine((data, ctx) => {
    const pwd = data.newPassword;

    if (pwd.length < 8) {
      ctx.addIssue({
        path: ["newPassword"],
        code: z.ZodIssueCode.custom,
        message: "Must be at least 8 characters",
      });
    }

    if (!/[A-Z]/.test(pwd)) {
      ctx.addIssue({
        path: ["newPassword"],
        code: z.ZodIssueCode.custom,
        message: "Must contain at least one uppercase letter",
      });
    }

    if (!/[0-9]/.test(pwd)) {
      ctx.addIssue({
        path: ["newPassword"],
        code: z.ZodIssueCode.custom,
        message: "Must contain at least one number",
      });
    }

    if (!/[^A-Za-z0-9]/.test(pwd)) {
      ctx.addIssue({
        path: ["newPassword"],
        code: z.ZodIssueCode.custom,
        message: "Must contain at least one special character",
      });
    }

    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
      });
    }
  });
export type EditPasswordBodyType = z.TypeOf<typeof EditPasswordBody>;

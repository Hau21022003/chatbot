import z from "zod";

export const RegisterBody = z
  .object({
    email: z.string().email(),
    password: z.string().min(1, {
      message: "Password cannot be empty",
    }),
    confirmPassword: z.string().min(1, {
      message: "Confirm password cannot be empty",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

export const RegisterRes = z.object({
  data: z.object({
    accessToken: z.string(),
    accessTokenExpiresAt: z.string(),
    refreshToken: z.string(),
    refreshTokenExpiresAt: z.string(),
    account: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      role: z.enum(["admin", "user"]),
      userType: z.enum(["free", "enterprise"]),
    }),
  }),
  message: z.string(),
});

export type RegisterResType = z.TypeOf<typeof RegisterRes>;

export const LoginBody = z
  .object({
    email: z.string().email(),
    password: z.string().min(1, {
      message: "Password cannot be empty",
    }),
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginRes = RegisterRes;

export type LoginResType = z.TypeOf<typeof LoginRes>;
export const SlideSessionBody = z.object({}).strict();

export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>;
export const SlideSessionRes = RegisterRes;

export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>;

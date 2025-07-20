import { createBaseResp } from "@/schemas/common.schema";
import { z } from "zod";

export const CreatePaymentUrlSchema = z.object({
  paymentUrl: z.string(),
});
export const CreatePaymentUrlRes = createBaseResp(CreatePaymentUrlSchema);
export type CreatePaymentUrlResType = z.infer<typeof CreatePaymentUrlRes>;

export const VerifyReturnUrlSchema = z.object({
  isSuccess: z.boolean(),
  isVerified: z.boolean(),
  message: z.string(),
});
export const VerifyReturnUrlRes = createBaseResp(VerifyReturnUrlSchema);
export type VerifyReturnUrlResType = z.infer<typeof VerifyReturnUrlRes>;

import { AccountSchema } from "@/schemas/account.schema";
import {
  createBaseResp,
  createPaginationBody,
  createPaginationRes,
} from "@/schemas/common.schema";
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

export enum InvoiceStatus {
  Pending = "pending",
  Completed = "completed",
  Failed = "failed",
  Expired = "expired",
  Cancelled = "cancelled",
}
export const PaymentSchema = z.object({
  id: z.string(),
  amount: z.number(),
  status: z.nativeEnum(InvoiceStatus),
  userId: z.string(),
  createdAt: z.string().date(),
  user: AccountSchema.optional(),
});
export const PaymentRes = createBaseResp(z.array(PaymentSchema));
export type PaymentResType = z.infer<typeof PaymentRes>;

export const FindAllPaymentBody = createPaginationBody(
  z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  })
);
export type FindAllPaymentBodyType = z.TypeOf<typeof FindAllPaymentBody>;

export const FindAllPaymentRes = createPaginationRes(PaymentSchema);
export type FindAllPaymentResType = z.TypeOf<typeof FindAllPaymentRes>;

export const StatisticInvoiceRes = createBaseResp(
  z.object({
    total: z.number(),
    growthRate: z.number(),
    growthStatus: z.enum(["increase", "decrease"]),
    monthlyTotals: z.array(z.object({ month: z.string(), total: z.number() })),
  })
);
export type StatisticInvoiceResType = z.TypeOf<typeof StatisticInvoiceRes>;

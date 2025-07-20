import http from "@/lib/http";
import {
  CreatePaymentUrlResType,
  VerifyReturnUrlResType,
} from "@/schemas/payment.schema";

export const paymentApiRequest = {
  createPaymentUrl: () => http.get<CreatePaymentUrlResType>("/payment"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verifyReturnUrl: (body: Record<string, any>) =>
    http.post<VerifyReturnUrlResType>("/payment/vnpay/verify", body),
};

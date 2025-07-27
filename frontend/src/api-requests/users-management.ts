import http from "@/lib/http";
import { PaymentResType } from "@/schemas/payment.schema";
import {
  FindAllUserBodyType,
  FindAllUserResType,
} from "@/schemas/users.schema";

export const userManagementApiRequest = {
  findAllUsers: (body: FindAllUserBodyType) =>
    http.post<FindAllUserResType>("/users/find-all", body),
  findPayments: (userId: string) =>
    http.get<PaymentResType>(`/payment/find-by-user-id/${userId}`),
  exportUsers: (ids: string[]) =>
    window.open(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/export-users/${ids.join(
        ","
      )}`,
      "_blank"
    ),
};

"use client";
import { paymentApiRequest } from "@/api-requests/payment";
import { profileApiRequest } from "@/api-requests/profile";
import { useAppContext } from "@/app/app-provider";
import { handleErrorApi } from "@/lib/error";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function VnpReturnPage() {
  const { setUser } = useAppContext();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"pending" | "success" | "fail">(
    "pending"
  );
  useEffect(() => {
    if (!searchParams) return;

    const verify = async () => {
      const query: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        query[key] = value;
      });

      try {
        const response = await paymentApiRequest.verifyReturnUrl(query);
        const { isSuccess } = response.payload.data;
        setStatus(isSuccess ? "success" : "fail");
        const result = await profileApiRequest.getProfile();
        setUser(result.payload.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setStatus("fail");
        handleErrorApi(error);
      }
    };

    verify();
  }, [searchParams]);
  return (
    <div style={{ padding: "2rem" }}>
      {status === "pending" && <p>Đang xác minh thanh toán...</p>}
      {status === "success" && (
        <p style={{ color: "green" }}>✅ Thanh toán thành công!</p>
      )}
      {status === "fail" && (
        <p style={{ color: "red" }}>
          ❌ Thanh toán thất bại hoặc không hợp lệ.
        </p>
      )}
    </div>
  );
}

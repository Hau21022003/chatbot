"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { profileApiRequest } from "@/api-requests/profile";
import { useAppContext } from "@/app/app-provider";

export default function GoogleSuccessPage() {
  const router = useRouter();
  const { setUser } = useAppContext();

  const load = async () => {
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get("accessToken");
    const expiresAt = url.searchParams.get("accessTokenExpiresAt");

    if (accessToken && expiresAt) {
      localStorage.setItem("sessionToken", accessToken);
      localStorage.setItem("sessionTokenExpiresAt", expiresAt);
      const rsp = await profileApiRequest.getProfile();
      const user = rsp.payload.data;
      setUser(user);

      router.replace("/");
    } else {
      router.replace("/login");
    }
  };
  useEffect(() => {
    load();
  }, [router]);

  return <p>Đang đăng nhập...</p>;
}

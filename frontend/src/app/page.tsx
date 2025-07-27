"use client";
import { useAppContext } from "@/app/app-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const { user, isAuthenticated, isLoading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Đợi loading xong

    console.log("user?.role", user?.role);

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.role === "admin") {
      router.push("/admin/dashboard");
      return;
    }

    router.push("/chat");
  }, [isLoading, isAuthenticated, user, router]);

  // Hiển thị loading trong khi đang redirect
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}

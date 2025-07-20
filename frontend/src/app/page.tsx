"use client";
import { useAppContext } from "@/app/app-provider";
import { redirect } from "next/navigation";
export default function Home() {
  const { user, isAuthenticated } = useAppContext();
  if (!isAuthenticated) {
    redirect("/login");
  }
  if (user?.role === "admin") {
    redirect("/admin/home");
  }
  redirect("/chat");
}

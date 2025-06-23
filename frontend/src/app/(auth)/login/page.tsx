import { LoginForm } from "@/app/(auth)/login/components/login-form";
import TestimonialCard from "@/components/shared/testimonial-card";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex items-stretch">
          {/* Left: Login Form */}
          <div className="w-1/2 px-12 py-8 space-y-2">
            {/* <img src="/logo.svg" alt="Logo" className="w-10 h-10" /> */}
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            <h3 className="text-2xl font-bold">Welcome Back</h3>
            <p className="text-gray-600 mb-8">
              Please enter your credentials to continue
            </p>
            <LoginForm />
          </div>

          {/* Right */}
          <div className="w-1/2 py-8 pr-8">
            <TestimonialCard />
          </div>
        </div>
      </div>
    </div>
  );
}

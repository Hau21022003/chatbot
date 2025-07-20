"use client";
import { paymentApiRequest } from "@/api-requests/payment";
import { useAppContext } from "@/app/app-provider";
import { handleErrorApi } from "@/lib/error";
import { Check } from "lucide-react";
import React from "react";

export default function PricingPage() {
  const { user } = useAppContext();
  const createPaymentUrl = async () => {
    try {
      const response = await paymentApiRequest.createPaymentUrl();
      const paymentUrl = response.payload.data.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi(error);
    }
  };
  return (
    <div className="px-8 pt-8 pb-4 h-full overflow-y-auto">
      <p className="font-medium text-2xl">Plans and Pricing</p>
      <p className="mt-2 text-gray-500 text-sm">
        Flexible plans for every need - start for free, upgrade anytime.
      </p>
      <div className="mt-6 flex items-stretch gap-8">
        <div className="border border-gray-300 p-6 rounded-2xl w-96">
          <p className="font-semibold text-xl">Free</p>
          <div className="font-medium text-5xl mt-8 flex">
            <p className="leading-none tracking-widest">$0</p>
          </div>
          <p className="text-gray-400 mt-2">Per user/month, billed annually</p>
          <button
            className={`mt-4 border border-gray-400 rounded-lg w-full p-2 font-medium ${
              user?.userType == "free"
                ? "hover:cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-100"
            }`}
          >
            {user?.userType == "free" ? "Current" : "Get started for free"}
          </button>
          <ul className="mt-4 text-gray-400 space-y-2">
            <li className="flex gap-2 items-center">
              <Check className="w-5 h-5" />
              <p>Access to basic chatbot conversations</p>
            </li>
            <li className="flex gap-2 items-center">
              <Check className="w-5 h-5" />
              <p>Limited daily messages</p>
            </li>
            <li className="flex gap-2 items-center">
              <Check className="w-5 h-5" />
              <p>Text-only responses</p>
            </li>
            <li className="flex gap-2 items-center">
              <Check className="w-5 h-5" />
              <p>Slower response speed during high traffic</p>
            </li>
            <li className="flex gap-2 items-center">
              <Check className="w-5 h-5" />
              <p>Text-only responses</p>
            </li>
          </ul>
        </div>
        <div className="border border-gray-300 p-6 rounded-2xl w-96">
          <p className="font-semibold text-xl">Pro</p>
          <div className="font-medium text-5xl mt-8 flex">
            <p className="leading-none tracking-widest">$5</p>
          </div>
          <p className="text-gray-400 mt-2">Per user/month, billed annually</p>
          <button
            disabled={user?.userType === "enterprise"}
            onClick={createPaymentUrl}
            className={`mt-4 border border-gray-400 rounded-lg w-full p-2 font-medium ${
              user?.userType == "enterprise"
                ? "hover:cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-100"
            }`}
          >
            {user?.userType == "enterprise"
              ? "Current"
              : "Get started with pro"}
          </button>
          <ul className="mt-4 text-gray-400 space-y-2">
            <li className="flex gap-2 items-center">
              <Check className="w-5 h-5" />
              <p>Unlimited chatbot conversations</p>
            </li>
            <li className="flex gap-2 items-center">
              <Check className="w-5 h-5" />
              <p>Faster response speed</p>
            </li>
            <li className="flex gap-2 items-center">
              <Check className="w-5 h-5" />
              <p>Multiple AI personalities / assistants</p>
            </li>
            <li className="flex gap-2 items-center">
              <Check className="w-5 h-5" />
              <p>Image and file generation support</p>
            </li>
            <li className="flex gap-2 items-center">
              <Check className="w-5 h-5" />
              <p>Priority customer support</p>
            </li>
            <li className="flex gap-2 items-center">
              <Check className="w-5 h-5" />
              <p>Enhanced data privacy and encryption</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

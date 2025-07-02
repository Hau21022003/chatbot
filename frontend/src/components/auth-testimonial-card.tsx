"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function TestimonialCard() {
  const testimonials = [
    {
      quote:
        "The AI writes clean, SEO-friendly code faster than I could ever imagine.",
      name: "Sophia Martinez",
      role: "Frontend Developer",
    },
    {
      quote:
        "I don’t even know how to code, and I created a full website in 10 minutes.",
      name: "Marcus Lee",
      role: "Small Business Owner",
    },
    {
      quote: "This tool saves me hours. I use it daily to scaffold components.",
      name: "Noah Rivera",
      role: "Full Stack Engineer",
    },
    {
      quote: "Perfect for prototyping — from idea to layout in minutes.",
      name: "Ethan Walker",
      role: "Freelance Designer",
    },
  ];
  const [index, setIndex] = useState(0);
  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const { quote, name, role } = testimonials[index];

  return (
    <div className="h-full w-full relative">
      <div className="w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-orange-300 via-orange-400 to-red-500 p-4 flex flex-col justify-end">
        {/* Quote box */}
        <div className="relative bg-white/30 backdrop-blur-md rounded-2xl p-3 text-white mt-auto">
          {" "}
          {/* thêm mr-14 để chừa chỗ notch */}
          <p className="text-lg font-semibold mb-6">
            {quote}
          </p>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm">{role}</p>
          </div>
          <div className="absolute bottom-0 right-0 w-26 h-14 bg-[#fc4132] rounded-tl-[20px] z-10" />
          <div className="absolute bottom-14 right-0 w-3 h-3 bg-[#fc4132] [mask-image:radial-gradient(circle_at_top_left,transparent_70%,black_71%)]"></div>
          <div className="absolute bottom-0 right-26 w-3 h-3 bg-[#fc4132] [mask-image:radial-gradient(circle_at_top_left,transparent_70%,black_71%)]"></div>
        </div>
      </div>
      {/* Cut-out corner / notch */}
      <div className="absolute bottom-0 right-0 w-26 h-14 bg-white rounded-tl-[20px] z-10" />
      <div className="absolute bottom-14 right-0 w-3 h-3 bg-white [mask-image:radial-gradient(circle_at_top_left,transparent_70%,black_71%)]"></div>
      <div className="absolute bottom-0 right-26 w-3 h-3 bg-white [mask-image:radial-gradient(circle_at_top_left,transparent_70%,black_71%)]"></div>

      {/* Navigation buttons */}
      <div className="absolute bottom-0 right-0 flex gap-2 z-20">
        <button onClick={handlePrev} className="w-10 h-10 bg-white rounded-md flex items-center justify-center border border-gray-300 hover:bg-gray-100">
          <ArrowLeft strokeWidth={1.5} />
        </button>
        <button onClick={handleNext} className="w-10 h-10 bg-white rounded-md flex items-center justify-center border border-gray-300 hover:bg-gray-100">
          <ArrowRight strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

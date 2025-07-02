/* eslint-disable @next/next/no-img-element */
"use client";

import { showImage } from "@/components/image-viewer";
import React from "react";

interface Props {
  content: string;
  images?: (string | File)[];
}

export default function ChatMessage({ content, images }: Props) {

  return (
    <div className="py-4">
      {images && (
        <div className="ml-auto w-2/5 flex justify-end flex-wrap gap-2 mb-2">
          {images.map((image, index) => (
            <img
              key={index}
              src={image instanceof File ? URL.createObjectURL(image) : image}
              alt="Image"
              onClick={() => {
                showImage(
                  image instanceof File ? URL.createObjectURL(image) : image
                );
              }}
              className="w-30 h-30 object-cover rounded-xl border cursor-pointer"
            />
          ))}
        </div>
      )}
      <div className="ml-auto w-2/3 py-4 px-6 bg-gray-100 rounded-2xl">
        {content}
      </div>
    </div>
  );
}

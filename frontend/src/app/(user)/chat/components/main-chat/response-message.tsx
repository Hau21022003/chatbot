"use client";

import React, { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";

function CodeBlock({
  codeBlock,
  language,
}: {
  codeBlock: string;
  language: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeBlock).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="rounded-xl bg-white mt-2">
      <div className="px-6 py-2 flex items-center justify-between gap-2 border-b-2 border-gray-300 text-gray-400">
        <p className="font-medium text-sm">{language}</p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 cursor-pointer"
        >
          {copied ? (
            <Check className="w-5 h-5" strokeWidth={2.5} />
          ) : (
            <Copy className="w-5 h-5" strokeWidth={2.5} />
          )}
          <p className="font-medium text-sm">
            {copied ? "Copied" : "Copy code"}
          </p>
        </button>
      </div>
      <Highlight theme={themes.oneLight} code={codeBlock} language={language}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="bg-white overflow-x-auto rounded-b-xl py-4 px-6 font-semibold">
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="select-none opacity-50 mr-4">{i + 1}</span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

export default function ResponseMessage({ message }: { message: string }) {
  const message_elements: React.JSX.Element[] = [];
  const parts = message?.split("```");
  parts?.forEach((part, index) => {
    // Đây là phần code block
    if (index % 2 === 1) {
      const [language, ...codeLines] = part.split("\n");
      const code = codeLines.join("\n").trim();
      const cleanLanguage = language.trim().toLowerCase();
      message_elements.push(
        <CodeBlock codeBlock={code} language={cleanLanguage} />
      );
    } else {
      const paragraphs = part.split("\n").filter((p) => p.trim());
      message_elements.push(
        ...paragraphs.map((paragraph, paragraph_index) => (
          <p key={paragraph_index}>{paragraph}</p>
        ))
      );
    }
  });

  return (
    <div className="py-6">
      <div className="relative px-6 py-4 overflow-hidden bg-gray-50 rounded-2xl">
        <div
          className="absolute top-0 right-0 h-2/3 w-2/3 pointer-events-none"
          style={{
            background:
              "radial-gradient(at top right, rgba(251, 146, 60, 0.3), transparent 70%)",
          }}
        />
        <div className="relative z-10 space-y-4">{message_elements}</div>
      </div>
      <div className="mt-2 flex items-center justify-end gap-2 text-gray-500">
        <button title="Like" className="p-2 rounded-md bg-gray-100 cursor-pointer hover:bg-gray-100">
          <ThumbsUp className="w-5 h-5" />
        </button>
        <button title="Dislike" className="p-2 rounded-md bg-gray-100 cursor-pointer hover:bg-gray-100">
          <ThumbsDown className="w-5 h-5" />
        </button>
        <button title="Copy" className="p-2 rounded-md bg-gray-100 cursor-pointer hover:bg-gray-100">
          <Copy className="w-5 h-5" onClick={() => {navigator.clipboard.writeText(parts.join("\n"))}}/>
        </button>
      </div>
    </div>
  );
}

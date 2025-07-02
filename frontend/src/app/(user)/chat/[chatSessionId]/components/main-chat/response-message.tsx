"use client";

import React, { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { ReactionType } from "@/schemas/chat.schema";
import { handleErrorApi } from "@/lib/error";
import chatApiRequest from "@/api-requests/chat";

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
        <p className="font-medium text-sm leading-none">{language}</p>
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

export default function ResponseMessage({
  id,
  message,
  reaction,
}: {
  id: string;
  message: string;
  reaction?: ReactionType;
}) {
  const [copied, setCopied] = useState(false);
  const [editReaction, setEditReaction] = useState<ReactionType | undefined>(
    reaction
  );

  const message_elements: React.JSX.Element[] = [];
  const parts = message?.split("```");
  parts?.forEach((part, index) => {
    if (index % 2 === 1) {
      const [language, ...codeLines] = part.split("\n");
      const code = codeLines.join("\n").trim();
      const cleanLanguage = language.trim().toLowerCase();
      message_elements.push(
        <CodeBlock key={index} codeBlock={code} language={cleanLanguage} />
      );
    } else {
      const paragraphs = part.split("\n").filter((p) => p.trim());
      message_elements.push(
        ...paragraphs.map((paragraph, paragraph_index) => (
          <p key={`${index}_${paragraph_index}`}>{paragraph}</p>
        ))
      );
    }
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(parts.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reactMessage = async (newReaction: ReactionType) => {
    try {
      await chatApiRequest.reactMessage(id, { reaction: newReaction });
      setEditReaction(newReaction);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };

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
        <button
          title="Like"
          onClick={() => {
            if (editReaction == ReactionType.LIKE)
              reactMessage(ReactionType.NONE);
            else reactMessage(ReactionType.LIKE);
          }}
          className={`p-2 rounded-md ${
            editReaction == ReactionType.LIKE
              ? "bg-[#24252d] text-white"
              : "bg-gray-100 hover:bg-gray-100"
          } cursor-pointer`}
        >
          <ThumbsUp className="w-5 h-5" />
        </button>
        <button
          title="Dislike"
          onClick={() => {
            if (editReaction == ReactionType.DISLIKE)
              reactMessage(ReactionType.NONE);
            else reactMessage(ReactionType.DISLIKE);
          }}
          className={`p-2 rounded-md ${
            editReaction == ReactionType.DISLIKE
              ? "bg-[#24252d] text-white"
              : "bg-gray-100 hover:bg-gray-100"
          } cursor-pointer`}
        >
          <ThumbsDown className="w-5 h-5" />
        </button>
        <button
          title="Copy"
          onClick={handleCopy}
          className="p-2 rounded-md bg-gray-100 cursor-pointer hover:bg-gray-100"
        >
          {copied ? (
            <Check className="w-5 h-5" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}

import History from "@/app/(user)/chat/components/history";
import MainChat from "@/app/(user)/chat/components/main-chat";

export default function ChatPage() {
  return (
    <div className="bg-[#24252d] h-full py-4 pr-4">
      <div className="flex h-full overflow-hidden rounded-3xl">
        <div className="flex-1">
          <MainChat />
        </div>
        <div className="w-72 bg-white">
          <History />
        </div>
      </div>
    </div>
  );
}

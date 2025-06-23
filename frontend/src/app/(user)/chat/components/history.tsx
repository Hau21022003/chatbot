import { Checkbox } from "@/components/ui/checkbox";
import { Trash } from "lucide-react";

const HistoryItem = ({
  id,
  title,
  description,
  active = false,
}: {
  id: number;
  title: string;
  description: string;
  active?: boolean;
}) => {
  return (
    <div
      className={`flex gap-4 p-2 hover:bg-gray-50 rounded-xl cursor-pointer ${
        active ? "shadow-lg border-2 border-b-gray-50" : ""
      }`}
    >
      <Checkbox
        id={id.toString()}
        className="data-[state=checked]:bg-gray-700 w-5 h-5 border-2"
      />
      <div className="flex-1 space-x-4">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default function History() {
  return (
    <div
      className="flex flex-col h-full bg-gray-50 border-l-2 border-gray-200"
      style={{
        boxShadow: "inset 8px 0 14px -8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="h-16 px-5 flex items-center justify-between gap-2 border-b-2 border-gray-200">
        <span className="font-medium text-xl tracking-wide">History</span>
        <span className="text-sm px-3 py-1 font-medium text-gray-500 bg-gray-100 rounded-2xl">
          2:30 PM
        </span>
      </div>
      {/* <div className="border-t-2 border-gray-200"></div> */}
      <div className="flex-1 flex flex-col justify-between">
        <nav className="space-y-4 py-5 px-3">
          <HistoryItem
            id={1}
            title="User1"
            description="Hello, how are you?"
            active
          />
          <HistoryItem
            id={2}
            title="User2"
            description="I'm fine, thank you!"
          />
        </nav>

        <div className="py-5 px-3 flex justify-center items-center">
          <button className="p-2 w-full font-medium text-gray-500 flex items-center gap-2 justify-center rounded-lg bg-white shadow-lg border-2 border-b-gray-100">
            <Trash className="w-5 h-4" />
            <span className="text-sm leading-none">Clear History</span>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";

const ToolPanel = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Images");

  const tabs = ["Images", "Text", "Colors"];

  return (
    <div className="min-h-screen flex items-center justify-between h-16 px-5 border-b-2 border-gray-200">
        <div className="relative inline-block">
          <button
            onClick={() => setOpen(!open)}
            title="Tools"
            className="rounded-lg bg-gray-100 p-3 hover:bg-gray-200 transition-colors"
          >
            <Settings2 className="w-5 h-5 text-gray-500" />
          </button>
    
          {open && (
            <div className="absolute bottom-full mb-2 left-0 w-64 bg-white rounded-lg shadow-lg border z-50">
              <div className="flex border-b">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 text-sm font-medium ${
                      activeTab === tab
                        ? "border-b-2 border-orange-500 text-orange-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-4 text-sm">
                {activeTab === "Images" && <div>🖼 Upload or manage images</div>}
                {activeTab === "Text" && <div>🔤 Insert or edit text</div>}
                {activeTab === "Colors" && <div>🎨 Choose colors</div>}
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default ToolPanel;

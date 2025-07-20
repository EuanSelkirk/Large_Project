import React, { useState } from "react";
import ResumeEditor from "../components/ResumeEditor";
import LivePreview from "../components/LivePreview";

const EditorPage = () => {
  const [code, setCode] = useState(`function Resume() {
  return (
    <div className="resume">
      <h1>Jane Doe</h1>
      <p>Full-Stack Developer</p>
    </div>
  );
}

ReactDOM.render(<Resume />, document.getElementById("root"));`);

  const [cssCode, setCssCode] = useState(`.resume {
  font-family: 'Georgia', serif;
  padding: 2rem;
}
.resume h1 {
  font-size: 2rem;
}
`);

  const [activeTab, setActiveTab] = useState<"jsx" | "css" | "preview">("jsx");

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-white font-mono">
      {/* Tabs with Login/Register buttons */}
      <div className="flex justify-between items-center bg-[#2d2d2d] px-2 text-sm select-none">
        {/* Tabs */}
        <div className="flex space-x-1">
          {["jsx", "css", "preview"].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab as "jsx" | "css" | "preview")}
              className={`px-3 py-1 border-t border-l border-r rounded-t-sm cursor-pointer ${
                activeTab === tab
                  ? "bg-[#1e1e1e] border-[#3c3c3c] text-white"
                  : "bg-[#2d2d2d] border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab === "jsx"
                ? "Resume.jsx"
                : tab === "css"
                ? "Resume.css"
                : "Preview"}
            </div>
          ))}
        </div>

        {/* Login / Register */}
        <div className="space-x-2">
          <a href="/login">
            <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-xs">
              Login
            </button>
          </a>
          <a href="/register">
            <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-xs">
              Register
            </button>
          </a>
        </div>
      </div>

      {/* MOBILE: Toggled View */}
      <div className="md:hidden flex-1 overflow-hidden relative">
        <div className={activeTab === "jsx" ? "block h-full" : "hidden"}>
          <ResumeEditor code={code} setCode={setCode} />
        </div>
        <div className={activeTab === "css" ? "block h-full" : "hidden"}>
          <ResumeEditor code={cssCode} setCode={setCssCode} />
        </div>
        <div className={activeTab === "preview" ? "block h-full" : "hidden"}>
          <LivePreview code={code} css={cssCode} />
        </div>
      </div>

      {/* DESKTOP: Side-by-side */}
      <div className="hidden md:flex flex-1 border-t border-[#3c3c3c]">
        <div className="w-1/3 border-r border-[#3c3c3c]">
          <ResumeEditor code={code} setCode={setCode} />
        </div>
        <div className="w-1/3 border-r border-[#3c3c3c]">
          <ResumeEditor code={cssCode} setCode={setCssCode} />
        </div>
        <div className="w-1/3 bg-[#1e1e1e] flex justify-center items-center">
          <div className="w-[90%] aspect-[210/297] bg-white border shadow">
            <LivePreview code={code} css={cssCode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;

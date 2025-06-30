import React, { useState } from "react";
import ResumeEditor from "./components/ResumeEditor";
import LivePreview from "./components/LivePreview";

function App() {
  const [code, setCode] = useState(`ReactDOM.render(
  <div className="font-sans p-6 text-gray-900">
    <h1 className="text-4xl font-bold">Jane Doe</h1>
    <p className="text-lg">Full-Stack Developer</p>
    <section>
      <h2 className="text-2xl mt-4 mb-2 font-semibold">Experience</h2>
      <ul className="list-disc pl-5">
        <li>Company A - Frontend Developer (2020–2022)</li>
        <li>Company B - UI Engineer (2022–Present)</li>
      </ul>
    </section>
  </div>,
  document.getElementById('root')
);
`);

  const [showEditor, setShowEditor] = useState(true);

  return (
    <div className="flex flex-col h-screen">
      <div className="md:hidden p-2 flex justify-center gap-2 bg-gray-100 border-b">
        <button
          className={`px-4 py-2 rounded ${
            showEditor ? "bg-blue-600 text-white" : "bg-white border"
          }`}
          onClick={() => setShowEditor(true)}
        >
          Editor
        </button>
        <button
          className={`px-4 py-2 rounded ${
            !showEditor ? "bg-blue-600 text-white" : "bg-white border"
          }`}
          onClick={() => setShowEditor(false)}
        >
          Preview
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile view: stacked and toggled */}
        <div className="flex-1 md:hidden">
          {showEditor ? (
            <div className="h-full">
              <ResumeEditor code={code} setCode={setCode} />
            </div>
          ) : (
            <div className="h-full">
              <LivePreview code={code} />
            </div>
          )}
        </div>

        {/* Desktop view: side by side */}
        <div className="hidden md:flex flex-1">
          <div className="w-1/2 h-full border-r">
            <ResumeEditor code={code} setCode={setCode} />
          </div>
          <div className="w-1/2 h-full bg-gray-100 flex justify-center items-center">
            <div className="aspect-[210/297] w-[80%] border shadow bg-white">
              <LivePreview code={code} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

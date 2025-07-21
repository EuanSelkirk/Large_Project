// src/pages/EditorPage.tsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ResumeEditor from "../components/ResumeEditor";
import LivePreview from "../components/LivePreview";
import html2pdf from "html2pdf.js";
import { Save, Download } from "lucide-react";

const EditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const previewRef = useRef<HTMLIFrameElement>(null);

  const [html, setHtml] = useState(`function Resume() {
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

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      try {
        const { data } = await axios.get<{ html: string; css: string }>(
          `/api/resumes/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHtml(data.html);
        setCssCode(data.css);
      } catch (err) {
        const error = err as { response?: { status?: number } };
        if (error.response?.status === 404) navigate("/dashboard");
        console.error(err);
      }
    };
    load();
  }, [id, navigate]);

  const saveResume = async () => {
    if (!id) return;
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    try {
      await axios.put(
        `/api/resumes/${id}`,
        { html, css: cssCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Resume saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save. See console for details.");
    }
  };

  const downloadPdf = async () => {
    if (!previewRef.current) return;
    const doc =
      previewRef.current.contentDocument ||
      previewRef.current.contentWindow?.document;
    if (!doc) return;
    await html2pdf().from(doc.body).save("resume.pdf");
  };

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-white font-mono">
      {/* Top bar with Tabs + Save/Download icons */}
      <div className="flex justify-between items-center bg-[#2d2d2d] px-2 text-sm select-none">
        {/* Tabs */}
        <div className="flex space-x-1">
          {(["jsx", "css", "preview"] as const).map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 border-t border-l border-r rounded-t-sm cursor-pointer ${
                activeTab === tab
                  ? "bg-[#1e1e1e] border-[#3c3c3c] text-white"
                  : "bg-[#2d2d2d] border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab === "jsx" ? "JSX" : tab === "css" ? "CSS" : "Preview"}
            </div>
          ))}
        </div>

        {/* Save + Download Icons */}
        <div className="flex space-x-2">
          <button
            onClick={saveResume}
            aria-label="Save"
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            <Save className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={downloadPdf}
            aria-label="Download"
            className="p-2 bg-green-600 hover:bg-green-700 rounded"
          >
            <Download className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* MOBILE: toggled view */}
      <div className="md:hidden flex-1 overflow-hidden relative">
        <div className={activeTab === "jsx" ? "block h-full" : "hidden"}>
          <ResumeEditor code={html} setCode={setHtml} language="javascript" />
        </div>
        <div className={activeTab === "css" ? "block h-full" : "hidden"}>
          <ResumeEditor code={cssCode} setCode={setCssCode} language="css" />
        </div>
        <div className={activeTab === "preview" ? "block h-full" : "hidden"}>
          <LivePreview ref={previewRef} html={html} css={cssCode} />
        </div>
      </div>

      {/* DESKTOP: side-by-side */}
      <div className="hidden md:flex flex-1 border-t border-[#3c3c3c]">
        <div className="w-1/3 border-r border-[#3c3c3c]">
          <ResumeEditor code={html} setCode={setHtml} language="javascript" />
        </div>
        <div className="w-1/3 border-r border-[#3c3c3c]">
          <ResumeEditor code={cssCode} setCode={setCssCode} language="css" />
        </div>
        <div className="w-1/3 bg-[#1e1e1e] flex justify-center">
          <div className="w-[90%] aspect-[210/297] bg-[#1e1e1e] border shadow box-border">
            <LivePreview ref={previewRef} html={html} css={cssCode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;

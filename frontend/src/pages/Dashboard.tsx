import { useEffect, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash, Pencil } from "lucide-react";
import api from "../api/axios";

interface Resume {
  _id: string;
  name: string;
  html: string;
  css: string;
  createdAt: string;
}

const Dashboard = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await api.get<Resume[]>("/api/resumes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // sort newest first
        setResumes(
          res.data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchResumes();
  }, [navigate]);

  const addResume = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const name = "Untitled Resume";
    const defaultHtml = `function Resume() {
  return (
    <div className="resume">
      <h1>Jane Doe</h1>
      <p>Full-Stack Developer</p>
    </div>
  );
}

ReactDOM.render(<Resume />, document.getElementById("root"));`;
    const defaultCss = `.resume {
  font-family: 'Georgia', serif;
  padding: 2rem;
}
.resume h1 {
  font-size: 2rem;
}
`;
    try {
      const { data } = await api.post<Resume>(
        "/api/resumes",
        { name, html: defaultHtml, css: defaultCss },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResumes((prev) => [data, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (e: MouseEvent, resume: Resume) => {
    e.stopPropagation();
    setEditingId(resume._id);
    setEditingName(resume.name);
  };

  const saveName = async () => {
    if (!editingId) return;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const { data } = await api.put<Resume>(
        `/api/resumes/${editingId}`,
        { name: editingName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResumes((prev) => prev.map((r) => (r._id === data._id ? data : r)));
    } catch (err) {
      console.error(err);
    }
    setEditingId(null);
  };

  const deleteResume = async (e: MouseEvent, id: string) => {
    e.stopPropagation(); // ← prevent the card’s onClick
    if (!window.confirm("Delete this resume?")) return;
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    try {
      await api.delete(`/api/resumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white p-4 font-mono">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl">Your Resumes</h1>
        <button
          onClick={addResume}
          aria-label="Add Resume"
          className="p-2 rounded bg-indigo-500 hover:bg-indigo-600"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {resumes.length === 0 ? (
        <p className="text-gray-400">You haven’t created any resumes yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              onClick={() => navigate(`/editor/${resume._id}`)}
              className="cursor-pointer bg-[#2d2d2d] p-4 rounded-md border border-[#3c3c3c] hover:bg-[#3a3a3a] transition"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-1">
                  {editingId === resume._id ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onBlur={saveName}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          (e.target as HTMLInputElement).blur();
                        } else if (e.key === "Escape") {
                          setEditingId(null);
                        }
                      }}
                      className="bg-[#2d2d2d] border border-[#3c3c3c] rounded px-1 text-sm"
                      autoFocus
                    />
                  ) : (
                    <>
                      <span className="font-semibold">{resume.name}</span>
                      <button
                        onClick={(e) => startEditing(e, resume)}
                        aria-label="Edit Name"
                        className="p-1 rounded hover:bg-[#3a3a3a]"
                      >
                        <Pencil className="w-3 h-3 text-gray-400 hover:text-white" />
                      </button>
                    </>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(resume.createdAt).toLocaleDateString()}
                </span>
              </div>
              <pre className="text-xs h-24 overflow-hidden text-gray-300">
                {resume.html.slice(0, 100)}...
              </pre>
              <div className="mt-2 text-right">
                <button
                  onClick={(e) => deleteResume(e, resume._id)}
                  aria-label="Delete Resume"
                  className="p-2 rounded bg-red-500 hover:bg-red-600"
                >
                  <Trash className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

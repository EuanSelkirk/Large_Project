import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Resume {
  _id: string;
  name: string;
  html: string;
  css: string;
  createdAt: string;
}

const Dashboard = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get<Resume[]>("/api/resumes", {
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
    const name =
      window.prompt("Enter a name for this resume", "Untitled Resume") ||
      "Untitled Resume";
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
      const { data } = await axios.post<Resume>(
        "/api/resumes",
        { name, html: defaultHtml, css: defaultCss },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResumes((prev) => [data, ...prev]);
      navigate(`/editor/${data._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteResume = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // ← prevent the card’s onClick
    if (!window.confirm("Delete this resume?")) return;
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    try {
      await axios.delete(`/api/resumes/${id}`, {
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
          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
        >
          Add Resume
        </button>
      </div>

      {resumes.length === 0 ? (
        <p className="text-gray-400">You haven’t created any resumes yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              onClick={() => navigate(`/editor/${resume._id}`)}
              className="cursor-pointer bg-[#2d2d2d] p-4 rounded shadow hover:bg-[#3a3a3a] transition"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{resume.name}</span>
                <span className="text-xs text-gray-400">
                  {new Date(resume.createdAt).toLocaleDateString()}
                </span>
              </div>
              <pre className="text-xs h-24 overflow-hidden text-gray-300">
                {resume.html.slice(0, 100)}...
              </pre>
              <div className="mt-2">
                <button
                  onClick={(e) => deleteResume(e, resume._id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                >
                  Delete
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

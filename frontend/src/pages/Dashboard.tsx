import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

interface Resume {
  _id: string;
  code: string;
  createdAt: string;
}

interface JwtPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

const Dashboard = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join("")
      );

      console.log(jsonPayload);
      const { username } = JSON.parse(jsonPayload) as { username: string };
      setUsername(username);
    } catch (e) {
      console.error("Invalid token format", e);
    }
  }, []);

  const addResume = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const defaultCode = `function Resume() {
  return (
    <div className="resume">
      <h1>Jane Doe</h1>
      <p>Full-Stack Developer</p>
    </div>
  );
}

ReactDOM.render(<Resume />, document.getElementById("root"));`;
    try {
      const { data } = await axios.post<Resume>(
        "/api/resumes",
        { code: defaultCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResumes((prev) => [data, ...prev]);
      navigate(`/editor/${data._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteResume = async (id: string) => {
    if (!window.confirm("Delete this resume?")) return;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
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
    <div>
      {" "}
      {username ? <h2>Welcome, {username}!</h2> : <h2>Loading…</h2>}
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
                className="relative bg-[#2d2d2d] p-4 rounded shadow hover:bg-[#3a3a3a] transition"
              >
                {/* Whole card is a link */}
                <Link
                  to={`/editor/${resume._id}`}
                  className="absolute inset-0 z-10"
                />

                {/* Content */}
                <div className="relative z-20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">
                      Resume #{resume._id.slice(-6)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <pre className="text-xs h-24 overflow-hidden text-gray-300">
                    {resume.code.slice(0, 100)}...
                  </pre>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => deleteResume(resume._id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm z-20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

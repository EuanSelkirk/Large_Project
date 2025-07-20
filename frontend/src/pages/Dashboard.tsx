import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface Resume {
  _id: string;
  code: string;
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
        const res = await axios.get("/api/resumes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResumes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchResumes();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white p-4 font-mono">
      <h1 className="text-3xl mb-4">Your Resumes</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resumes.map((resume) => (
          <div key={resume._id} className="bg-[#2d2d2d] p-4 rounded shadow">
            <pre className="text-xs h-32 overflow-hidden">
              {resume.code?.slice(0, 100)}...
            </pre>
            <Link
              to={`/editor/${resume._id}`}
              className="mt-2 inline-block bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
            >
              Open
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
    };
    fetchResumes();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white p-4 font-mono">
      <h1 className="text-3xl mb-4">Your Resumes</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
    </div>
  );
};

export default Dashboard;

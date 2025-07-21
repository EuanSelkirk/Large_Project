import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();

  // Decode username from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join("")
      );
      const payload = JSON.parse(json) as { username: string };
      setUsername(payload.username);
    } catch {
      console.error("Failed to parse token");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1e1e1e] text-white font-mono">
      <div className="bg-[#2d2d2d] p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl mb-4">Profile</h1>
        <p className="mb-6">
          Username: <span className="font-semibold">{username}</span>
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;

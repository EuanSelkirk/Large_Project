import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Define the shape of your User object
interface User {
  _id: string;
  username: string;
  email: string;
  // add any other fields your API returns
}

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    console.log("here");

    try {
      // 3) DEBUG: fetch all users with correct typing
      const { data: users } = await axios.get<User[]>("/api/users");
      console.log("🛠️ [DEBUG] All users:", users);

      // 4) Continue on
      navigate("/editor");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error || "Unable to login. Check your credentials."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e]">
      <div className="bg-[#2d2d2d] p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">
              Username or Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded bg-[#1e1e1e] border border-gray-600 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-[#1e1e1e] border border-gray-600 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Login
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

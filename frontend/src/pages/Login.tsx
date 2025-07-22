import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

// Define the shape of your User object
interface LoginResponse {
  id?: string;
  username?: string;
  token?: string;
  error?: string;
}

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post<LoginResponse>("/api/auth/login", {
        login: email,
        password,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.id!);
        localStorage.setItem("username", data.username!);
        navigate("/dashboard");
      } else {
        setError(data.error || "Unable to login. Check your credentials.");
      }
    } catch (err: unknown) {
      console.error(err);
      let message: string | undefined;
      if (err && typeof err === "object" && "response" in err) {
        const e = err as { response?: { data?: { error?: string } } };
        message = e.response?.data?.error;
      }
      setError(message || "Unable to login. Check your credentials.");
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
              type="text"
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

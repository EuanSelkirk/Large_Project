import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";

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
    <div className="min-h-screen bg-[#1e1e1e] text-white flex items-center justify-center p-4 font-mono">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#2d2d2d] rounded-lg shadow-lg p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              placeholder="Username or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          {error && (
            <p className="text-red-400 text-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={!email || !password}
            className="w-full py-2 rounded-full text-white font-semibold bg-indigo-500 hover:bg-indigo-600 transition disabled:opacity-50"
          >
            Login
          </button>
        </form>

        <p className="text-gray-300 text-center mt-6">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="font-medium text-indigo-200 hover:text-white transition"
          >
            Register
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

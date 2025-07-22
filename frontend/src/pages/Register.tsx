import { useState, useMemo } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

interface RegisterResponse {
  token?: string;
  id?: string;
  username?: string;
  error?: string;
}

// includes ! @ # $ % ^ & * ( )
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // compute all checks once per render
  const {
    isLengthValid,
    hasLowercase,
    hasUppercase,
    hasDigit,
    hasSpecial,
    isPasswordValid,
  } = useMemo(() => {
    return {
      isLengthValid: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasDigit: /\d/.test(password),
      hasSpecial: /[!@#$%^&*()]/.test(password),
      isPasswordValid: passwordRegex.test(password),
    };
  }, [password]);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError(
        "Password must be ≥8 chars, include uppercase, lowercase, number, and one of !@#$%^&*()."
      );
      return;
    }

    try {
      const { data } = await api.post<RegisterResponse>("/api/auth/register", {
        username,
        email,
        password,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.id!);
        localStorage.setItem("username", data.username!);
        navigate("/editor");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      const msg = err.response?.data?.error;
      setError(msg || "Registration error. Please try again.");
    }
  };

  const canSubmit = !!username && !!email && isPasswordValid;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e]">
      <div className="bg-[#2d2d2d] p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Register
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-[#1e1e1e] border border-gray-600 text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Email</label>
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

            {/* live feedback */}
            <ul className="mt-2 text-sm space-y-1">
              <li className={isLengthValid ? "text-green-400" : "text-red-500"}>
                {isLengthValid ? "✓" : "✗"} At least 8 characters
              </li>
              <li className={hasLowercase ? "text-green-400" : "text-red-500"}>
                {hasLowercase ? "✓" : "✗"} One lowercase letter
              </li>
              <li className={hasUppercase ? "text-green-400" : "text-red-500"}>
                {hasUppercase ? "✓" : "✗"} One uppercase letter
              </li>
              <li className={hasDigit ? "text-green-400" : "text-red-500"}>
                {hasDigit ? "✓" : "✗"} One number
              </li>
              <li className={hasSpecial ? "text-green-400" : "text-red-500"}>
                {hasSpecial ? "✓" : "✗"} One special char {"!@#$%^&*()"}
              </li>
            </ul>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full py-2 rounded text-white transition ${
              canSubmit
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Register
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link className="text-blue-400 hover:underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

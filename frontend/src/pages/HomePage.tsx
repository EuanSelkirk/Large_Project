import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1e1e1e] text-white font-mono">
      <h1 className="text-4xl mb-4">Resume Builder</h1>
      <p className="text-gray-400 mb-8">
        Create and manage your resumes with a VSCode inspired editor.
      </p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

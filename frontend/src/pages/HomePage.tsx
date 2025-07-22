import { Link } from "react-router-dom";

/** VS Code–style landing */
const HomePage = () => {
  return (
    <main className="min-h-screen bg-[#1e1e1e] flex items-center justify-center px-4">
      {/* center card */}
      <section className="w-full max-w-md bg-[#252526]/90 backdrop-blur-sm rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.6)] p-10 text-white font-mono">
        {/* VS Code accent bar */}
        <div className="h-1 w-16 bg-[#007ACC] rounded-full mb-6" />
        <h1 className="text-4xl font-semibold tracking-tight mb-2">
          Re:Resume
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          Create and manage your resumes with a VS Code-inspired editor.
        </p>

        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          {/* Login */}
          <Link
            to="/login"
            className="flex-1 text-center bg-[#007ACC] hover:bg-[#3b8cf8] active:bg-[#0060b7] transition-colors duration-150 font-semibold py-2 rounded-md ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1e1e1e] focus:ring-[#3b8cf8]"
          >
            Login
          </Link>

          {/* Register */}
          <Link
            to="/register"
            className="flex-1 text-center bg-[#00874F] hover:bg-[#10B981] active:bg-[#0e9f6e] transition-colors duration-150 font-semibold py-2 rounded-md ring-1 ring-inset ring-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1e1e1e] focus:ring-[#34D399]"
          >
            Register
          </Link>
        </div>
      </section>
    </main>
  );
};

export default HomePage;

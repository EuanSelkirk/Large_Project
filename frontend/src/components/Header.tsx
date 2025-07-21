import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-[#2d2d2d] text-white px-4 py-2 flex justify-between items-center">
      <div className="font-bold">Resume Builder</div>
      <nav className="space-x-4">
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/profile" className="hover:underline">
          Profile
        </Link>
      </nav>
    </header>
  );
};

export default Header;

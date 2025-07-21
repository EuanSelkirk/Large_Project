import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#1e1e1e] text-white font-mono">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

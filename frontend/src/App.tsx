import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import Login from './pages/Login';
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EditorPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Future routes like login/register/dashboard can go here */}
      </Routes>
    </Router>
  );
}

export default App;

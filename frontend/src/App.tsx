import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditorPage from "./pages/EditorPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EditorPage />} />
        {/* Future routes like login/register/dashboard can go here */}
      </Routes>
    </Router>
  );
}

export default App;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import api from "./api/axios";
import "./index.css";
import App from "./App.tsx";

// 2) (Optional) log the full URL
api.interceptors.request.use((config) => {
  console.log(
    `[AXIOS] ${config.method?.toUpperCase()} →`,
    `${config.baseURL}${config.url}`
  );
  return config;
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

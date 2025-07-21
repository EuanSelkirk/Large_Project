import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./index.css";
import App from "./App.tsx";

// 1) Point Axios at your real backend:
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// 2) (Optional) log the full URL
axios.interceptors.request.use((config) => {
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

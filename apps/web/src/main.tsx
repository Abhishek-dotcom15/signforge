import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initMonitoring } from "./lib/monitoring";
import App from "./app/App";
import "./styles/globals.css";

initMonitoring();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

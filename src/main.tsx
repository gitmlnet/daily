import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { registerSW } from "./registerSW";
import App from "./App";

registerSW();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

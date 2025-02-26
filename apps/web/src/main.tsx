import App from "./app.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);

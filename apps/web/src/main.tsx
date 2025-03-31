import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/main.css";
import App from "./app.tsx";
import Providers from "./components/providers.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Providers>
            <App />
        </Providers>
    </StrictMode>
);

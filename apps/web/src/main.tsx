import posthog from "posthog-js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/main.css";
import App from "./app.tsx";
import Providers from "./components/providers.tsx";

posthog.init(import.meta.env.VITE_POSTHOG_KEY, { api_host: import.meta.env.VITE_POSTHOG_HOST });

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Providers>
            <App />
        </Providers>
    </StrictMode>
);

import React from "react";
import { PostHogProvider } from "posthog-js/react";

const options = {
    api_host: import.meta.env.VITE_POSTHOG_HOST
};

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PostHogProvider apiKey={import.meta.env.VITE_POSTHOG_KEY} options={options}>
            {children}
        </PostHogProvider>
    );
}

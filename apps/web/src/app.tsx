import Index from "./components/pages";
import { Analytics } from "@vercel/analytics/react"
import NotFound from "./components/pages/not-found";
import { BrowserRouter, Route, Routes } from "react-router";

function App() {
    return (
        <BrowserRouter>
            <Analytics /> 
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

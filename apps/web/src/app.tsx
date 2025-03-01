import { BrowserRouter, Route, Routes } from "react-router";
import Index from "./components/pages";
import NotFound from "./components/pages/not-found";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

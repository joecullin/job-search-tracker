import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/main.css";
import Applications from "./Applications.tsx";
import Analysis from "./Analysis.tsx";
import Home from "./Home.tsx";
import NotFound from "./NotFound.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter basename="/job-search-tracker">
        <Routes>
            <Route index element={<Home />} />
            <Route path="applications" element={<Applications />} />
            <Route path="analysis" element={<Analysis />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>,
);

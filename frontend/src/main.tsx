import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import Applications from "./Applications.tsx";
import Home from "./Home.tsx";
import NotFound from "./NotFound.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <Routes>
            <Route index element={<Home />} />
            <Route path="applications" element={<Applications />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>,
);

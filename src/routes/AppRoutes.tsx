import { Route, Routes } from "react-router-dom";

import { Game } from "../pages/Game";
import { Home } from "../pages/Home";
import { Login } from "../features/auth/pages/Login";
import { Register } from "../features/auth/pages/Register";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/game" element={<Game />} />
        </Routes>
    )
}
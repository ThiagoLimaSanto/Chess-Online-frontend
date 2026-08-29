import { Route, Routes } from "react-router-dom";

import { Login } from "../features/auth/pages/Login";
import { Register } from "../features/auth/pages/Register";
import { Game } from "../features/Game/Pages/Game";
import { Home } from "../features/Lobby/Pages/Home/Home";
import { PublicRoute } from "./PublicRoute";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/game" element={<Game />} />
                <Route path="/game/:gameId" element={<Game />} />
            </Route>

            <Route element={<ProtectedRoute role="ADMIN" />}>
                <Route path="/admin" element={<h2>Admin</h2>} />
            </Route>
        </Routes>
    )
}

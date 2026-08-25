import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../features/auth/contexts/auth/useAuth"

export function PublicRoute() {
    const { isAuthenticated } = useAuth()

    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../features/auth/contexts/auth/useAuth"

export function PublicRoute() {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) return null

    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

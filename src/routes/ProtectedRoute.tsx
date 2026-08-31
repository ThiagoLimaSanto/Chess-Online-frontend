import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useAuth } from "../features/auth/contexts/auth/useAuth"

type ProtectedRouteProps = {
    role?: "ADMIN" | "USER"
}

export function ProtectedRoute({ role }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth()
    const navigate = useNavigate()
    const isUnauthorized = Boolean(user && role && user.role !== role)

    useEffect(() => {
        if (isUnauthorized) navigate(-1)
    }, [isUnauthorized, navigate])

    if (isLoading) return null
    if (!user) return <Navigate to="/login" replace />
    if (isUnauthorized) return null

    return <Outlet />
}

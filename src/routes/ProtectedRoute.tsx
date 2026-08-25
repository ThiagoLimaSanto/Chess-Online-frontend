import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react"

type ProtectedRouteProps = {
    role?: "ADMIN" | "USER"
}

export function ProtectedRoute({ role }: ProtectedRouteProps) {
    const token = localStorage.getItem("chess-auth-token")
    const navigate = useNavigate()
    let isUnauthorized = false

    if (token && role) {
        const payload = JSON.parse(atob(token.split(".")[1]))
        isUnauthorized = payload.role !== role
    }

    useEffect(() => {
        if (isUnauthorized) navigate(-1)
    }, [isUnauthorized, navigate])

    if (!token) return <Navigate to="/login" />
    if (isUnauthorized) return null

    return <Outlet />
}
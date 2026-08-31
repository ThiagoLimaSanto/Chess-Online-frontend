import { useEffect, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import {
    clearAuthToken,
    refreshAccessToken,
    SESSION_EXPIRED_EVENT,
    setAuthToken,
} from "../../../../packages/auth/axios"
import { useGetMe } from "../../../../packages/hooks/auth/useGetMe"
import { useHeartbeat } from "../../../../packages/hooks/auth/useHeartbeat"
import { useLogin } from "../../../../packages/hooks/auth/useLogin"
import { useLogout } from "../../../../packages/hooks/auth/useLogout"
import { useRegister } from "../../../../packages/hooks/auth/useRegister"
import { mensagemAdapter } from "../../../../packages/mensagem/mensagemAdapter"
import { AuthContext, type AuthUser } from "./AuthContext"

export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate()
    const [user, setUser] = useState<AuthUser | null>(null)
    const [isBootstrapping, setIsBootstrapping] = useState(true)
    const loginMutation = useLogin()
    const getMeMutation = useGetMe()
    const { mutateAsync: getMe } = getMeMutation
    const registerMutation = useRegister()
    const logoutMutation = useLogout()

    useHeartbeat(user?.id)

    useEffect(() => {
        let active = true

        refreshAccessToken()
            .then(() => getMe())
            .then((authenticatedUser) => {
                if (active) setUser(authenticatedUser)
            })
            .catch(() => {
                clearAuthToken()
                if (active) setUser(null)
            })
            .finally(() => {
                localStorage.removeItem("chess-auth-user")
                if (active) setIsBootstrapping(false)
            })

        return () => { active = false }
    }, [getMe])

    useEffect(() => {
        const handleExpiredSession = () => {
            setUser(null)
            navigate("/login", { replace: true })
        }
        window.addEventListener(SESSION_EXPIRED_EVENT, handleExpiredSession)
        return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpiredSession)
    }, [navigate])

    async function login(username: string, password: string) {
        mensagemAdapter.dismiss()
        const response = await loginMutation.mutateAsync({ username, password })
        setAuthToken(response.accessToken)
        const authenticatedUser = await getMe()
        setUser(authenticatedUser)
        return authenticatedUser
    }

    async function register(username: string, password: string) {
        await registerMutation.mutateAsync({ username, password })
        navigate("/login")
    }

    async function logout() {
        try {
            await logoutMutation.mutateAsync()
        } finally {
            clearAuthToken()
            setUser(null)
            mensagemAdapter.success("Você saiu!")
            navigate("/login")
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                isLoading: isBootstrapping || loginMutation.isPending || getMeMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

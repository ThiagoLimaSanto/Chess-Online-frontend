import { useEffect, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext, type AuthUser } from "./AuthContext"
import { useLogin } from "../../../../packages/auth/hooks/auth/useLogin"
import { useGetMe } from "../../../../packages/auth/hooks/auth/useGetMe"
import { useRegister } from "../../../../packages/auth/hooks/auth/useRegister"
import { useLogout } from "../../../../packages/auth/hooks/auth/useLogout"
import { clearAuthToken } from "../../../../packages/auth/axios"
import { mensagemAdapter } from "../../../../packages/mensagem/mensagemAdapter"

const AUTH_USER_KEY = "chess-auth-user"

export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate()
    const [user, setUser] = useState<AuthUser | null>(() => {
        const storedUser = localStorage.getItem(AUTH_USER_KEY)
        return storedUser ? JSON.parse(storedUser) as AuthUser : null
    })
    const loginMutation = useLogin()
    const getMeMutation = useGetMe()
    const { mutateAsync: getMe } = getMeMutation
    const registerMutation = useRegister()
    const logoutMutation = useLogout()

    useEffect(() => {
        if (!localStorage.getItem("chess-auth-token")) return

        getMe()
            .then(setUser)
            .catch(() => {
                clearAuthToken()
                setUser(null)
            })
    }, [getMe])

    useEffect(() => {
        if (user) {
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
        } else {
            localStorage.removeItem(AUTH_USER_KEY)
        }
    }, [user])

    async function login(username: string, password: string) {
        await loginMutation.mutateAsync({ username, password })
        const authenticatedUser = await getMe()
        setUser(authenticatedUser)
        return authenticatedUser
    }

    async function register(username: string, password: string) {
        await registerMutation.mutateAsync({ username, password })
        navigate("/login")
    }

    async function logout() {
        await logoutMutation.mutateAsync()
        clearAuthToken()
        setUser(null)
        mensagemAdapter.success("Voçê saiu!")
        navigate("/login")
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                isLoading: loginMutation.isPending || getMeMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
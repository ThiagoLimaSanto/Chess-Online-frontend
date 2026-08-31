import { createContext } from "react"

export type AuthUser = {
    id: string
    username: string
    role: "ADMIN" | "USER"
}

export type AuthContextValue = {
    user: AuthUser | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (username: string, password: string) => Promise<AuthUser>
    register: (username: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

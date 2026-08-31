import axios, { type InternalAxiosRequestConfig } from "axios"

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api"
const LEGACY_TOKEN_KEY = "chess-auth-token"
export const SESSION_EXPIRED_EVENT = "chess:session-expired"

let accessToken: string | null = null
let refreshRequest: Promise<string> | null = null

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
})

const refreshClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
    return config
})

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean }

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const request = error.config as RetryableRequest | undefined
        const doesNotUseRefresh = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"]
            .some((path) => request?.url?.startsWith(path))

        if (error.response?.status === 401 && request && !request._retry && !doesNotUseRefresh) {
            request._retry = true
            try {
                const token = await refreshAccessToken()
                request.headers.Authorization = `Bearer ${token}`
                return api(request)
            } catch {
                clearAuthToken()
                window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
            }
        }

        return Promise.reject(error)
    },
)

export async function refreshAccessToken() {
    if (!refreshRequest) {
        refreshRequest = refreshClient
            .post<{ accessToken: string }>("/auth/refresh")
            .then(({ data }) => {
                setAuthToken(data.accessToken)
                return data.accessToken
            })
            .finally(() => {
                refreshRequest = null
            })
    }
    return refreshRequest
}

export function setAuthToken(token: string) {
    accessToken = token
    localStorage.removeItem(LEGACY_TOKEN_KEY)
}

export function clearAuthToken() {
    accessToken = null
    localStorage.removeItem(LEGACY_TOKEN_KEY)
}

export function getAuthToken() {
    return accessToken
}

export async function getValidAuthToken() {
    if (accessToken && !isExpiringSoon(accessToken)) return accessToken
    return refreshAccessToken()
}

function isExpiringSoon(token: string) {
    try {
        const encodedPayload = token.split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/")
        const payload = JSON.parse(atob(encodedPayload)) as { exp?: number }
        return !payload.exp || payload.exp * 1000 - Date.now() <= 30_000
    } catch {
        return true
    }
}

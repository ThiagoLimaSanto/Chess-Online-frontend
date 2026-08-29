import axios from "axios"

const TOKEN_KEY = "chess-auth-token"

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL ?? "/api",
	headers: {
		"Content-Type": "application/json",
	},
})

api.interceptors.request.use((config) => {
	const token = localStorage.getItem(TOKEN_KEY)

	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem(TOKEN_KEY)
		}

		return Promise.reject(error)
	},
)

export function setAuthToken(token: string) {
	localStorage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken() {
	localStorage.removeItem(TOKEN_KEY)
}

export function getAuthToken() {
	return localStorage.getItem(TOKEN_KEY)
}

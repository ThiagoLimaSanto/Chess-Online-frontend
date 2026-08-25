import { useMutation } from "@tanstack/react-query"
import { api, setAuthToken } from "../../axios"

export type LoginPayload = {
    username: string
    password: string
}

export type LoginResponse = {
    token: string
}

async function loginRequest(payload: LoginPayload) {
    const response = await api.post<LoginResponse>("/auth/login", payload)
    setAuthToken(response.data.token)
    return response.data
}

export function useLogin() {
    return useMutation({
        mutationFn: loginRequest,
    })
}

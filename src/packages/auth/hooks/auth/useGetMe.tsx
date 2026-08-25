import { useMutation } from "@tanstack/react-query"
import { api } from "../../axios"
import type { AuthUser } from "../../../../contexts/auth/AuthContext"

async function getMeRequest() {
    const response = await api.get<AuthUser>("/auth/me")
    return response.data
}

export function useGetMe() {
    return useMutation({
        mutationFn: getMeRequest,
    })
}

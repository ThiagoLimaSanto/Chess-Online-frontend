import { useMutation } from "@tanstack/react-query"
import { api } from "../../auth/axios"

export type RegisterPayload = {
    username: string
    password: string
}


async function registerRequest(payload: RegisterPayload) {
    await api.post<void>("/auth/register", payload)
}

export function useRegister() {
    return useMutation({
        mutationFn: registerRequest,
    })
}

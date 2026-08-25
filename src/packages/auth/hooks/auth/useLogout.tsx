import { useMutation } from "@tanstack/react-query"
import { api } from "../../axios"


async function logoutRequest() {
    await api.post<void>("/auth/logout")
}

export function useLogout() {
    return useMutation({
        mutationFn: logoutRequest,
    })
}

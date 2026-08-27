import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../auth/axios"


async function logoutRequest() {
    await api.post("/auth/logout")
}

export function useLogout() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: logoutRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["player", "me"],
            })
        },
    })
}
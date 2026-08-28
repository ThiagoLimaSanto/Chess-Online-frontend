import { useMutation } from "@tanstack/react-query"
import { api } from "../../auth/axios"

async function joinMatchmaking(userId: string) {
    await api.post(`/matchmaking/${userId}/join-queue`)
}

export function useJoinMatchmaking() {
    return useMutation({
        mutationFn: joinMatchmaking,
    })
}

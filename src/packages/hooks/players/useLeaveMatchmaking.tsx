import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../auth/axios"

async function leaveMatchmaking(userId: string) {
    await api.delete(`/matchmaking/${userId}/leave-queue`)
}

export function useLeaveMatchmaking() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: leaveMatchmaking,
        onMutate: (userId) => queryClient.cancelQueries({ queryKey: ["matchmaking-queue", userId] }),
        onSuccess: (_data, userId) => {
            queryClient.setQueryData(["matchmaking-queue", userId], false)
            // Uma partida pode ter sido criada enquanto o cancelamento estava em andamento.
            void queryClient.invalidateQueries({ queryKey: ["current-match"] })
        },
        onSettled: (_data, _error, userId) => {
            void queryClient.invalidateQueries({ queryKey: ["matchmaking-queue", userId] })
        },
    })
}

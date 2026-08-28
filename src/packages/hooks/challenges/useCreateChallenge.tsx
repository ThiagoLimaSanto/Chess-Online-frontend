import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../auth/axios"

interface ChallengeRequest {
    challengedUsername: string
    initialTimeSeconds: number
    incrementSeconds: number
}

async function createChallengeRequest(payload: ChallengeRequest) {
    await api.post(`/challenges/create`, payload)
}

export function useCreateChallenge() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createChallengeRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["challenges", "sent"],
            })

            queryClient.invalidateQueries({
                queryKey: ["challenges", "received"],
            })
        },
    })
}
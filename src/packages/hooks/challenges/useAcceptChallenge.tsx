import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../auth/axios";

async function acceptChallengeRequest(challengeId: string) {
    await api.post(`/challenges/${challengeId}/accept`)
}

export function useAcceptChallenge() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: acceptChallengeRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["challenges", "received", "pending"],
            })

            queryClient.invalidateQueries({
                queryKey: ["challenges", "sent"],
            })
        },
    })
}
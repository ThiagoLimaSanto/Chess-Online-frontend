import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../auth/axios";

async function rejectChallengeRequest(challengeId: string) {
    await api.post(`/challenges/${challengeId}/reject`)
}

export function useRejectChallenge() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: rejectChallengeRequest,
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
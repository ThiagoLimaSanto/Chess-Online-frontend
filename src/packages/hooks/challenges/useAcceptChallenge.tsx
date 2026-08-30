import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../auth/axios";
import type { MatchmakingGame } from "../players/useJoinMatchmaking";

async function acceptChallengeRequest(challengeId: string) {
    const { data } = await api.post<MatchmakingGame>(`/challenges/${challengeId}/accept`)
    return data
}

export function useAcceptChallenge() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: acceptChallengeRequest,
        onSuccess: (game) => {
            queryClient.setQueryData(["current-match"], game)
            queryClient.invalidateQueries({
                queryKey: ["challenges", "received", "pending"],
            })

            queryClient.invalidateQueries({
                queryKey: ["challenges", "sent"],
            })
        },
    })
}

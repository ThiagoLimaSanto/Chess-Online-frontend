import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "../../auth/axios"
import { invalidateFriendshipQueries } from "./invalidateFriendshipQueries"

async function sendFriendshipRequest(receiverId: string) {
    const response = await api.post(
        `/friendships/send-request/${receiverId}`
    )

    return response.data
}

export function useSendFriendship() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: sendFriendshipRequest,

        onSuccess: () => invalidateFriendshipQueries(queryClient),
    })
}

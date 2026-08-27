import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../auth/axios"

async function acceptRequest(requesterId: string) {
    const response = await api.post(
        `/friendships/${requesterId}/accept`
    )

    return response.data
}

export function useAcceptRequest() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: acceptRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["friendships-requests"],
            })
        },
    })
}
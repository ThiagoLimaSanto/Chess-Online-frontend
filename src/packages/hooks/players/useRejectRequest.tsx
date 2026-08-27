import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../auth/axios"

async function rejectRequest(requesterId: string) {
    const response = await api.post(
        `/friendships/${requesterId}/reject`
    )

    return response.data
}

export function useRejectRequest() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: rejectRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["friendships", "friendships-requests"],
            })
        },
    })
}
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../auth/axios"
import { invalidateFriendshipQueries } from "./invalidateFriendshipQueries"
import type { FriendshipResponse, PageResponse } from "../types/response/PageResponse"

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
        onMutate: async (requesterId) => {
            await queryClient.cancelQueries({ queryKey: ["friendships-requests"] })

            const previousRequests = queryClient.getQueriesData<PageResponse<FriendshipResponse>>({
                queryKey: ["friendships-requests"],
            })

            queryClient.setQueriesData<PageResponse<FriendshipResponse>>(
                { queryKey: ["friendships-requests"] },
                (current) => current && {
                    ...current,
                    content: current.content.filter((request) => request.id !== requesterId),
                    totalElements: Math.max(0, current.totalElements - 1),
                },
            )

            return { previousRequests }
        },
        onError: (_error, _requesterId, context) => {
            context?.previousRequests.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data)
            })
        },
        onSettled: () => invalidateFriendshipQueries(queryClient),
    })
}

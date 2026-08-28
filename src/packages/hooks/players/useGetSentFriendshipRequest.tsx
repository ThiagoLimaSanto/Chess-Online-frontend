import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../../../features/auth/contexts/auth/useAuth"
import { api } from "../../auth/axios"
import type { SearchPlayersRequest } from "../types/params/Params"
import type { FriendshipResponse, PageResponse } from "../types/response/PageResponse"

async function getSentFriendshipRequests({ username, page = 0, size = 5 }: SearchPlayersRequest) {
    const response = await api.get<PageResponse<FriendshipResponse>>("/friendships/sent-requests", {
        params: { username, page, size },
    })

    return response.data
}

export function useGetSentFriendshipRequest({
    username,
    page = 0,
    size = 5,
}: SearchPlayersRequest) {
    const { user } = useAuth()

    return useQuery({
        queryKey: ["friendships-sent-requests", user?.id, username, page, size],
        queryFn: () => getSentFriendshipRequests({ username, page, size }),
        enabled: !!user?.id,
    })
}

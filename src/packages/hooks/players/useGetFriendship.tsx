import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../../../features/auth/contexts/auth/useAuth"
import { api } from "../../auth/axios"
import type { SearchPlayersRequest } from "../types/params/Params"
import type { FriendshipResponse, PageResponse } from "../types/response/PageResponse"

async function getFriendshipRequest({ username, page = 0, size = 5 }: SearchPlayersRequest) {
    const response = await api.get<PageResponse<FriendshipResponse>>("/friendships", {
        params: {
            username,
            page,
            size
        }
    })
    return response.data
}

export function useGetFriendship({ username, page = 0, size = 5 }: SearchPlayersRequest) {
    const { user } = useAuth()

    return useQuery({
        queryKey: ["friendships", user?.id, username, page, size],
        queryFn: async () => {
            return await getFriendshipRequest({ username, page, size })
        },
        enabled: !!user?.id,
    })
}

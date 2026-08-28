import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../../../features/auth/contexts/auth/useAuth"
import { api } from "../../auth/axios"
import type { SearchPlayersRequest } from "../types/params/Params"
import type { PageResponse, UserResponse } from "../types/response/PageResponse"

async function getPlayersRequest({ username, page = 0, size = 5 }: SearchPlayersRequest) {
    const response = await api.get<PageResponse<UserResponse>>("/users/players",
        {
            params: {
                username,
                page,
                size
            }
        }
    )
    return response.data
}

export function useGetPlayers({ username, page = 0, size = 5 }: SearchPlayersRequest) {
    const { user } = useAuth()
    const normalizedUsername = username?.trim() ?? ""

    return useQuery({
        queryKey: ["players", user?.id, normalizedUsername, page, size],
        queryFn: async () => {
            return await getPlayersRequest({ username: normalizedUsername, page, size })
        },
        enabled: !!user?.id,
        staleTime: 0,
    })
}

import { useQuery } from "@tanstack/react-query"
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
    return useQuery({
        queryKey: ["players", username, page, size],
        queryFn: async () => {
            return await getPlayersRequest({ username, page, size })
        },
    })
}
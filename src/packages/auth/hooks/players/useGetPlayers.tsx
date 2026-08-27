import { useQuery } from "@tanstack/react-query"
import { api } from "../../axios"
import type { UserResponse } from "../auth/useGetMe"

interface PageResponse<T> {
    content: T[]
    totalElements: number
    totalPages: number
    size: number
    number: number
}

interface SearchPlayersRequest {
    username?: string
    page: number
    size: number
}

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
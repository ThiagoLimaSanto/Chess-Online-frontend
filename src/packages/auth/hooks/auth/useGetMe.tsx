import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../axios"

export interface UserResponse {
    username: string,
    id: string,
    createdAt: string,
}

async function getMeRequest() {
    const response = await api.get<UserResponse>("/auth/me")
    return response.data
}

export function useGetMe() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: getMeRequest,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["me"],
            })
        },
    })
}
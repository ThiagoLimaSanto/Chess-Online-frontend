import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../auth/axios"
import type { UserResponse } from "../types/response/PageResponse"

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
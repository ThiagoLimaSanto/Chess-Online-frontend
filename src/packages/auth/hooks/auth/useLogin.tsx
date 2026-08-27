import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query"

import { api } from "../../axios"

export type LoginPayload = {
    username: string
    password: string
}

export type LoginResponse = {
    token: string
}

async function loginRequest(payload: LoginPayload) {
    const response = await api.post<LoginResponse>(
        "/auth/login",
        payload
    )
    return response.data
}

export function useLogin() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: loginRequest,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["player"],
            })
        },
    })
}
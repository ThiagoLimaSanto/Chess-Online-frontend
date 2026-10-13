import type { QueryClient } from "@tanstack/react-query"

export function invalidateFriendshipQueries(queryClient: QueryClient, playerId?: string) {
    return Promise.all([
        "friendships",
        "friendships-requests",
        "friendships-sent-requests",
        "players",
    ].map((key) => queryClient.invalidateQueries({
        queryKey: playerId ? [key, playerId] : [key],
    })))
}

export interface PageResponse<T> {
    content: T[]
    totalElements: number
    totalPages: number
    size: number
    number: number
}

export interface FriendshipResponse {
    id: string
    username: string
    createdAt: string
}

export interface UserResponse {
    username: string,
    id: string,
    createdAt: string,
}

export interface ChallengeResponse {
    id: string
    challengerUsername: string
    challengedUsername: string
    status: "PENDING" | "ACCEPTED" | "REJECTED"
    initialTimeSeconds: number
    incrementSeconds: number
    createdAt: string
}
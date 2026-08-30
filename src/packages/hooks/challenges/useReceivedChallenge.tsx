import { useQuery } from "@tanstack/react-query"
import { api } from "../../auth/axios"

type ChallengeStatusType = "PENDING" | "ACCEPTED" | "REJECTED"

interface ChallengeStatus {
    status: ChallengeStatusType
}

async function getReceivedChallengeRequest({ status }: ChallengeStatus) {
    const response = await api.get("/challenges/received", {
        params: {
            status,
        },
    })
    return response.data
}

export function useReceivedChallenge() {
    return useQuery({
        queryKey: ["challenges", "received", "pending"],
        queryFn: async () => {
            return await getReceivedChallengeRequest({ status: "PENDING" })
        },
        refetchInterval: 2_000,
    })
}

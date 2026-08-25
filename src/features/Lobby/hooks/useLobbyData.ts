export type QuickGame = {
    opponent: string
    rating: string
    result: string
    tone: "win" | "loss" | "draw"
    avatar: string
}

export type Friend = {
    name: string
    status: string
    avatar: string
    active: boolean
}

export type Activity = {
    label: string
    icon: string
    time: string
}

export function useLobbyData() {
    return {
        games: [
            { opponent: "Carlos", rating: "1498", result: "1 - 0", tone: "win", avatar: "C" },
            { opponent: "Ana", rating: "1530", result: "0 - 1", tone: "loss", avatar: "A" },
            { opponent: "Pedro", rating: "1450", result: "½ - ½", tone: "draw", avatar: "P" },
        ] satisfies QuickGame[],
        friends: [
            { name: "Carlos", status: "Jogando uma partida", avatar: "C", active: true },
            { name: "Ana", status: "Online", avatar: "A", active: true },
            { name: "Pedro", status: "Online", avatar: "P", active: false },
        ] satisfies Friend[],
        activities: [
            { label: "Carlos iniciou uma partida", icon: "⚔", time: "5 minutos" },
            { label: "Ana ficou online", icon: "♟", time: "12 minutos" },
            { label: "Você venceu Pedro", icon: "☞", time: "ontem" },
            { label: "Você recebeu um desafio", icon: "✉", time: "ontem" },
        ] satisfies Activity[],
    }
}

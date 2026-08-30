export type GameMode = "BULLET" | "BLITZ" | "RAPID" | "CLASSICAL"

export const GAME_MODES: Array<{
    value: GameMode
    label: string
    timeLabel: string
    initialTimeSeconds: number
    incrementSeconds: number
}> = [
    { value: "BULLET", label: "Bullet", timeLabel: "1 + 0", initialTimeSeconds: 60, incrementSeconds: 0 },
    { value: "BLITZ", label: "Blitz", timeLabel: "3 + 2", initialTimeSeconds: 180, incrementSeconds: 2 },
    { value: "RAPID", label: "Rápido", timeLabel: "10 + 0", initialTimeSeconds: 600, incrementSeconds: 0 },
    { value: "CLASSICAL", label: "Clássico", timeLabel: "30 + 0", initialTimeSeconds: 1800, incrementSeconds: 0 },
]

export function getGameMode(mode: GameMode) {
    return GAME_MODES.find((option) => option.value === mode) ?? GAME_MODES[2]
}

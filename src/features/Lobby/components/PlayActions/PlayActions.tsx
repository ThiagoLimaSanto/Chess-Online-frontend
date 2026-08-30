import styles from "./PlayActions.module.css"
import { Buttons } from "../Buttons/Buttons"
import { GAME_MODES, type GameMode } from "../../../../packages/constants/gameModes"

type PlayActionsProps = {
    onPlay: () => void | Promise<void>
    isSearching?: boolean
    hasCurrentMatch?: boolean
    selectedGameMode: GameMode
    onGameModeChange: (mode: GameMode) => void
}

export function PlayActions({
    onPlay,
    isSearching = false,
    hasCurrentMatch = false,
    selectedGameMode,
    onGameModeChange,
}: PlayActionsProps) {
    return <section className={styles.playCard}>
        <div className={styles.icon}>◷</div>
        <h2>Jogar</h2>
        <p>{hasCurrentMatch ? <>Você tem uma partida<br />em andamento.</> : <>Escolha um ritmo e encontre<br />um oponente.</>}</p>
        <div className={styles.gameModes} aria-label="Modo de jogo">
            {GAME_MODES.map((mode) => (
                <button
                    key={mode.value}
                    type="button"
                    className={selectedGameMode === mode.value ? styles.activeMode : ""}
                    aria-label={`${mode.label} ${mode.timeLabel}`}
                    aria-pressed={selectedGameMode === mode.value}
                    disabled={isSearching || hasCurrentMatch}
                    onClick={() => onGameModeChange(mode.value)}
                >
                    <strong>{mode.label}</strong>
                    <small>{mode.timeLabel}</small>
                </button>
            ))}
        </div>
        <Buttons onPlay={onPlay} isSearching={isSearching} hasCurrentMatch={hasCurrentMatch} />
    </section>
}

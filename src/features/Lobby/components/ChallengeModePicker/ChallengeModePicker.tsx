import { GAME_MODES, type GameMode } from "../../../../packages/constants/gameModes"

import styles from "./ChallengeModePicker.module.css"

type ChallengeModePickerProps = {
    id?: string
    friendUsername: string
    disabled?: boolean
    onSelect: (mode: GameMode) => void
    onCancel: () => void
}

export function ChallengeModePicker({
    id,
    friendUsername,
    disabled = false,
    onSelect,
    onCancel,
}: ChallengeModePickerProps) {
    return (
        <section id={id} className={styles.picker} aria-label={`Escolher modo para desafiar ${friendUsername}`}>
            <div className={styles.header}>
                <span>Escolha o modo</span>
                <button type="button" onClick={onCancel} aria-label="Cancelar desafio">×</button>
            </div>

            <div className={styles.modes}>
                {GAME_MODES.map((mode) => (
                    <button
                        key={mode.value}
                        type="button"
                        disabled={disabled}
                        aria-label={`${mode.label} ${mode.timeLabel}`}
                        onClick={() => onSelect(mode.value)}
                    >
                        <strong>{mode.label}</strong>
                        <small>{mode.timeLabel}</small>
                    </button>
                ))}
            </div>
        </section>
    )
}

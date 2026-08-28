import styles from "./Buttons.module.css"

type ButtonsProps = {
    onPlay: () => void | Promise<void>
    isLoading?: boolean
}

export function Buttons({ onPlay, isLoading = false }: ButtonsProps) {
    return (
        <div className={styles.actions}>
            <button className={styles.primary} onClick={() => void onPlay()} disabled={isLoading}>
                {isLoading ? "Entrando na fila..." : "Jogar Agora"}
            </button>
        </div>
    )
}

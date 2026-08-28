import styles from "./Buttons.module.css"

type ButtonsProps = {
    onPlay: () => void
}

export function Buttons({ onPlay }: ButtonsProps) {
    return (
        <div className={styles.actions}>
            <button className={styles.primary} onClick={onPlay}>Jogar Agora</button>
        </div>
    )
}

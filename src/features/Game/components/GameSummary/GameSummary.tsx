import styles from "./GameSummary.module.css"

export function GameSummary() {
    return <><section className={styles.card}><h2>Peças capturadas</h2><div className={styles.captured}><span>♟</span><span>♞</span><span>♝</span><span>♙</span><span>♘</span><span>♗</span></div></section><section className={styles.card}><h2>Vantagem material</h2><strong>+2</strong><p>Você está à frente</p></section></>
}

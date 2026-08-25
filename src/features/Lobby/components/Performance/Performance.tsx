import styles from "./Performance.module.css"
export function Performance() {
    return <section className={styles.card}><div className={styles.heading}><h2>▥ Seu desempenho</h2><button>Ver tudo</button></div><span className={styles.muted}>Rating</span><div className={styles.rating}>1520 <b>↑ 24</b></div><div className={styles.performance}><span>Vitórias <b>68</b></span><span>Derrotas <b>42</b></span><span>Empates <b>18</b></span></div><button className={styles.statsButton}>⌁ &nbsp; Ver estatísticas</button></section>
}

import styles from "./Performance.module.css";

interface PerformanceProps {
    performance?: {
        rating: number;
        victories: number;
        draws: number;
        losses: number;
        gamesPlayed: number;
    };
}

export function Performance({ performance }: PerformanceProps) {
    if (!performance) {
        return (
            <section className={styles.card}>
                <div className={styles.heading}>
                    <h2>▥ Seu desempenho</h2>
                </div>

                <p>Carregando...</p>
            </section>
        );
    }

    return (
        <section className={styles.card}>
            <div className={styles.heading}>
                <h2>▥ Seu desempenho</h2>
            </div>

            <span className={styles.muted}>Rating</span>

            <div className={styles.rating}>
                {performance.rating} <b>↑ 24</b>
            </div>

            <div className={styles.performance}>
                <span>
                    Jogos jogados <b>{performance.gamesPlayed}</b>
                </span>

                <span>
                    Vitórias <b>{performance.victories}</b>
                </span>

                <span>
                    Derrotas <b>{performance.losses}</b>
                </span>

                <span>
                    Empates <b>{performance.draws}</b>
                </span>
            </div>
        </section>
    );
}
import styles from "./GameDetails.module.css";

type GameDetailsProps = {
    moves: string[][];
    initialTimeSeconds: number;
    incrementSeconds: number;
    onUnavailable: () => void;
};

export function GameDetails({
    moves,
    initialTimeSeconds,
    incrementSeconds,
    onUnavailable,
}: GameDetailsProps) {
    return (
        <aside className={styles.sidePanel}>
            <section className={styles.panel}>
                <div className={styles.tabs}>
                    <span className={styles.activeTab}>Movimentos</span>
                    <span>Chat</span>
                </div>

                <ol className={styles.moveList}>
                    {moves.map(([white, black], index) => (
                        <li
                            className={
                                index === moves.length - 1 ? styles.lastMove : ""
                            }
                            key={`${white}-${black}`}
                        >
                            <span>{index + 1}.</span>
                            <strong>{white}</strong>
                            <strong>{black}</strong>
                        </li>
                    ))}
                </ol>
            </section>

            <section className={styles.panel}>
                <h2>Partida</h2>

                <p>♟ Ranqueada</p>

                <p>
                    ◷ {Math.floor(initialTimeSeconds / 60)} min
                    {incrementSeconds > 0 ? ` + ${incrementSeconds}s` : ""}
                </p>

                <div className={styles.divider} />

                <p>− Rating em jogo</p>

                <p className={styles.ratingChange}>
                    Vitória <b>+24</b> · Derrota <em>-18</em>
                </p>

                <div className={styles.actions}>
                    <button type="button" onClick={onUnavailable}>
                        Oferecer empate
                    </button>

                    <button
                        type="button"
                        className={styles.abandon}
                        onClick={onUnavailable}
                    >
                        Abandonar partida
                    </button>
                </div>
            </section>
        </aside>
    );
}
import styles from "./GameDetails.module.css";
import { getGameMode, type GameMode } from "../../../../packages/constants/gameModes";

type GameDetailsProps = {
    moves: string[][];
    initialTimeSeconds: number;
    incrementSeconds: number;
    playerRating?: number;
    opponentRating?: number;
    gameStatus: "IN_PROGRESS" | "FINISHED";
    playerId: string;
    drawOfferedByPlayerId?: string | null;
    isActionPending?: boolean;
    onOfferDraw: () => void;
    onAcceptDraw: () => void;
    onDeclineDraw: () => void;
    onAbandon: () => void;
    gameMode: GameMode;
};

export function GameDetails({
    moves,
    initialTimeSeconds,
    incrementSeconds,
    playerRating = 1200,
    opponentRating = 1200,
    gameStatus,
    playerId,
    drawOfferedByPlayerId,
    isActionPending = false,
    onOfferDraw,
    onAcceptDraw,
    onDeclineDraw,
    onAbandon,
    gameMode,
}: GameDetailsProps) {
    const expectedScore = 1 / (1 + 10 ** ((opponentRating - playerRating) / 400));
    const victoryChange = Math.round(32 * (1 - expectedScore));
    const lossChange = Math.round(32 * -expectedScore);
    const isFinished = gameStatus === "FINISHED";
    const playerOfferedDraw = drawOfferedByPlayerId === playerId;
    const opponentOfferedDraw = !isFinished && Boolean(drawOfferedByPlayerId) && !playerOfferedDraw;

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

                <p>♟ {getGameMode(gameMode).label}</p>

                <p>
                    ◷ {Math.floor(initialTimeSeconds / 60)} min
                    {incrementSeconds > 0 ? ` + ${incrementSeconds}s` : ""}
                </p>

                <div className={styles.divider} />

                <p>− Rating em jogo</p>

                <p className={styles.ratingChange}>
                    Vitória <b>+{victoryChange}</b> · Derrota <em>{lossChange}</em>
                </p>

                <div className={styles.actions}>
                    {opponentOfferedDraw ? (
                        <>
                            <p className={styles.drawStatus}>Seu adversário solicitou empate.</p>
                            <button type="button" disabled={isActionPending} onClick={onAcceptDraw}>
                                Aceitar empate
                            </button>
                            <button type="button" className={styles.decline} disabled={isActionPending} onClick={onDeclineDraw}>
                                Recusar empate
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            disabled={isFinished || playerOfferedDraw || isActionPending}
                            onClick={onOfferDraw}
                        >
                            {playerOfferedDraw ? "Empate solicitado" : "Oferecer empate"}
                        </button>
                    )}

                    <button
                        type="button"
                        className={styles.abandon}
                        disabled={isFinished || isActionPending}
                        onClick={onAbandon}
                    >
                        {isFinished ? "Partida encerrada" : "Abandonar partida"}
                    </button>
                </div>
            </section>
        </aside>
    );
}

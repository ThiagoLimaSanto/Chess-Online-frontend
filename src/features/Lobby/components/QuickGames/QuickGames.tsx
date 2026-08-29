import type { PlayerGameHistory } from "../../../../packages/hooks/players/useGetGameHistory";

import styles from "./QuickGames.module.css";

type QuickGamesProps = {
    username: string;
    games: PlayerGameHistory[];
    onOpenGame: (gameId: string) => void;
};

function formatTimeControl(game: PlayerGameHistory) {
    const minutes = Math.floor(game.initialTimeSeconds / 60);
    const increment = game.incrementSeconds > 0 ? ` + ${game.incrementSeconds}` : "";

    return `${minutes} min${increment}`;
}

function getResult(game: PlayerGameHistory) {
    if (game.result === "DRAW") {
        return { score: "½ - ½", tone: "draw" as const, label: "Empate" };
    }

    const won = (game.result === "WHITE_WIN" && game.playerWhite)
        || (game.result === "BLACK_WIN" && !game.playerWhite);

    return won
        ? { score: "1 - 0", tone: "win" as const, label: "Vitória" }
        : { score: "0 - 1", tone: "loss" as const, label: "Derrota" };
}

export function QuickGames({
    username,
    games,
    onOpenGame,
}: QuickGamesProps) {
    return (
        <section className={styles.recentGames}>
            <div className={styles.heading}>
                <h2>Histórico de partidas</h2>
            </div>

            {games.length === 0 && (
                <p className={styles.empty}>Você ainda não possui partidas finalizadas.</p>
            )}

            {games.map((game) => {
                const result = getResult(game);

                return <div className={styles.row} key={game.id}>
                    <span className={styles.clock}>◷</span>

                    <span>{formatTimeControl(game)}</span>

                    <span className={styles.avatar}>
                        {username[0].toUpperCase()}
                    </span>

                    <span>{username}</span>

                    <b>×</b>

                    <span className={styles.avatar}>{game.opponent[0].toUpperCase()}</span>

                    <span>{game.opponent}</span>

                    <strong className={styles[result.tone]} title={result.label}>
                        {result.score}
                    </strong>

                    <button
                        className={styles.play}
                        onClick={() => onOpenGame(game.id)}
                        aria-label={`Abrir partida contra ${game.opponent}`}
                    >
                        ▶
                    </button>
                </div>;
            })}
        </section>
    );
}

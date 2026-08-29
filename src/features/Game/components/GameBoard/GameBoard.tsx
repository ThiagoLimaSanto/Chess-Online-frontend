import styles from "./GameBoard.module.css"

type GameBoardProps = { board: string[][] }

export function GameBoard({ board }: GameBoardProps) {
    return <div className={styles.frame}>
        <div className={styles.files} aria-hidden="true">{"abcdefgh".split("").map((file) => <span key={file}>{file}</span>)}</div>
        <div className={styles.board} aria-label="Tabuleiro de xadrez">
            {board.flatMap((row, rowIndex) => row.map((piece, columnIndex) => (
                <div className={(rowIndex + columnIndex) % 2 === 0 ? styles.lightSquare : styles.darkSquare} key={`${rowIndex}-${columnIndex}`}>
                    {columnIndex === 0 && <small>{8 - rowIndex}</small>}
                    <span className={piece && rowIndex < 3 ? styles.blackPiece : styles.whitePiece}>{piece}</span>
                </div>
            )))}
        </div>
    </div>
}

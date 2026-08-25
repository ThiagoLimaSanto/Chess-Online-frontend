import styles from "./OnlineFriends.module.css"

export function SearchFriend() {
    return (
        <section className={styles.searchPanel}>
            <div className={styles.searchField}>
                <span aria-hidden="true">⌕</span>
                <input type="search" placeholder="Pesquisar username" aria-label="Pesquisar amigo por username" />
            </div>
            <p>Encontre novos amigos pesquisando pelo nome de usuário.</p>
        </section>
    )
}

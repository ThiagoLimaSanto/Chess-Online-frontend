import { useEffect, useState } from "react"

import { useGetPlayers } from "../../../../packages/hooks/players/useGetPlayers"

import styles from "./SearchPlayers.module.css"

export function SearchFriend() {

    const [search, setSearch] = useState("")
    const [username, setUsername] = useState("")

    useEffect(() => {

        const time = setTimeout(() => {
            setUsername(search)
        }, 500)

        return () => clearTimeout(time)

    }, [search])

    const {
        data,
        isLoading,
        isFetching
    } = useGetPlayers({
        username,
        page: 0,
        size: 6
    })

    if (isLoading) {
        return <p>Carregando...</p>
    }

    return (
        <section className={styles.searchPanel}>

            <div className={styles.searchField}>

                <span aria-hidden="true">
                    ⌕
                </span>

                <input
                    type="search"
                    name="search"
                    placeholder="Pesquisar por nome de usuário"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            {isFetching && (
                <p className={styles.loading}>
                    Buscando jogadores...
                </p>
            )}

            <div className={styles.results}>

                {(data && !isFetching && data?.content?.length > 0) && (
                    <p className={styles.sugestionTitle}>
                        Players encontrados
                    </p>
                )}

                {data?.content?.map((player) => (
                    <button
                        key={player.id}
                        className={styles.player}
                        type="button"
                    >
                        {player.username}
                    </button>
                ))}

            </div>

            {data?.content?.length === 0 && !isFetching && username !== "" && (
                <p className={styles.empty}>
                    Nenhum jogador encontrado.
                </p>
            )}

        </section>
    )
}
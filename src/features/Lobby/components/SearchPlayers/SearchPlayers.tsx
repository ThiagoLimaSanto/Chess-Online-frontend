import { useEffect, useState } from "react"

import { FaUserPlus } from "react-icons/fa"
import { useGetPlayers } from "../../../../packages/hooks/players/useGetPlayers"

import { useSendFriendship } from "../../../../packages/hooks/players/useSendFriendship"
import { mensagemAdapter } from "../../../../packages/mensagem/mensagemAdapter"
import styles from "./SearchPlayers.module.css"

export function SearchPlayers() {

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

    const { mutateAsync: sendRequest } = useSendFriendship();

    const handleSendRequest = async (receiverId: string) => {
        try {
            await sendRequest(receiverId)
            mensagemAdapter.success("Pedido enviado!")
            console.log("Pedido enviado!")
        } catch (error) {
            mensagemAdapter.error(error)
        }
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

            <div className={styles.results}>

                {isLoading || isFetching ? (
                    <p className={styles.status}>
                        {isLoading ? "Carregando jogadores..." : "Buscando jogadores..."}
                    </p>
                ) : data?.content?.length ? (
                    <p className={styles.sugestionTitle}>
                        Jogadores encontrados
                    </p>
                ) : null}

                {!isLoading && !isFetching && data?.content?.map((player) => (
                    <div
                        key={player.id}
                        className={styles.playerContainer}
                    >
                        <span className={styles.playerUsername}>
                            {player.username}
                        </span>

                        <button
                            className={styles.messageButton}
                            type="button"
                            onClick={() => handleSendRequest(player.id)}
                            aria-label={`Enviar pedido de amizade para ${player.username}`}
                        >
                            <FaUserPlus />
                        </button>
                    </div>
                ))}

            </div>

            {data?.content?.length === 0 && !isFetching && !isLoading && username !== "" && (
                <p className={styles.empty}>
                    Nenhum jogador encontrado.
                </p>
            )}

        </section>
    )
}

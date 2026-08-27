import { useEffect, useState } from "react"
import SimpleBar from "simplebar-react"
import "simplebar-react/dist/simplebar.min.css"

import { useGetFriendship } from "../../../../packages/hooks/players/useGetFriendship"
import { Profile } from "../Profile/Profile"
import { SearchPlayers } from "../SearchPlayers/SearchPlayers"

import styles from "./OnlineFriends.module.css"

export function OnlineFriends() {
    const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)
    const [username, setUsername] = useState("")
    const [search, setSearch] = useState("")

    const {
        data: friends,
        isLoading,
        isFetching,
    } = useGetFriendship({
        username,
        page: 0,
        size: 5,
    })

    // Aguarda 500ms antes de realizar a busca
    useEffect(() => {
        const time = setTimeout(() => {
            setUsername(search)
        }, 500)

        return () => clearTimeout(time)
    }, [search])

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <span className={styles.loadingDot} />
                Carregando amigos...
            </div>
        )
    }

    if (isFetching) {
        return (
            <div className={styles.loading}>
                <span className={styles.loadingDot} />
                Buscando amigos...
            </div>
        )
    }

    return (
        <div className={styles.friendArea}>
            <section className={styles.card}>
                <div className={styles.heading}>
                    <h2>
                        <span>♟</span>
                        Amigos
                    </h2>
                </div>

                <SimpleBar
                    className={styles.friendList}
                    autoHide={false}
                >
                    {friends?.content?.length ? (
                        friends.content.map((friend) => (
                            <div
                                className={styles.friend}
                                key={friend.id}
                            >
                                <Profile username={friend.username} />
                            </div>
                        ))
                    ) : (
                        <div className={styles.empty}>
                            <span>♟</span>
                            <p>Nenhum amigo encontrado</p>
                            <small>
                                Adicione amigos para vê-los aqui.
                            </small>
                        </div>
                    )}
                </SimpleBar>

                <button
                    type="button"
                    className={styles.add}
                    onClick={() =>
                        setIsAddFriendOpen((isOpen) => !isOpen)
                    }
                    aria-expanded={isAddFriendOpen}
                >
                    <span>
                        {isAddFriendOpen ? "−" : "+"}
                    </span>

                    {isAddFriendOpen
                        ? "Fechar busca"
                        : "Adicionar amigo"}
                </button>
            </section>

            {isAddFriendOpen && (
                <SearchPlayers />
            )}
        </div>
    )
}
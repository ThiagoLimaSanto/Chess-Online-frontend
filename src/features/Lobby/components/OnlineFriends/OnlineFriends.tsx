import { useEffect, useState } from "react"
import SimpleBar from "simplebar-react"
import "simplebar-react/dist/simplebar.min.css"

import { useGetFriendship } from "../../../../packages/hooks/players/useGetFriendship"
import { Profile } from "../Profile/Profile"

import styles from "./OnlineFriends.module.css"

type OnlineFriendsProps = {
    onChallenge: (friendUsername: string) => void
    onSearchPanelChange: (isOpen: boolean) => void
    challengeDisabled?: boolean
    isChallengePending?: boolean
}

export function OnlineFriends({
    onChallenge,
    onSearchPanelChange,
    challengeDisabled = false,
    isChallengePending = false,
}: OnlineFriendsProps) {
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

    const handleToggleSearchPanel = () => {
        const nextIsOpen = !isAddFriendOpen
        setIsAddFriendOpen(nextIsOpen)
        onSearchPanelChange(nextIsOpen)
    }

    return (
        <div className={styles.friendArea}>
            <section className={styles.card}>
                <div className={styles.heading}>
                    <h2>
                        <span>♟</span>
                        Amigos
                    </h2>
                    <span className={styles.count}>{friends?.totalElements ?? 0}</span>
                </div>

                <label className={styles.searchField}>
                    <span aria-hidden="true">⌕</span>
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Buscar amigos"
                        aria-label="Buscar amigos"
                    />
                </label>

                <SimpleBar
                    className={styles.friendList}
                    autoHide={false}
                >
                    {isLoading || isFetching ? (
                        <div className={styles.loading}>
                            <span className={styles.loadingDot} />
                            {isLoading ? "Carregando amigos..." : "Buscando amigos..."}
                        </div>
                    ) : friends?.content?.length ? (
                        friends.content.map((friend) => (
                            <div
                                className={styles.friend}
                                key={friend.id}
                            >
                                <Profile username={friend.username} />
                                <button
                                    type="button"
                                    className={styles.challenge}
                                    onClick={() => onChallenge(friend.username)}
                                    disabled={challengeDisabled || isChallengePending}
                                >
                                    {challengeDisabled ? "Em partida" : isChallengePending ? "Enviando..." : "Desafiar"}
                                </button>
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
                    onClick={handleToggleSearchPanel}
                    aria-expanded={isAddFriendOpen}
                >
                    <span>
                        {isAddFriendOpen ? "−" : "+"}
                    </span>

                    {isAddFriendOpen ? "Fechar painel" : "Adicionar amigo"}
                </button>
            </section>
        </div>
    )
}

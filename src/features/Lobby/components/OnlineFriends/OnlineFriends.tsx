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
        isFetching
    } = useGetFriendship({
        username,
        page: 0,
        size: 5
    })

    useEffect(() => {
        const time = setTimeout(() => {
            setUsername(search)
            setSearch(search)
        }, 500)

        return () => clearTimeout(time)
    }, [search])


    if (isFetching) return <p>Buscando amigos...</p>

    if (isLoading) {
        return <p>Carregando...</p>
    }

    return (
        <div className={styles.friendArea}>
            <section className={styles.card}>

                <div className={styles.heading}>
                    <h2>♟ &nbsp;Amigos</h2>
                </div>

                <SimpleBar
                    className={styles.friendList}
                    autoHide={false}
                >
                    {friends?.content.map((friend) => (
                        <div
                            className={styles.friend}
                            key={friend.id}
                        >
                            <Profile username={friend.username} />
                        </div>
                    ))}
                </SimpleBar>

                <button
                    className={styles.add}
                    onClick={() =>
                        setIsAddFriendOpen((isOpen) => !isOpen)
                    }
                >
                    ＋ Adicionar amigo
                </button>

            </section>

            {isAddFriendOpen && <SearchPlayers />}
        </div>
    )
}
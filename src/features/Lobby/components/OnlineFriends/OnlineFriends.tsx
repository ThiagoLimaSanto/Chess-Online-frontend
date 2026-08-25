import { useState } from "react"
import SimpleBar from "simplebar-react"
import "simplebar-react/dist/simplebar.min.css"
import type { Friend } from "../../hooks/useLobbyData"
import styles from "./OnlineFriends.module.css"
import { SearchFriend } from "./SearchFriend"

type OnlineFriendsProps = { friends: Friend[] }
export function OnlineFriends({ friends }: OnlineFriendsProps) {
    const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)

    return (
        <div className={styles.friendArea}>
            <section className={styles.card}>
                <div className={styles.heading}><h2>♟ &nbsp;Amigos</h2></div>
                <SimpleBar className={styles.friendList} autoHide={false}>
                    {friends.map((friend) => <div className={styles.friend} key={friend.name}><span className={styles.avatar}>{friend.avatar}</span><span><b>{friend.name} {friend.active && <i className={styles.online} />}</b><small>{friend.status}</small></span>{friend.name === "Carlos" && <span>▦</span>}</div>)}
                </SimpleBar>
                <button className={styles.add} onClick={() => setIsAddFriendOpen((isOpen) => !isOpen)}>＋ Adicionar amigo</button>
            </section>
            {isAddFriendOpen && <SearchFriend />}
        </div>
    )
}

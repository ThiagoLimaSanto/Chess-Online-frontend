import type { Friend } from "../../hooks/useLobbyData"
import styles from "./OnlineFriends.module.css"

type OnlineFriendsProps = { friends: Friend[] }
export function OnlineFriends({ friends }: OnlineFriendsProps) {
    return <section className={styles.card}><div className={styles.heading}><h2>♟ &nbsp;Amigos online</h2><button>Ver todos</button></div>{friends.map((friend) => <div className={styles.friend} key={friend.name}><span className={styles.avatar}>{friend.avatar}</span><span><b>{friend.name} {friend.active && <i className={styles.online} />}</b><small>{friend.status}</small></span>{friend.name === "Carlos" && <span>▦</span>}</div>)}<button className={styles.add}>＋ Adicionar amigo</button></section>
}

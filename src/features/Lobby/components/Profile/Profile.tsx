import styles from "./Profile.module.css"

type ProfileProps = {
    username: string
}

export function Profile({ username }: ProfileProps) {
    return (
        <div className={styles.profile}>
            <span className={styles.avatar}>{username[0].toUpperCase()}</span>
            {username}
        </div>
    )
}

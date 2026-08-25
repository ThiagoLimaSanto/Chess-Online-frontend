import styles from "./Sidebar.module.css"

export function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}><span>♟</span> CHESS</div>
        </aside>
    )
}

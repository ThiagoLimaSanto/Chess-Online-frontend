import styles from "./Navbar.module.css"
import { Profile } from "../Profile/Profile"

type NavbarProps = {
    username: string
    onLogout: () => void
}

export function Navbar({ username, onLogout }: NavbarProps) {
    return (
        <header className={styles.topbar}>
            <div className={styles.logo}><span>♟</span> CHESS</div>
            <div className={styles.topActions}>
                <button className={styles.iconButton}>✉<b>3</b></button>
                <Profile username={username} />
                <button className={styles.logoutButton} onClick={onLogout}><span aria-hidden="true">↪</span> Sair</button>
            </div>
        </header>
    )
}

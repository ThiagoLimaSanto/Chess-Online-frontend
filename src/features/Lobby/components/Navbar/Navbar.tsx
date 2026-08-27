import { useEffect, useState } from "react"

import { useGetFriendshipRequest } from "../../../../packages/hooks/players/useGetFriendshipRequest"

import { Profile } from "../Profile/Profile"

import { useAcceptRequest } from "../../../../packages/hooks/players/useAcceptRequest"
import { useRejectRequest } from "../../../../packages/hooks/players/useRejectRequest"
import { mensagemAdapter } from "../../../../packages/mensagem/mensagemAdapter"
import { FriendshipRequests } from "../friendshipRequest/FriendshipRequest"
import styles from "./Navbar.module.css"

type NavbarProps = {
    username: string
    onLogout: () => void
}

export function Navbar({
    username,
    onLogout,
}: NavbarProps) {

    const [usernameSearch, setUsernameSearch] = useState("")
    const [search, setSearch] = useState("")
    const [isOpenRequests, setIsOpenRequests] = useState(false)

    const {
        data,
    } = useGetFriendshipRequest({
        username: usernameSearch,
        page: 0,
        size: 5,
    })

    const { mutateAsync: acceptRequest } = useAcceptRequest()
    const { mutateAsync: rejectRequest } = useRejectRequest()

    const totalRequests = data?.totalElements ?? 0

    useEffect(() => {

        const time = setTimeout(() => {
            setUsernameSearch(search)
        }, 500)

        return () => clearTimeout(time)

    }, [search])

    const handleAccept = async (requesterId: string) => {
        try {
            await acceptRequest(requesterId)
            mensagemAdapter.success("Amizade aceita!")
        } catch (error) {
            mensagemAdapter.error(error)
        }
    }

    const handleReject = async (requesterId: string) => {
        try {
            await rejectRequest(requesterId)
            mensagemAdapter.success("Amizade rejeitada!")
        } catch (error) {
            mensagemAdapter.error(error)
        }
    }

    return (
        <header className={styles.topbar}>

            <div className={styles.logo}>
                <span>♟</span> CHESS
            </div>

            <div className={styles.topActions}>

                <div className={styles.messageContainer}>

                    <button
                        onClick={() =>
                            setIsOpenRequests((prev) => !prev)
                        }
                        className={styles.iconButton}
                    >
                        ✉

                        {totalRequests > 0 && (
                            <b>{totalRequests}</b>
                        )}
                    </button>

                    {isOpenRequests && (
                        <FriendshipRequests
                            requests={data?.content ?? []}
                            onAccept={handleAccept}
                            onReject={handleReject}
                            onClose={() => setIsOpenRequests(false)}
                        />
                    )}

                </div>

                <Profile username={username} />

                <button
                    className={styles.logoutButton}
                    onClick={onLogout}
                >
                    <span aria-hidden="true">
                        ↪
                    </span>

                    Sair
                </button>

            </div>

        </header>
    )
}
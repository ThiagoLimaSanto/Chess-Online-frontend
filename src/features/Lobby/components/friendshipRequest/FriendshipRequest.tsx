import { useEffect, useRef } from "react"
import type { FriendshipResponse } from "../../../../packages/hooks/types/response/PageResponse"
import styles from "./FriendshipRequest.module.css"

type FriendshipRequestsProps = {
    requests: FriendshipResponse[]
    onAccept: (friendshipId: string) => void
    onReject: (friendshipId: string) => void
    onClose: () => void
}

export function FriendshipRequests({
    requests,
    onAccept,
    onReject,
    onClose,
}: FriendshipRequestsProps) {

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {

        function handleClickOutside(event: MouseEvent) {

            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                onClose()
            }

        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }

    }, [onClose])

    return (
        <div
            ref={containerRef}
            className={styles.container}
        >
            <div className={styles.header}>
                <span>Solicitações de amizade</span>
            </div>

            {requests.length === 0 ? (
                <div className={styles.empty}>
                    Nenhuma solicitação de amizade.
                </div>
            ) : (
                <div className={styles.list}>

                    {requests.map((request) => (
                        <div
                            key={request.id}
                            className={styles.request}
                        >
                            <div className={styles.user}>
                                <div className={styles.avatar}>
                                    {request.username
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <span>
                                    {request.username}
                                </span>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    className={styles.accept}
                                    onClick={() => onAccept(request.id)}
                                >
                                    ✓
                                </button>

                                <button
                                    className={styles.reject}
                                    onClick={() => onReject(request.id)}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            )}
        </div>
    )
}
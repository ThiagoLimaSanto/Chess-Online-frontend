import { useEffect, useRef, useState } from "react"
import type { FriendshipResponse } from "../../../../packages/hooks/types/response/PageResponse"
import styles from "./FriendshipRequest.module.css"

type FriendshipRequestsProps = {
    requests: FriendshipResponse[]
    sentRequests: FriendshipResponse[]
    search: string
    onSearchChange: (value: string) => void
    onAccept: (friendshipId: string) => void
    onReject: (friendshipId: string) => void
    onClose: () => void
}

export function FriendshipRequests({
    requests,
    sentRequests,
    search,
    onSearchChange,
    onAccept,
    onReject,
    onClose,
}: FriendshipRequestsProps) {

    const containerRef = useRef<HTMLDivElement>(null)
    const [activeTab, setActiveTab] = useState<"challenges" | "received" | "sent">("received")
    const activeRequests = activeTab === "received"
        ? requests
        : activeTab === "sent"
            ? sentRequests
            : []

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
                <div>
                    <span className={styles.eyebrow}>NOTIFICAÇÕES</span>
                    <strong>Amizades</strong>
                </div>
            </div>

            <label className={styles.searchField}>
                <span aria-hidden="true">⌕</span>
                <input
                    type="search"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Buscar pedidos"
                    aria-label="Buscar pedidos de amizade"
                />
            </label>

            <div className={styles.tabs} role="tablist" aria-label="Notificações">
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "challenges"}
                    className={activeTab === "challenges" ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab("challenges")}
                >
                    Desafios <span>0</span>
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "received"}
                    className={activeTab === "received" ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab("received")}
                >
                    Recebidos <span>{requests.length}</span>
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "sent"}
                    className={activeTab === "sent" ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab("sent")}
                >
                    Enviados <span>{sentRequests.length}</span>
                </button>
            </div>

            {activeRequests.length === 0 ? (
                <div className={styles.empty}>
                    {activeTab === "challenges"
                        ? "Nenhum desafio recebido."
                        : activeTab === "received"
                        ? "Nenhum pedido recebido."
                        : "Nenhum pedido enviado."}
                </div>
            ) : (
                <div className={styles.list}>

                    {activeRequests.map((request) => (
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

                            {activeTab === "received" ? (
                                <div className={styles.actions}>
                                    <button className={styles.accept} onClick={() => onAccept(request.id)} aria-label={`Aceitar pedido de ${request.username}`}>✓</button>
                                    <button className={styles.reject} onClick={() => onReject(request.id)} aria-label={`Recusar pedido de ${request.username}`}>✕</button>
                                </div>
                            ) : (
                                <span className={styles.pending}>Pendente</span>
                            )}
                        </div>
                    ))}

                </div>
            )}
        </div>
    )
}

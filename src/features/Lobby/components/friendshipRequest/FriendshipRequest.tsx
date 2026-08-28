import { useEffect, useRef, useState } from "react"

import type {
    ChallengeResponse,
    FriendshipResponse,
} from "../../../../packages/hooks/types/response/PageResponse"

import styles from "./FriendshipRequest.module.css"

type FriendshipRequestsProps = {
    mode: "notifications" | "challenges"

    challengesReceiveds?: ChallengeResponse[]
    requests?: FriendshipResponse[]
    sentRequests?: FriendshipResponse[]

    search?: string
    onSearchChange?: (value: string) => void

    onAccept?: (id: string) => void
    onReject?: (id: string) => void

    onAcceptChallenge?: (id: string) => void
    onRejectChallenge?: (id: string) => void

    onClose: () => void
}

export function FriendshipRequests({
    mode,

    challengesReceiveds = [],
    requests = [],
    sentRequests = [],

    search = "",
    onSearchChange,

    onAccept,
    onReject,

    onAcceptChallenge,
    onRejectChallenge,

    onClose,
}: FriendshipRequestsProps) {

    const containerRef = useRef<HTMLDivElement>(null)

    const [activeTab, setActiveTab] = useState<
        "received" | "sent"
    >("received")

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(
                    event.target as Node
                )
            ) {
                onClose()
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        )

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            )
        }
    }, [onClose])

    /*
     * ============================
     * DESAFIOS
     * ============================
     */

    if (mode === "challenges") {
        return (
            <div
                ref={containerRef}
                className={styles.container}
            >
                <div className={styles.header}>
                    <div>
                        <span className={styles.eyebrow}>
                            DESAFIOS
                        </span>

                        <strong>
                            Desafios recebidos
                        </strong>
                    </div>
                </div>

                {challengesReceiveds.length === 0 ? (
                    <div className={styles.empty}>
                        Nenhum desafio recebido.
                    </div>
                ) : (
                    <div className={styles.list}>
                        {challengesReceiveds.map(
                            (challenge) => (
                                <div
                                    key={challenge.id}
                                    className={styles.request}
                                >
                                    <div className={styles.user}>
                                        <div
                                            className={
                                                styles.avatar
                                            }
                                        >
                                            {challenge.challengerUsername
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <span>
                                            {
                                                challenge.challengerUsername
                                            }
                                        </span>
                                    </div>

                                    <div
                                        className={
                                            styles.actions
                                        }
                                    >
                                        <button
                                            className={
                                                styles.accept
                                            }
                                            onClick={() =>
                                                onAcceptChallenge?.(
                                                    challenge.id
                                                )
                                            }
                                            aria-label={`Aceitar desafio de ${challenge.challengerUsername}`}
                                        >
                                            ✓
                                        </button>

                                        <button
                                            className={
                                                styles.reject
                                            }
                                            onClick={() =>
                                                onRejectChallenge?.(
                                                    challenge.id
                                                )
                                            }
                                            aria-label={`Rejeitar desafio de ${challenge.challengerUsername}`}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        )
    }

    /*
     * ============================
     * NOTIFICAÇÕES / AMIZADES
     * ============================
     */

    const activeRequests =
        activeTab === "received"
            ? requests
            : sentRequests

    return (
        <div
            ref={containerRef}
            className={styles.container}
        >
            <div className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>
                        NOTIFICAÇÕES
                    </span>

                    <strong>
                        Amizades
                    </strong>
                </div>
            </div>

            <label className={styles.searchField}>
                <span aria-hidden="true">
                    ⌕
                </span>

                <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                        onSearchChange?.(
                            event.target.value
                        )
                    }
                    placeholder="Buscar pedidos"
                    aria-label="Buscar pedidos de amizade"
                />
            </label>

            <div
                className={styles.tabs}
                role="tablist"
                aria-label="Notificações"
            >
                <button
                    type="button"
                    role="tab"
                    aria-selected={
                        activeTab === "received"
                    }
                    className={
                        activeTab === "received"
                            ? styles.activeTab
                            : styles.tab
                    }
                    onClick={() =>
                        setActiveTab("received")
                    }
                >
                    Recebidos

                    <span>
                        {requests.length}
                    </span>
                </button>

                <button
                    type="button"
                    role="tab"
                    aria-selected={
                        activeTab === "sent"
                    }
                    className={
                        activeTab === "sent"
                            ? styles.activeTab
                            : styles.tab
                    }
                    onClick={() =>
                        setActiveTab("sent")
                    }
                >
                    Enviados

                    <span>
                        {sentRequests.length}
                    </span>
                </button>
            </div>

            {activeRequests.length === 0 ? (
                <div className={styles.empty}>
                    {activeTab === "received"
                        ? "Nenhum pedido recebido."
                        : "Nenhum pedido enviado."}
                </div>
            ) : (
                <div className={styles.list}>
                    {activeRequests.map(
                        (request) => (
                            <div
                                key={request.id}
                                className={styles.request}
                            >
                                <div
                                    className={
                                        styles.user
                                    }
                                >
                                    <div
                                        className={
                                            styles.avatar
                                        }
                                    >
                                        {request.username
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <span>
                                        {
                                            request.username
                                        }
                                    </span>
                                </div>

                                {activeTab ===
                                "received" ? (
                                    <div
                                        className={
                                            styles.actions
                                        }
                                    >
                                        <button
                                            className={
                                                styles.accept
                                            }
                                            onClick={() =>
                                                onAccept?.(
                                                    request.id
                                                )
                                            }
                                            aria-label={`Aceitar pedido de ${request.username}`}
                                        >
                                            ✓
                                        </button>

                                        <button
                                            className={
                                                styles.reject
                                            }
                                            onClick={() =>
                                                onReject?.(
                                                    request.id
                                                )
                                            }
                                            aria-label={`Rejeitar pedido de ${request.username}`}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <span
                                        className={
                                            styles.pending
                                        }
                                    >
                                        Pendente
                                    </span>
                                )}
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    )
}
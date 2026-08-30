import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { useGetFriendshipRequest } from "../../../../packages/hooks/players/useGetFriendshipRequest"
import { useGetSentFriendshipRequest } from "../../../../packages/hooks/players/useGetSentFriendshipRequest"

import { Profile } from "../Profile/Profile"

import { useAcceptChallenge } from "../../../../packages/hooks/challenges/useAcceptChallenge"
import { useReceivedChallenge } from "../../../../packages/hooks/challenges/useReceivedChallenge"
import { useRejectChallenge } from "../../../../packages/hooks/challenges/useRejectChallenge"

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

    const navigate = useNavigate()

    const [usernameSearch, setUsernameSearch] =
        useState("")

    const [search, setSearch] =
        useState("")

    const [isOpenRequests, setIsOpenRequests] =
        useState(false)

    const [isOpenChallenges, setIsOpenChallenges] =
        useState(false)

    const {
        data,
    } = useGetFriendshipRequest({
        username: usernameSearch,
        page: 0,
        size: 5,
    })

    const {
        data: sentRequests,
    } = useGetSentFriendshipRequest({
        username: usernameSearch,
        page: 0,
        size: 5,
    })

    const {
        data: challengesReceiveds,
    } = useReceivedChallenge()

    const {
        mutateAsync: acceptRequest,
    } = useAcceptRequest()

    const {
        mutateAsync: rejectRequest,
    } = useRejectRequest()

    const {
        mutateAsync: acceptChallenge,
    } = useAcceptChallenge()

    const {
        mutateAsync: rejectChallenge,
    } = useRejectChallenge()

    const totalRequests =
        (data?.totalElements ?? 0) +
        (sentRequests?.totalElements ?? 0)

    useEffect(() => {
        const time = setTimeout(() => {
            setUsernameSearch(search)
        }, 500)

        return () => clearTimeout(time)
    }, [search])

    const handleAccept = async (
        requesterId: string
    ) => {
        try {
            await acceptRequest(requesterId)

            mensagemAdapter.success(
                "Amizade aceita!"
            )
        } catch (error) {
            mensagemAdapter.error(error)
        }
    }

    const handleReject = async (
        requesterId: string
    ) => {
        try {
            await rejectRequest(requesterId)

            mensagemAdapter.success(
                "Amizade rejeitada!"
            )
        } catch (error) {
            mensagemAdapter.error(error)
        }
    }

    const handleAcceptChallenge = async (
        challengeId: string
    ) => {
        try {
            const game = await acceptChallenge(challengeId)

            mensagemAdapter.success(
                "Desafio aceito!"
            )
            setIsOpenChallenges(false)
            navigate(`/game/${game.id}`)
        } catch (error) {
            mensagemAdapter.error(error)
        }
    }

    const handleRejectChallenge = async (
        challengeId: string
    ) => {
        try {
            await rejectChallenge(challengeId)

            mensagemAdapter.success(
                "Desafio rejeitado!"
            )
        } catch (error) {
            mensagemAdapter.error(error)
        }
    }

    return (
        <header className={styles.topbar}>

            <div className={styles.logo}>
                <span>♟</span>
                CHESS
            </div>

            <div className={styles.topActions}>

                <div
                    className={
                        styles.challengeContainer
                    }
                >
                    <button
                        type="button"
                        className={
                            styles.challengeButton
                        }
                        onClick={() =>
                            setIsOpenChallenges(
                                (prev) => !prev
                            )
                        }
                    >
                        ♟

                        <span>
                            Desafios
                        </span>

                        {(challengesReceiveds
                            ?.totalElements ?? 0) > 0 && (
                                <b>
                                    {
                                        challengesReceiveds
                                            ?.totalElements
                                    }
                                </b>
                            )}
                    </button>

                    {isOpenChallenges && (
                        <FriendshipRequests
                            mode="challenges"

                            challengesReceiveds={
                                challengesReceiveds
                                    ?.content ?? []
                            }

                            onAcceptChallenge={
                                handleAcceptChallenge
                            }

                            onRejectChallenge={
                                handleRejectChallenge
                            }

                            onClose={() =>
                                setIsOpenChallenges(
                                    false
                                )
                            }
                        />
                    )}
                </div>
                <div
                    className={
                        styles.messageContainer
                    }
                >
                    <button
                        type="button"
                        onClick={() =>
                            setIsOpenRequests(
                                (prev) => !prev
                            )
                        }
                        className={
                            styles.iconButton
                        }
                    >
                        ✉

                        {totalRequests > 0 && (
                            <b>
                                {totalRequests}
                            </b>
                        )}
                    </button>

                    {isOpenRequests && (
                        <FriendshipRequests
                            mode="notifications"

                            challengesReceiveds={
                                challengesReceiveds
                                    ?.content ?? []
                            }

                            requests={
                                data?.content ?? []
                            }

                            sentRequests={
                                sentRequests
                                    ?.content ?? []
                            }

                            search={search}

                            onSearchChange={
                                setSearch
                            }

                            onAccept={
                                handleAccept
                            }

                            onReject={
                                handleReject
                            }

                            onAcceptChallenge={
                                handleAcceptChallenge
                            }

                            onRejectChallenge={
                                handleRejectChallenge
                            }

                            onClose={() =>
                                setIsOpenRequests(
                                    false
                                )
                            }
                        />
                    )}
                </div>
                <Profile
                    username={username}
                />
                <button
                    className={
                        styles.logoutButton
                    }
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

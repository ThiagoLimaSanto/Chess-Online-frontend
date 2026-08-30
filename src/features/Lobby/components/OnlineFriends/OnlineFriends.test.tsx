import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { OnlineFriends } from "./OnlineFriends"

vi.mock("../../../../packages/hooks/players/useGetFriendship", () => ({
    useGetFriendship: () => ({
        data: {
            content: [{ id: "friend-1", username: "Carlos" }],
            totalElements: 1,
            totalPages: 1,
            size: 5,
            number: 0,
        },
        isLoading: false,
        isFetching: false,
    }),
}))

describe("OnlineFriends", () => {
    it("abre os modos e desafia o amigo com o modo escolhido", async () => {
        const onChallenge = vi.fn()
        const user = userEvent.setup()

        render(
            <OnlineFriends
                onChallenge={onChallenge}
                onSearchPanelChange={() => undefined}
            />,
        )

        await user.click(screen.getByRole("button", { name: "Desafiar" }))

        expect(screen.getByLabelText("Escolher modo para desafiar Carlos")).toBeInTheDocument()

        await user.click(screen.getByRole("button", { name: "Blitz 3 + 2" }))

        expect(onChallenge).toHaveBeenCalledWith("Carlos", "BLITZ")
        expect(screen.queryByLabelText("Escolher modo para desafiar Carlos")).not.toBeInTheDocument()
    })
})

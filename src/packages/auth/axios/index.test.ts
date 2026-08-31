import { afterEach, describe, expect, it } from "vitest"

import { clearAuthToken, getAuthToken, getValidAuthToken, setAuthToken } from "."

describe("armazenamento do access token", () => {
    afterEach(() => clearAuthToken())

    it("mantém o access token somente em memória e remove o armazenamento legado", () => {
        localStorage.setItem("chess-auth-token", "token-antigo")

        setAuthToken("access-token")

        expect(getAuthToken()).toBe("access-token")
        expect(localStorage.getItem("chess-auth-token")).toBeNull()
    })

    it("reutiliza um access token que ainda não está próximo de expirar", async () => {
        const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 120 }))
        const token = `header.${payload}.signature`
        setAuthToken(token)

        await expect(getValidAuthToken()).resolves.toBe(token)
    })
})

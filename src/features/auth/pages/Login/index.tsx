import { useAuth } from "../../../../contexts/auth/useAuth";
import type { LoginPayload } from "../../../../packages/auth/hooks/auth/useLogin";
import { mensagemAdapter } from "../../../../packages/mensagem/mensagemAdapter";
import { AuthPage } from "../../../../packages/pages/auth/AuthPage";

export function Login() {
    const { login } = useAuth()
    async function handleLogin({ username, password }: LoginPayload) {
        const authenticatedUser = await login(username, password)
        mensagemAdapter.success(`Bem-vindo, ${authenticatedUser.username}!`)
    }
    return <AuthPage mode="login" handle={handleLogin} />
}
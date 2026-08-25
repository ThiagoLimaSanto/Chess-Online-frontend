import { useAuth } from "../../../../contexts/auth/useAuth";
import type { RegisterPayload } from "../../../../packages/auth/hooks/auth/useRegister";
import { mensagemAdapter } from "../../../../packages/mensagem/mensagemAdapter";
import { AuthPage } from "../../../../packages/pages/auth/AuthPage";

export function Register() {
    const { register } = useAuth()
    async function handleRegister({ username, password }: RegisterPayload) {
        await register(username, password)
        mensagemAdapter.success('Conta criada com sucesso!')
    }
    return <AuthPage mode="register" handle={handleRegister} />
}
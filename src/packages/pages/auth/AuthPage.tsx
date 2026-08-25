import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../../contexts/auth/useAuth"
import type { LoginPayload } from "../../auth/hooks/auth/useLogin"
import { MainForm } from "../../form/MainForm"
import formStyles from "../../form/MainForm.module.css"
import { mensagemAdapter } from "../../mensagem/mensagemAdapter"
import styles from "./AuthPage.module.css"

type AuthMode = 'login' | 'register'

export function AuthPage({ mode: initialMode = 'login', handle }: { mode?: AuthMode, handle: ({ username, password }: LoginPayload) => Promise<unknown> }) {
    const [mode, setMode] = useState<AuthMode>(initialMode)
    const navigate = useNavigate()
    const { isLoading } = useAuth()

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const username = String(formData.get("username") ?? "").trim()
        const password = String(formData.get("password") ?? "")
        const payload = { username, password }
        try {
            if (!isRegister) {
                await handle(payload)
                navigate("/")
                return
            }
            await handle(payload)
            return
        } catch (error) {
            mensagemAdapter.error(error)
        }

        mensagemAdapter.success("Conta criada com sucesso!")
        navigate("/login")
    }

    const isRegister = mode === 'register'

    return (
        <main className={styles.authPage}>
            <section className={styles.authHero}>
                <div className={styles.heroContent}>
                    <div className={styles.brandIcon}>♞</div>
                    <div>
                        <h1>Play Chess</h1>
                        <p>Arena de jogos de xadrez</p>
                        <div className={styles.chessDecoration}>♟ ♜ ♞ ♛ ♚ ♝</div>
                    </div>
                </div>
            </section>

            <section className={styles.authPanel}>
                <div className={styles.authBox}>
                    <div className={styles.authTabs}>
                        <button
                            className={!isRegister ? styles.active : undefined}
                            onClick={() => {
                                setMode('login')
                                navigate('/login')
                            }}
                            type="button"
                        >Entrar
                        </button>
                        <button
                            className={isRegister ? styles.active : undefined}
                            onClick={() => {
                                setMode('register')
                                navigate('/register')
                            }}
                            type="button"
                        >Criar conta
                        </button>
                    </div>

                    <h2>{isRegister ? "Criar conta" : "Bem-vindo de volta"}</h2>
                    <p className={styles.authSubtitle}>{isRegister ? "Crie sua conta para começar a jogar" : "Entre para continuar sua partida"}</p>

                    <MainForm submit={handleSubmit}>
                        <label className={formStyles.label}>
                            Username:
                            <input className={formStyles.input} type="text" id="username" name="username" placeholder="Digite o seu username.." required />
                        </label>

                        <label className={formStyles.label}>
                            Senha:
                            <input className={formStyles.input} type="password" name="password" placeholder="Digite sua senha..." required minLength={6} />
                        </label>

                        <button className={styles.submitButton} type="submit">
                            {isLoading && !isRegister
                                ? "Entrando..."
                                : isRegister ? "Criar conta" : "Entrar"}
                        </button>
                    </MainForm>

                    <p className={styles.switchAuth}>
                        {isRegister ? "Já tem uma conta?" : "Não tem uma conta?"}{' '}
                        <Link to={isRegister ? "/login" : "/register"}>
                            {isRegister ? "Entrar" : "Criar conta"}
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    )
}
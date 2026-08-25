import type { FormEvent, ReactNode } from "react"
import styles from "./MainForm.module.css"

type MainFormProps = {
    submit: (event: FormEvent<HTMLFormElement>) => void
    children: ReactNode
}

export function MainForm({ submit, children }: MainFormProps) {
    return (
        <form className={styles.form} onSubmit={submit}>
            {children}
        </form>
    )
}
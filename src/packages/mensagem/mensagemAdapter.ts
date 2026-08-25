import axios from "axios"
import toast from "react-hot-toast"

export const mensagemAdapter = {
    success(message: string, fallback = "Sucesso!") {
        return toast.success(message || fallback)
    },

    error(error: unknown, fallback = "Ocorreu um erro inesperado.") {
        const message = axios.isAxiosError<{ message?: string }>(error)
            ? error.response?.data?.message
            : undefined

        return toast.error(message ?? fallback)
    },

    loading(message: string, fallback = "Carregando...") {
        return toast.loading(message || fallback)
    },

    dismiss(toastId?: string) {
        return toast.dismiss(toastId)
    },
}

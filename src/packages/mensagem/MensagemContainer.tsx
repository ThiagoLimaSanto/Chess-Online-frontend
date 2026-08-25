import { ToastBar, useToaster } from "react-hot-toast"

const toastOptions = {
    duration: 3500,
    style: {
        borderRadius: "8px",
        background: "#151515",
        color: "#fff",
        border: "1px solid #444",
        fontSize: "14px",
    },
    success: {
        iconTheme: {
            primary: "#7dca8b",
            secondary: "#151515",
        },
    },
    error: {
        iconTheme: {
            primary: "#ff8d8d",
            secondary: "#151515",
        },
    },
}

export function MensagemContainer() {
    const { toasts } = useToaster(toastOptions)

    return (
        <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, display: "grid", gap: 8, pointerEvents: "none" }}>
            {toasts.map((toast) => toast.visible && <div key={toast.id} style={{ pointerEvents: "auto" }}><ToastBar toast={toast} position="top-right" /></div>)}
        </div>
    )
}

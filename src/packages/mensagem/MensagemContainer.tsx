import { Toaster } from "react-hot-toast"

export function MensagemContainer() {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
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
            }}
        />
    )
}

import { showToast } from "./toast"

export const copyToClipBoard = (text: string) => {
    if (typeof window !== "undefined") {
        navigator.clipboard.writeText(text)
        showToast({
            content: "Đã sao chép vào bộ nhớ tạm",
            status: "success"
        })
    }
}
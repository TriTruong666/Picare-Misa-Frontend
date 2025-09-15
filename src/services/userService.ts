import axiosClient from "@/utils/axios"


export const getUserInfo = async() => {
    try {
        const res = await axiosClient.get("/users/me")
        return res.data
    } catch (error) {
        console.error(error)
    }
}
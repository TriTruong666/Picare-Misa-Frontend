import { Login } from "@/interfaces/Service"
import axiosClient from "@/utils/axios"

export const loginService = async (data: Login) => {
    try {
        const res = await axiosClient.post(`/auth/login`, data)
        return res.data
    } catch (error) {
        console.error(error)
    }
}
export const logoutService = async () => {
    try {

        const res = await axiosClient.post("/auth/logout")
        return res.data;
    } catch (error) {
        console.error(error)
    }
}
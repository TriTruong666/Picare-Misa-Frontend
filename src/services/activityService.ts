import { PostActivity } from "@/interfaces/Service"
import axiosClient from "@/utils/axios"

export const postActivityLogService = async (data: PostActivity) => {
    try {
        const res = await axiosClient.post("/activity/create", data)
        return res.data
    } catch (error) {
        console.error(error)
    }
}
export const getActivityLogService = async (page: number, limit: number) => {
    try {
        const res = await axiosClient.get(`/activity?page=${page}&limit=${limit}`)
        return res.data.data
    } catch (error) {
        console.error(error)

    }
}

export const getActivityLogDataService = async (page: number, limit: number) => {
    try {
        const res = await axiosClient.get(`/activity?page=${page}&limit=${limit}`)
        return res.data
    } catch (error) {
        console.error(error)

    }
}
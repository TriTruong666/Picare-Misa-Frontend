import axiosClient from "@/utils/axios"

const API_URL = process.env.NEXT_PUBLIC_TEST_API_URL

export const getOrderService = async(page: number, limit: number) => {
    try {   
        const res = await axiosClient.get(`${API_URL}/orders`, {
            params: {
                limit: limit,
                page: page
            }
        })
        return res.data.orders
    } catch (error) {
        console.error(error)
    }
}

export const getOrderData = async() => {
    try {
        const res = await axiosClient.get(`${API_URL}/orders`, {
            params: {
                page: 1
            }
        })
        return res.data
    } catch (error) {
        console.error(error)
    }
}



export const syncOrderService = async() => {
    try {
        const res = await axiosClient.post(`${API_URL}/orders/sync`)
        return res.data
    } catch (error) {
        console.error(error)
    }
}
import { UpdateOrder } from "@/interfaces/Service"
import axiosClient from "@/utils/axios"

const API_URL = process.env.NEXT_PUBLIC_TEST_API_URL

export const getOrderService = async(page: number, limit: number, status: boolean, finStatus?: string, carryStatus?: string, realCarryStatus?: string, source?: string) => {
    try {   
        const res = await axiosClient.get(`${API_URL}/orders`, {
            params: {
                limit: limit,
                page: page,
                status: status,
                carrierStatus: carryStatus,
                financialStatus: finStatus,
                realCarrierStatus: realCarryStatus,
                source
            }
        })
        return res.data.orders
    } catch (error) {
        console.error(error)
    }
}

export const getOrderDataService = async(status: boolean, finStatus?: string, carryStatus?: string, realCarryStatus?: string, source?: string) => {
    try {
        const res = await axiosClient.get(`${API_URL}/orders`, {
            params: {
                page: 1,
                status: status,
                carrierStatus: carryStatus,
                financialStatus: finStatus,
                realCarrierStatus: realCarryStatus,
                source
            }
        })
        return res.data
    } catch (error) {
        console.error(error)
    }
}

export const getDetailOrderService = async(orderId: string) => {
    try {
        const res = await axiosClient.get(`${API_URL}/orders/${orderId}`)
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

export const updateStatusOrderService = async(orderId: string, data: UpdateOrder) => {
    try {
        const res = await axiosClient.put(`${API_URL}/orders/${orderId}/status`, data);
        return res.data
    } catch (error) {
        console.error(error)
    }
}   
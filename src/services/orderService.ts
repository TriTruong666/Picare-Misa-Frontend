import { UpdateOrder } from "@/interfaces/Service"
import axiosClient from "@/utils/axios"


export const getOrderService = async(page: number, limit: number, status?: string, finStatus?: string, carryStatus?: string, realCarryStatus?: string, source?: string, query?: string) => {
    try {   
        const res = await axiosClient.get(`/orders`, {
            params: {
                limit: limit,
                page: page,
                status: status,
                carrierStatus: carryStatus,
                financialStatus: finStatus,
                realCarrierStatus: realCarryStatus,
                source,
                orderId: query
            }
        })
        return res.data.orders
    } catch (error) {
        console.error(error)
    }
}

export const getOrderDataService = async(status?: string, finStatus?: string, carryStatus?: string, realCarryStatus?: string, source?: string, query?: string) => {
    try {
        const res = await axiosClient.get(`/orders`, {
            params: {
                page: 1,
                status: status,
                carrierStatus: carryStatus,
                financialStatus: finStatus,
                realCarrierStatus: realCarryStatus,
                source,
                orderId: query,
            }
        })
        return res.data
    } catch (error) {
        console.error(error)
    }
}

export const getDetailOrderService = async(orderId: string) => {
    try {
        const res = await axiosClient.get(`/orders/${orderId}`)
        return res.data
    } catch (error) {
        console.error(error)
    }
}


export const syncOrderService = async() => {
    try {
        const res = await axiosClient.post(`/orders/sync`)
        return res.data
    } catch (error) {
        console.error(error)
    }
}

export const updateStatusOrderService = async(orderId: string, data: UpdateOrder) => {
    try {
        const res = await axiosClient.put(`/orders/${orderId}/status`, data);
        return res.data
    } catch (error) {
        console.error(error)
    }
}   



import { CreateAttendanceServer, SyncAttendanceData } from "@/interfaces/Service"
import axiosClient from "@/utils/axios"

export const createAttendanceServerService = async (data: CreateAttendanceServer) => {
    try {
        const res = await axiosClient.post("/attendance/server", data)
        return res.data
    } catch (error) {
        console.error(error)
    }
}

export const getAttendanceServerService = async () => {
    try {
        const res = await axiosClient.get("/attendance/server")
        return res.data
    } catch (error) {
        console.error(error)
    }
}

export const getEmployeeAttendanceService = async (page: number, limit: number) => {
    try {
        const res = await axiosClient.get(`/attendance/employee?page=${page}&limit=${limit}`)
        return res.data.attendance
    } catch (error) {
        console.error(error)
    }
}

export const getDataAttendanceService = async (page: number, limit: number) => {
    try {
        const res = await axiosClient.get(`/attendance/employee?page=${page}&limit=${limit}`)
        return res.data
    } catch (error) {
        console.error(error)
    }
}

export const getAttendanceEmployeeByServerService = async (serverId: string, page: number, limit: number) => {
    try {
        const res = await axiosClient.get(`/attendance/by-server?serverId=${serverId}&page=${page}&limit=${limit}`)
        return res.data.attendance_data
    } catch (error) {
        console.error(error)
    }
}

export const getAttendanceDataByServerService = async (serverId: string, page: number, limit: number) => {
    try {
        const res = await axiosClient.get(`/attendance/by-server?serverId=${serverId}&page=${page}&limit=${limit}`)
        return res.data
    } catch (error) {
        console.error(error)
    }
}

export const syncAttendanceDataService = async (type: string, data?: SyncAttendanceData) => {
    try {
        const res = await axiosClient.post(`/attendance/sync?type=${type}`, data)
        return res.data
    } catch (error) {
        console.error(error)
    }
}

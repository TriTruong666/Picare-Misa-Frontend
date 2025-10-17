import { AttendanceServer, AttendanceUser } from "@/interfaces/Attendance";
import { useFetch } from "./useFetch";
import * as AttendanceService from "@/services/attendanceService"

type Data = {
    count: number,
    page: number,
    totalPage: number,
}

export const useGetAttendanceServer = () => {
    return useFetch<AttendanceServer[]>(["attendance-server"], async () =>
        AttendanceService.getAttendanceServerService()
    );
};

export const useGetAttendanceData = (page: number, limit: number, type?: string) => {
    return useFetch<Data>(["attendance-data", page, limit, type], async () =>
        AttendanceService.getDataAttendanceService(page, limit, type)
    );
};

export const useGetAttendanceEmployee = (page: number, limit: number, type?: string) => {
    return useFetch<AttendanceUser[]>(["attendance-employee", page, limit, type], async () =>
        AttendanceService.getEmployeeAttendanceService(page, limit, type)
    );
};

export const useGetAttendanceEmployeeByServer = (serverId: string, page: number, limit: number) => {
    return useFetch<AttendanceUser[]>(["attendance-employee", serverId, page, limit], async () =>
        AttendanceService.getAttendanceEmployeeByServerService(serverId, page, limit)
    );
};

export const useGetAttendanceDataByServer = (serverId: string, page: number, limit: number) => {
    return useFetch<Data>(["attendance-data", serverId, page, limit], async () =>
        AttendanceService.getAttendanceDataByServerService(serverId, page, limit)
    );
};
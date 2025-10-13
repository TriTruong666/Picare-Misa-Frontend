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

export const useGetAttendanceData = (page: number, limit: number) => {
    return useFetch<Data>(["attendance-data"], async () =>
        AttendanceService.getDataAttendanceService(page, limit)
    );
};

export const useGetAttendanceEmployee = (page: number, limit: number) => {
    return useFetch<AttendanceUser[]>(["attendance-employee", page, limit], async () =>
        AttendanceService.getEmployeeAttendanceService(page, limit)
    );
};

export type AttendanceServer = {
    serverId: string,
    serverName: string
    status: boolean,
    attendance_data: AttendanceUser[]
}
export type AttendanceUser = {
    empId: string,
    empName: string,
    checkinTime: string
    type: string
    server: AttendanceServer
}
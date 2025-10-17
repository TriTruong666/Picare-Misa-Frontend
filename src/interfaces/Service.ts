export type UpdateOrder = {
    status: string
}

export type Login = {
    email: string,
    password: string
}

export type Scan = {
    trackingNumber?: string
    orderId?: string,
}

export type BuildOrder = {
    orderId: string,
}

export type PostActivity = {
    userId?: string,
    type: string,
    note?: string
}

export type CreateAttendanceServer = {
    serverName: string,
    domain: string,
    username: string,
    password: string
}

export type SyncAttendanceData = {
    serverId: string,
    minor: number
}
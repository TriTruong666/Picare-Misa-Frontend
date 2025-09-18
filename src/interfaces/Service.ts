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
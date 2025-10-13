import { atom } from "jotai";

export const scanDataState = atom({
    trackingNumber: "",
    orderId: "",
});

export const createAttendanceServerState = atom({
    serverName: "",
    domain: "",
    username: "",
    password: ""
})
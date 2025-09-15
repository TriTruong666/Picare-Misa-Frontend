import { Client } from "@/interfaces/Client";
import { atom } from "jotai";


export const clientDataState = atom<Client>({
    status: "",
    message: "",
    type: "",
    isBlocked: false
})
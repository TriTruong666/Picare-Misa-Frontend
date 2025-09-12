import * as OrderService from "@/services/orderService"
import { useFetch } from "./useFetch";
import { Order } from "@/interfaces/Order";

type Data = {
    count: number,
    page: number,
    totalPage: number,
}

export const useGetOrders = (page: number, limit: number, status: boolean, finStatus?: string, carryStatus?: string, realCarryStatus?: string, source?: string) => {
    return useFetch<Order[]>(["orders", page, limit,status, finStatus, carryStatus, realCarryStatus, source], async () =>
        OrderService.getOrderService(page, limit, status, finStatus, carryStatus, realCarryStatus, source)
    );
  };


export const useGetOrderData = (status: boolean, finStatus?: string, carryStatus?: string, realCarryStatus?: string, source?: string) => {
    return useFetch<Data>(["data", status, finStatus, carryStatus, realCarryStatus, source], async () =>
        OrderService.getOrderDataService(status, finStatus, carryStatus, realCarryStatus, source)
    );
  };

export const useGetDetailOrder = (orderId: string) => {
    return useFetch<Order>(["detail", orderId], async () =>
        OrderService.getDetailOrderService(orderId)
    );
  };
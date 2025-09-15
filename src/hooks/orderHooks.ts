import * as OrderService from "@/services/orderService"
import { useFetch } from "./useFetch";
import { Order } from "@/interfaces/Order";

type Data = {
    count: number,
    page: number,
    totalPage: number,
}

export const useGetOrders = (page: number, limit: number, status?: string, finStatus?: string, carryStatus?: string, realCarryStatus?: string, source?: string, query?: string) => {
    return useFetch<Order[]>(["orders", page, limit,status, finStatus, carryStatus, realCarryStatus, source, query], async () =>
        OrderService.getOrderService(page, limit, status, finStatus, carryStatus, realCarryStatus, source, query)
    );
  };


export const useGetOrderData = (status?: string, finStatus?: string, carryStatus?: string, realCarryStatus?: string, source?: string, query?: string) => {
    return useFetch<Data>(["data", status, finStatus, carryStatus, realCarryStatus, source, query], async () =>
        OrderService.getOrderDataService(status, finStatus, carryStatus, realCarryStatus, source, query)
    );
  };

export const useGetDetailOrder = (orderId: string) => {
    return useFetch<Order>(["detail", orderId], async () =>
        OrderService.getDetailOrderService(orderId)
    );
  };

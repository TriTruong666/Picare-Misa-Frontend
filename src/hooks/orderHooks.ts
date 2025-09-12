import * as OrderService from "@/services/orderService"
import { useFetch } from "./useFetch";
import { Order } from "@/interfaces/Order";

type Data = {
    count: number,
    page: number,
    totalPage: number,
}

export const useGetOrders = (page: number, limit: number, status: boolean, finStatus?: string, carryStatus?: string) => {
    return useFetch<Order[]>(["orders", page, limit,status, finStatus, carryStatus], async () =>
        OrderService.getOrderService(page, limit, status, finStatus, carryStatus)
    );
  };


  export const useGetOrderData = (status: boolean, finStatus?: string, carryStatus?: string) => {
    return useFetch<Data>(["data", status, finStatus, carryStatus], async () =>
        OrderService.getOrderData(status, finStatus, carryStatus)
    );
  };

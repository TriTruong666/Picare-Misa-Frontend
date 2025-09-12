import * as OrderService from "@/services/orderService"
import { useFetch } from "./useFetch";
import { Order } from "@/interfaces/Order";

type Data = {
    count: number,
    page: number,
    totalPage: number,
}

export const useGetOrders = (page: number, limit: number) => {
    return useFetch<Order[]>(["orders", page, limit], async () =>
        OrderService.getOrderService(page, limit)
    );
  };


  export const useGetOrderData = () => {
    return useFetch<Data>(["data"], async () =>
        OrderService.getOrderData()
    );
  };

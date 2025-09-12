"use client";

import { Pagination } from "@heroui/react";
import { TbFileExport } from "react-icons/tb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Order } from "@/interfaces/Order";
import { formatPrice, relativeTime } from "@/utils/format";
import { useState } from "react";
import { useGetOrderData, useGetOrders } from "@/hooks/orderHooks";

import { TableOrderLoader } from "@/components/loading";
import { EmptyCompleteOrder } from "@/components/empty";

export default function Page() {
  const [status] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const { data: orderData } = useGetOrderData(status);
  const totalPage = Math.ceil((orderData?.count as number) / limit);
  const { data: orders = [], isLoading: isLoadingOrder } = useGetOrders(
    page,
    limit,
    status
  );

  return (
    <div className="relative flex flex-col w-full min-h-full">
      {/* Main */}
      <div className="flex flex-col w-full bg-white rounded-[15px] px-[20px] py-[20px] shadow gap-y-[30px] h-full">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-[19px] text-black/80">
            Đơn đã được xử lý
          </h2>
          <div className="flex items-center gap-x-[10px]">
            <div className="flex items-center gap-x-[7px] px-[15px] py-[7px] shadow-2xl border border-neutral-600/30 rounded-[10px] cursor-pointer">
              <TbFileExport className="text-black/70 text-[15px]" />
              <p className="text-[12px] text-black/70 select-none">
                Xuất dữ liệu
              </p>
            </div>
          </div>
        </div>
        {/* Nav */}

        {/* Table */}
        {isLoadingOrder ? (
          <>
            <div className="">
              <TableOrderLoader />
            </div>
          </>
        ) : orders.length === 0 ? (
          <>
            <div className="">
              <EmptyCompleteOrder />
            </div>
          </>
        ) : (
          <>
            <table>
              <thead>
                <tr className="border border-black/10 grid grid-cols-12">
                  <th className="text-start font-semibold border-r border-black/10 text-[14px] py-[10px] text-black/70 col-span-3 px-[25px] flex gap-x-[10px] items-center">
                    <p className="text-custom-primary">Mã đơn hàng</p>
                  </th>

                  <th className="text-start font-semibold border-r border-black/10 text-[14px] py-[10px] text-black/70 max-desktop:col-span-2 desktop:col-span-2 px-[25px]">
                    Ngày tạo
                  </th>
                  <th className="text-start font-semibold border-r border-black/10 text-[14px] py-[10px] text-black/70 col-span-2 px-[25px]">
                    Thanh toán
                  </th>
                  <th className="text-start font-semibold border-r border-black/10 text-[14px] py-[10px] text-black/70 col-span-2 px-[25px]">
                    Giao hàng
                  </th>
                  <th className="text-start font-semibold border-r border-black/10 text-[14px] py-[10px] text-black/70 desktop:col-span-1 max-desktop:col-span-2 px-[25px]">
                    Tổng tiền
                  </th>
                  <th className="text-start font-semibold text-[14px] py-[10px] text-black/70 max-desktop:col-span-1 desktop:col-span-2 px-[25px]">
                    Sàn
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => {
                  return <OrderItem key={order.orderId} {...order} />;
                })}
              </tbody>
            </table>
            <div className="flex">
              <Pagination
                isCompact
                showControls
                onChange={(value) => {
                  setPage(value);
                }}
                initialPage={page}
                total={totalPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function OrderItem({
  orderId,
  saleDate,
  carrierStatus,
  financialStatus,
  cancelledStatus,
  source,
  totalPrice,
}: Order) {
  const mappedFinancialTitle: Record<Order["financialStatus"], string> = {
    pending: "Chờ xử lý",
    paid: "Đã thanh toán",
    partially_paid: "Thanh toán một phần",
    refunded: "Đã hoàn tiền",
    voided: "Đã hủy",
    partially_refunded: "Hoàn tiền một phần",
  };

  const mappedFinancialClass: Record<Order["financialStatus"], string> = {
    pending: "text-blue-500",
    paid: "text-green-500",
    partially_paid: "text-orange-500",
    refunded: "text-purple-500",
    voided: "text-red-500",
    partially_refunded: "text-pink-500",
  };

  const mappedCarrierTitle: Record<Order["carrierStatus"], string> = {
    not_deliver: "Chưa giao hàng",
    delivering: "Đang giao hàng",
    readytopick: "Chờ lấy hàng",
    delivered: "Đã giao",
    return: "Trả hàng",
  };

  const mappedCarrierClass: Record<Order["carrierStatus"], string> = {
    not_deliver: "text-yellow-700",
    delivering: "text-blue-500",
    readytopick: "text-pink-700",
    delivered: "text-green-500",
    return: "text-purple-500",
  };

  const isCancelled = cancelledStatus === "cancelled";

  return (
    <tr
      className={`border-x border-b border-black/10 grid grid-cols-12 ${
        isCancelled ? "bg-red-500 text-white" : ""
      }`}
    >
      <td className="text-start font-semibold border-r border-black/10 text-[14px] py-[13px] col-span-3 px-[25px] flex gap-x-[10px] items-center">
        <Link
          href={`/dashboard/order/detail?orderId=${orderId}`}
          className={`underline underline-offset-4 text-custom-primary`}
        >
          {orderId}
        </Link>
      </td>
      <td className="text-start font-semibold border-r border-black/10 text-[14px] py-[13px] max-desktop:col-span-2 desktop:col-span-2 px-[25px] flex items-center">
        {relativeTime(saleDate)}
      </td>
      <td className="text-start font-semibold border-r border-black/10 text-[14px] py-[13px] col-span-2 px-[25px] flex items-center">
        {isCancelled ? (
          "Đã hủy"
        ) : (
          <p className={`${mappedFinancialClass[financialStatus]}`}>
            {mappedFinancialTitle[financialStatus]}
          </p>
        )}
      </td>
      <td className="text-start font-semibold border-r border-black/10 text-[14px] py-[13px] col-span-2 px-[25px] flex items-center">
        {isCancelled ? (
          "Đã hủy"
        ) : (
          <p className={`${mappedCarrierClass[carrierStatus]}`}>
            {mappedCarrierTitle[carrierStatus]}
          </p>
        )}
      </td>
      <td className="text-start font-semibold border-r border-black/10 text-[14px] py-[13px] desktop:col-span-1 max-desktop:col-span-2 px-[25px] flex items-center">
        {formatPrice(totalPrice)}
      </td>
      <td className="text-start font-semibold text-[14px] py-[13px] max-desktop:col-span-1 desktop:col-span-2 px-[25px] flex items-center">
        {source}
      </td>
    </tr>
  );
}

type NavLinkItemProps = {
  title: string;
  href: string;
};

function NavLinkItem({ title, href }: NavLinkItemProps) {
  const pathName = usePathname();
  const isActive = pathName === href;
  return (
    <Link
      href={href}
      className={`rounded-full px-[25px] py-[5px] ${
        isActive ? "bg-white shadow-2xl" : ""
      }`}
    >
      <p
        className={`text-[13px] text-center ${
          isActive ? "text-black font-semibold" : "text-black/70"
        }`}
      >
        {title}
      </p>
    </Link>
  );
}

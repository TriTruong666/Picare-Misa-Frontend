"use client";

import {
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
} from "@heroui/react";
import { LuClipboardCheck } from "react-icons/lu";
import { IoSyncOutline } from "react-icons/io5";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Order } from "@/interfaces/Order";
import { formatPrice, relativeTime } from "@/utils/format";
import { useEffect, useState } from "react";
import { useGetOrderData, useGetOrders } from "@/hooks/orderHooks";
import { useMutation } from "@tanstack/react-query";
import {
  syncOrderService,
  updateStatusOrderService,
} from "@/services/orderService";
import { showToast } from "@/utils/toast";
import { SyncOrderLoader, TableOrderLoader } from "@/components/loading";
import { UpdateOrder } from "@/interfaces/Service";
import { EmptyOrder } from "@/components/empty";
import OrderSearchBar from "@/components/searchBar";
import { SyncModal } from "@/components/modal";
import { useSetAtom } from "jotai";
import { syncModalState } from "@/atoms/modal-atoms";

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const financialStatus = searchParams.get("financialStatus");
  const carrierStatus = searchParams.get("carrierStatus");
  const realCarrierStatus = searchParams.get("realCarrierStatus");
  const source = searchParams.get("source");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [status] = useState("pending");
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const setIsLoadingSync = useSetAtom(syncModalState);
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: orderData } = useGetOrderData(
    status as string,
    financialStatus as string,
    carrierStatus as string,
    realCarrierStatus as string,
    source as string,
    query as string
  );
  const totalPage = Math.max(
    1,
    Math.ceil(((orderData?.count as number) || 0) / limit)
  );
  const {
    data: orders = [],
    isLoading: isLoadingOrder,
    refetch,
  } = useGetOrders(
    page,
    limit,
    status as string,
    financialStatus as string,
    carrierStatus as string,
    realCarrierStatus as string,
    source as string,
    query as string
  );

  const items = [
    {
      title: `Tất cả`,
      href: "/dashboard/order",
    },
    {
      title: "Có thể xuất hoá đơn",
      href: "/dashboard/order?carrierStatus=delivered&realCarrierStatus=success",
    },
    {
      title: "Có thể xuất kho",
      href: "/dashboard/order?realCarrierStatus=success&carrierStatus=readytopick,delivering",
    },
    {
      title: "Đã thanh toán",
      href: "/dashboard/order?financialStatus=paid",
    },
  ];

  // mutation

  const updateMutation = useMutation({
    mutationKey: ["update-order"],
    mutationFn: async ({
      orderId,
      data,
    }: {
      orderId: string;
      data: UpdateOrder;
    }) => updateStatusOrderService(orderId, data),
    onMutate() {
      setIsUpdating(true);
    },
    onSuccess() {
      setIsUpdating(false);
    },
    onError() {
      showToast({
        content: "Đã có lỗi xảy ra, vui lòng thử lại",
        status: "danger",
      });
    },
  });

  // Function
  const selectableOrders =
    orders?.filter(
      (o) =>
        o.cancelledStatus !== "cancelled" &&
        o.realCarrierStatus === "success" &&
        o.carrierStatus === "delivered"
    ) ?? [];

  const isAllChecked =
    selectableOrders.length > 0 &&
    selectedOrders.length === selectableOrders.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(selectableOrders.map((o) => o.orderId));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleToggleOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkUpdate = async () => {
    try {
      await Promise.all(
        selectedOrders.map((orderId) => {
          const order = orders.find((o) => o.orderId === orderId);

          const data: UpdateOrder =
            order?.realCarrierStatus === "success" &&
            order?.carrierStatus === "delivered"
              ? { status: "invoice" }
              : { status: "stock" };

          return updateMutation.mutateAsync({
            orderId,
            data,
          });
        })
      );

      showToast({
        content: "Cập nhật trạng thái thành công",
        status: "success",
        variant: "flat",
      });

      refetch();
      setSelectedOrders([]);
    } catch (error) {
      showToast({
        content: "Có lỗi xảy ra khi cập nhật trạng thái",
        status: "danger",
        variant: "flat",
      });
    }
  };

  useEffect(() => {
    if (query) {
      setPage(1);
    }
  }, [query]);

  return (
    <>
      <SyncModal />
      <div
        className={`relative flex flex-col w-full min-h-full ${
          (orders ?? []).length === 0 && "h-full"
        }`}
      >
        {/* Main */}
        <div className="flex flex-col w-full bg-white rounded-[15px] px-[20px] py-[20px] shadow gap-y-[30px] h-full">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-[19px] text-black/80">
              Quản lý đơn sàn
            </h2>
            <div className="flex items-center gap-x-[10px]">
              <div
                onClick={() => setIsLoadingSync(true)}
                className="flex items-center gap-x-[7px] px-[15px] py-[7px] border border-neutral-600/30 rounded-[10px] cursor-pointer"
              >
                <IoSyncOutline className="text-black/70 text-[15px]" />
                <p className="text-[12px] text-black/70 select-none">
                  Đồng bộ dữ liệu
                </p>
              </div>
            </div>
          </div>
          {/* Nav */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-[15px]">
              <div className="flex items-center rounded-full px-[7px] py-[5px] bg-neutral-400/40 gap-x-[5px]">
                {items.map((item, idx) => {
                  return (
                    <NavLinkItem
                      key={idx}
                      {...item}
                      onClick={() => {
                        setPage(1);
                        setSelectedOrders([]);
                      }}
                    />
                  );
                })}
              </div>
              <div className="">
                {selectedOrders.length > 0 && (
                  <Dropdown>
                    <DropdownTrigger>
                      <h2 className="text-sm underline underline-offset-4 cursor-pointer font-bold">
                        {selectedOrders.length} đã chọn
                      </h2>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        onPress={handleBulkUpdate}
                        color="success"
                        variant="flat"
                        key="check-order"
                        startContent={<LuClipboardCheck />}
                      >
                        <p className="font-manrope">
                          Xử lý in hoá đơn hàng loạt
                        </p>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
              </div>
            </div>
            {/* Search Order */}
            <div className="flex items-center">
              <OrderSearchBar />
            </div>
          </div>
          {/* Table */}
          {isLoadingOrder ? (
            <>
              <div className="">
                <TableOrderLoader />
              </div>
            </>
          ) : isUpdating ? (
            <>
              <div className="">
                <TableOrderLoader />
              </div>
            </>
          ) : orders.length === 0 ? (
            <>
              <div className="">
                <EmptyOrder />
              </div>
            </>
          ) : (
            <>
              <table>
                <thead>
                  <tr className="border border-black/10 grid grid-cols-12">
                    <th className="text-start font-semibold border-r border-black/10 text-[14px] py-[10px] text-black/70 col-span-3 px-[25px] flex gap-x-[10px] items-center">
                      <Checkbox
                        size="sm"
                        color="primary"
                        radius="sm"
                        isSelected={isAllChecked}
                        onValueChange={handleSelectAll}
                      />
                      <p className="text-black/70">Mã đơn hàng</p>
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
                    <th className="text-start font-semibold border-r border-black/10 text-[14px] py-[10px] text-black/70 desktop:col-span-2 max-desktop:col-span-2 px-[25px]">
                      Tổng tiền
                    </th>
                    <th className="text-start font-semibold text-[14px] py-[10px] text-black/70 max-desktop:col-span-1 desktop:col-span-1 px-[25px]">
                      Sàn
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order) => {
                    return (
                      <OrderItem
                        checked={selectedOrders.includes(order.orderId)}
                        onToggle={handleToggleOrder}
                        key={order.orderId}
                        {...order}
                      />
                    );
                  })}
                </tbody>
              </table>
              {(orders ?? []).length > 0 && (
                <div className="flex">
                  <Pagination
                    isCompact
                    showControls
                    onChange={(value) => {
                      setPage(value);
                      setSelectedOrders([]);
                    }}
                    page={page}
                    total={totalPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function OrderItem({
  orderId,
  saleDate,
  carrierStatus,
  financialStatus,
  cancelledStatus,
  realCarrierStatus,
  source,
  onToggle,
  checked,
  totalPrice,
}: Order & {
  checked: boolean;
  onToggle: (id: string, checked: boolean) => void;
}) {
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
        {carrierStatus === "delivered" && realCarrierStatus === "success" && (
          <Checkbox
            size="sm"
            color={isCancelled ? "default" : "primary"}
            radius="sm"
            isDisabled={isCancelled}
            isSelected={checked}
            onValueChange={(value) => onToggle(orderId, value)}
          />
        )}
        <Link
          href={`/dashboard/order/detail/${orderId}`}
          className={`underline underline-offset-4 ${
            isCancelled ? "text-white" : "text-black/70"
          }`}
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
          <>
            {carrierStatus === "readytopick" &&
              realCarrierStatus === "success" && (
                <p className={`${mappedCarrierClass[carrierStatus]}`}>
                  {mappedCarrierTitle[carrierStatus]} (Kho)
                </p>
              )}
            {carrierStatus === "delivering" &&
              realCarrierStatus === "success" && (
                <p className={`${mappedCarrierClass[carrierStatus]}`}>
                  {mappedCarrierTitle[carrierStatus]} (Kho)
                </p>
              )}
            {carrierStatus === "delivered" &&
              realCarrierStatus === "success" && (
                <p className={`${mappedCarrierClass[carrierStatus]}`}>
                  {mappedCarrierTitle[carrierStatus]} (Hoá đơn)
                </p>
              )}
            {carrierStatus !== "readytopick" &&
              carrierStatus !== "delivering" &&
              carrierStatus !== "delivered" && (
                <p className={`${mappedCarrierClass[carrierStatus]}`}>
                  {mappedCarrierTitle[carrierStatus]}
                </p>
              )}
          </>
        )}
      </td>
      <td className="text-start font-semibold border-r border-black/10 text-[14px] py-[13px] desktop:col-span-2 max-desktop:col-span-2 px-[25px] flex items-center">
        {formatPrice(totalPrice)}
      </td>
      <td className="text-start font-semibold text-[14px] py-[13px] max-desktop:col-span-1 desktop:col-span-1 px-[25px] flex items-center">
        {source}
      </td>
    </tr>
  );
}

type NavLinkItemProps = {
  title: string;
  href: string;
  onClick?(): void;
};

function NavLinkItem({ title, href, onClick }: NavLinkItemProps) {
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const url = new URL(href, "http://localhost:3000");
  const hrefPath = url.pathname;
  const hrefParams = new URLSearchParams(url.search);

  // chỉ active khi path + query trùng
  const isActive =
    pathName === hrefPath &&
    Array.from(hrefParams.entries()).every(
      ([key, value]) => searchParams.get(key) === value
    ) &&
    // đồng thời đảm bảo không thừa param khác
    hrefParams.toString() === searchParams.toString();

  return (
    <Link
      href={href}
      onClick={onClick}
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

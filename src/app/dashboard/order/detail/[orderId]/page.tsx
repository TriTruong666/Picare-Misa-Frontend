"use client";

import { IoIosArrowBack } from "react-icons/io";
import { useGetDetailOrder } from "@/hooks/orderHooks";
import { Button, Chip } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { formatDateAndTime, formatPrice } from "@/utils/format";
import { Order } from "@/interfaces/Order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatusOrderService } from "@/services/orderService";
import { UpdateOrder } from "@/interfaces/Service";
import { showToast } from "@/utils/toast";
import { useAtom, useSetAtom } from "jotai";
import { invoiceModalState, scanModalState } from "@/atoms/modal-atoms";
import { ConfirmInvoiceModal, ScanModal } from "@/components/modal";

export default function Page() {
  const navigate = useRouter();
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;
  const setIsToggleScanModal = useSetAtom(scanModalState);
  const setIsToggleInvoiceModal = useSetAtom(invoiceModalState);
  const { data: detail } = useGetDetailOrder(orderId as string);
  const totalQuantity = (detail?.line_items ?? []).reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationKey: ["update-order"],
    mutationFn: async ({
      orderId,
      data,
    }: {
      orderId: string;
      data: UpdateOrder;
    }) => updateStatusOrderService(orderId, data),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["detail"],
      });
    },
    onError() {
      showToast({
        content: "Đã có lỗi xảy ra, vui lòng thử lại",
        status: "danger",
      });
    },
  });

  const handleUpdateOrderStatus = async (status: string) => {
    try {
      await updateMutation.mutateAsync({
        orderId: orderId,
        data: {
          status: status,
        },
      });
    } catch (error) {
      showToast({
        content: "Có lỗi xảy ra khi cập nhật trạng thái",
        status: "danger",
        variant: "flat",
      });
    }
  };

  const statusMap: Record<Order["status"], string> = {
    pending: "Chờ xử lý",
    invoice: "Đã xử lý hoá đơn",
    stock: "Đã xử lý kho",
  };

  const statusClassMap: Record<Order["status"], string> = {
    pending: "bg-neutral-600/30 text-black/70",
    invoice: "bg-success-400/50 text-success-600",
    stock: "bg-warning-400/50 text-warning-700",
  };

  return (
    <>
      <ScanModal
        isFast={detail?.isSPXFast as string}
        currentId={detail?.orderId as string}
      />
      <ConfirmInvoiceModal />
      <div className="flex w-full min-h-full gap-x-[30px]">
        {/* Line Items */}
        <div className="relative flex flex-col w-[70%]">
          <div className="flex flex-col w-full bg-white rounded-[15px] px-[20px] py-[20px] shadow gap-y-[30px] h-full">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-x-[15px]">
                <Button
                  onPress={() => navigate.back()}
                  isIconOnly
                  radius="full"
                  size="md"
                >
                  <IoIosArrowBack className="text-[18px]" />
                </Button>
                <div className="flex flex-col">
                  <div className="flex items-center gap-x-[15px]">
                    <h2 className="font-semibold text-[19px] text-black/80">
                      Mã đơn hàng &gt; {orderId}
                    </h2>
                    <Chip
                      size="sm"
                      variant="flat"
                      className={`${
                        detail?.status
                          ? statusClassMap[detail.status]
                          : "bg-neutral-600/30 text-black/70"
                      }`}
                    >
                      {detail?.status ? statusMap[detail.status] : "Chưa xử lý"}
                    </Chip>
                  </div>
                  <p className="text-[13px] text-black/70">
                    {formatDateAndTime(detail?.saleDate as string)} /{" "}
                    <span className="font-bold">Sàn {detail?.source}</span>
                  </p>
                </div>
              </div>
            </div>
            {/* Product */}
            <div className="flex flex-col mt-[20px]">
              <table>
                <thead>
                  <tr className="border border-black/10 grid grid-cols-12">
                    <th className="text-start font-semibold border-r border-black/10 text-[14px] py-[10px] text-black/70 col-span-7 px-[25px]">
                      Tên sản phẩm
                    </th>
                    <th className="text-center font-semibold border-r border-black/10 text-[14px] py-[10px] text-black/70 col-span-2 px-[25px]">
                      Số lượng
                    </th>
                    <th className="text-center font-semibold  text-[14px] py-[10px] text-black/70 col-span-3 px-[25px]">
                      Giá tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(detail?.line_items ?? []).map((item, idx) => {
                    return (
                      <tr
                        key={idx}
                        className="border-x border-b border-black/10 grid grid-cols-12"
                      >
                        <td className="text-start font-semibold border-r border-black/10 text-[14px] py-[13px] col-span-7 px-[25px] flex items-center">
                          <p className="leading-6 font-normal">
                            {item.productName}{" "}
                            <span className="text-black/70 font-bold">
                              ({item.sku})
                            </span>
                          </p>
                        </td>
                        <td className="text-center font-semibold border-r border-black/10 text-[14px] py-[13px] col-span-2 px-[25px] flex items-center justify-center">
                          <p>{item.qty}</p>
                        </td>
                        <td className="text-center font-semibold text-[14px] py-[13px] col-span-3 px-[25px] flex items-center justify-center">
                          <p>{formatPrice(item.price)}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between mt-[20px] ml-[10px]">
              <div className="flex flex-col gap-y-[20px]">
                <div className="flex items-center justify-between w-[400px]">
                  <p className="text-[14px]">Số lượng sản phẩm</p>
                  <p className="text-[14px]">{totalQuantity}</p>
                </div>
                <div className="flex items-center justify-between w-[400px]">
                  <p className="text-[14px]">Tổng tiền hàng</p>
                  <p className="text-[14px]">
                    {formatPrice(detail?.totalLineItemPrice as number)}
                  </p>
                </div>
                <div className="flex items-center justify-between w-[400px]">
                  <p className="text-[14px]">Giảm giá</p>
                  <p className="text-[14px]">
                    {formatPrice(detail?.totalDiscountPrice as number)}
                  </p>
                </div>
                <div className="flex items-center justify-between w-[400px] mt-[10px]">
                  <p className="text-[14px] font-bold">Tổng giá trị đơn hàng</p>
                  <p className="text-[14px] font-bold">
                    {formatPrice(detail?.totalPrice as number)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex flex-col w-[30%]">
          <div className="flex flex-col w-full bg-white rounded-[15px] px-[20px] py-[20px] shadow gap-y-[30px]">
            <h2 className="text-[15px] font-bold">Thông tin đơn hàng</h2>
            <div className="flex flex-col gap-y-[25px]">
              <div className="flex items-center justify-between">
                <p className="text-sm">Mã đơn</p>
                <p className="text-sm font-semibold">#{orderId}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Ngày tạo</p>
                <p className="text-sm font-semibold">
                  {formatDateAndTime(detail?.saleDate as string)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Sàn</p>
                <p className="text-sm font-semibold">{detail?.source}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Mã vận đơn</p>
                <p className="text-sm font-semibold text-red-500">
                  {detail?.trackingNumber || "Chưa giao đơn"}
                </p>
              </div>
            </div>

            {detail?.carrierStatus === "delivered" &&
              detail?.realCarrierStatus === "success" && (
                <>
                  {detail.status === "invoice" ? (
                    <></>
                  ) : (
                    <>
                      <Button
                        onPress={() => setIsToggleInvoiceModal(true)}
                        color="success"
                        variant="flat"
                      >
                        Xuất hoá đơn
                      </Button>
                    </>
                  )}
                </>
              )}
            {detail?.carrierStatus === "delivering" &&
              detail?.realCarrierStatus === "success" && (
                <>
                  {detail.status === "stock" ? (
                    <></>
                  ) : (
                    <>
                      <Button
                        onPress={() => setIsToggleScanModal(true)}
                        color="warning"
                        variant="flat"
                      >
                        Xuất kho
                      </Button>
                    </>
                  )}
                </>
              )}
            {detail?.carrierStatus === "readytopick" &&
              detail?.realCarrierStatus === "success" && (
                <>
                  {detail.status === "stock" ? (
                    <></>
                  ) : (
                    <>
                      <Button
                        onPress={() => setIsToggleScanModal(true)}
                        color="warning"
                        variant="flat"
                      >
                        Xuất kho
                      </Button>
                    </>
                  )}
                </>
              )}
          </div>
        </div>
      </div>
    </>
  );
}

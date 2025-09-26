"use client";

import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/utils/toast";
import { scanBarcodeService } from "@/services/orderService";
import { scanDataState } from "@/atoms/service-atoms";
import { postActivityLogService } from "@/services/activityService";
import { useGetOwnerInfo } from "@/hooks/userHooks";

export default function Page() {
  const { data: info } = useGetOwnerInfo();
  const [isFast, setIsFast] = useState("normal");
  const [scanData, setScanData] = useAtom(scanDataState);
  const inputRef = useRef<HTMLInputElement>(null);

  const sourceMenu = [
    {
      title: "Đơn thường",
      isActive: isFast === "normal",
      onClick: () => {
        setIsFast("normal");
        setScanData({ orderId: "", trackingNumber: "" });
      },
    },
    {
      title: "Đơn hoả tốc",
      isActive: isFast === "fast",
      onClick: () => {
        setIsFast("fast");
        setScanData({ orderId: "", trackingNumber: "" });
      },
    },
  ];

  const queryClient = useQueryClient();
  const activityLogMutation = useMutation({
    mutationKey: ["log"],
    mutationFn: postActivityLogService,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["activity-log"],
      });
    },
  });

  const scanMutation = useMutation({
    mutationKey: ["scan"],
    mutationFn: ({ isFast, data }: { isFast: string; data: typeof scanData }) =>
      scanBarcodeService(isFast, data),
    onSuccess(data, variables) {
      if (data.message === "Quét barcode thành công") {
        showToast({
          content: data.message,
          status: "success",
        });
        activityLogMutation.mutate({
          type: "stock",
          userId: info?.userId,
          note:
            variables.data.orderId ||
            `${variables.data.trackingNumber} (Đơn thường)`,
        });
      }
      if (data.message === "Đơn này chỉ có thể xuất hoá đơn") {
        showToast({
          content: data.message,
          status: "warning",
        });
      }
      if (data.message === "Đơn này đã được xuất hoá đơn") {
        showToast({
          content: data.message,
          status: "warning",
        });
      }
      if (data.message === "Đơn hàng này đã quét rồi") {
        showToast({
          content: data.message,
          status: "warning",
        });
      }
      if (data.message === "Không tìm thấy đơn hàng này") {
        showToast({
          content: data.message,
          status: "danger",
        });
      }
      inputRef.current?.focus();
    },
  });

  // Bắt barcode từ scanner
  useEffect(() => {
    inputRef.current?.focus();
    let buffer = "";
    let lastTime = Date.now();

    const handleKeyPress = (e: KeyboardEvent) => {
      const now = Date.now();
      if (now - lastTime > 100) buffer = "";
      lastTime = now;

      if (e.key === "Enter") {
        if (buffer.length > 0) {
          if (isFast === "fast") {
            setScanData({ orderId: buffer, trackingNumber: "" });
            scanMutation.mutate({
              isFast: isFast,
              data: { orderId: buffer, trackingNumber: "" },
            });
          } else {
            setScanData({ orderId: "", trackingNumber: buffer });
            scanMutation.mutate({
              isFast: isFast,
              data: { orderId: "", trackingNumber: buffer },
            });
          }
          buffer = "";
        }
      } else {
        buffer += e.key;
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [scanMutation, isFast, setScanData]);

  return (
    <div className="relative flex flex-col w-full h-full min-h-full">
      <div className="flex flex-col w-full bg-white rounded-[15px] px-[20px] py-[20px] shadow gap-y-[30px] h-full">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-[19px] text-black/80">
            Hệ thống quét barcode
          </h2>
        </div>
        <div className="">
          <div className="flex w-fit items-center rounded-full px-[7px] py-[5px] bg-neutral-400/40 gap-x-[5px]">
            {sourceMenu.map((item, idx) => {
              return <SourceItem key={idx} {...item} />;
            })}
          </div>
        </div>
        <div className="flex flex-col items-center mt-[180px]">
          <div className="flex flex-col gap-y-[5px]">
            <input
              ref={inputRef}
              type="text"
              value={
                isFast === "fast" ? scanData.orderId : scanData.trackingNumber
              }
              readOnly
              placeholder="Quét Barcode tại đây"
              className="w-[500px] outline-none cursor-not-allowed border border-black/20 px-[14px] py-[9px] rounded-[10px] text-[14px] transition-all duration-300 focus:border-black/50"
            />
            <p className="text-[12px] text-black/50 ml-[5px]">
              Khi bạn quét Barcode, hệ thống sẽ tự động xử lý đơn hàng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

type SourceItemProps = {
  title: string;
  onClick?(): void;
  isActive?: boolean;
};

function SourceItem({ title, onClick, isActive = false }: SourceItemProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-full cursor-pointer px-[25px] py-[5px] ${
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
    </div>
  );
}

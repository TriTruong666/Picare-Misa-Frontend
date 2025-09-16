"use client";

import { scanBarcodeService } from "@/services/orderService";
import { showToast } from "@/utils/toast";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";

export default function Page() {
  const [barcode, setBarcode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const scanMutation = useMutation({
    mutationKey: ["scan"],
    mutationFn: scanBarcodeService,
    onSuccess(data) {
      if (data.message === "Quét barcode thành công") {
        showToast({
          content: `Đã cập nhật trạng thái đơn ${data.order?.orderId}`,
          status: "success",
        });
      } else if (data.message === "Không tìm thấy đơn hàng này") {
        showToast({
          content: data.message,
          status: "danger",
        });
      } else if (data.message === "Đơn hàng này đã quét rồi") {
        showToast({
          content: data.message,
          status: "warning",
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
      if (now - lastTime > 100) buffer = ""; // reset buffer nếu quá lâu
      lastTime = now;

      if (e.key === "Enter") {
        if (buffer.length > 0) {
          setBarcode(buffer); // set state
          scanMutation.mutate({
            trackingNumber: buffer,
          }); // gọi API
          buffer = "";
        }
      } else {
        buffer += e.key;
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [scanMutation]);

  return (
    <div className="relative flex flex-col w-full h-full min-h-full">
      <div className="flex flex-col w-full bg-white rounded-[15px] px-[20px] py-[20px] shadow gap-y-[30px] h-full">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-[19px] text-black/80">
            Hệ thống quét barcode
          </h2>
        </div>
        <div className="flex flex-col items-center mt-[180px]">
          <div className="flex flex-col gap-y-[5px]">
            <input
              ref={inputRef}
              type="text"
              value={barcode}
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

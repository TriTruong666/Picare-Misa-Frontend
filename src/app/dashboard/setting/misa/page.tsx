"use client";

import { useGetMisaConfig } from "@/hooks/misaHooks";
import { copyToClipBoard } from "@/utils/clipboard";

import { Button } from "@heroui/react";
import { IoClipboardOutline } from "react-icons/io5";
import { GrConnect } from "react-icons/gr";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { connectMisaService } from "@/services/misaService";
import { showToast } from "@/utils/toast";

export default function Page() {
  const { data: config } = useGetMisaConfig();

  const queryClient = useQueryClient();
  const connectMutation = useMutation({
    mutationKey: ["connect-misa"],
    mutationFn: connectMisaService,
    onSuccess(data) {
      if (data.message === "Kết nối thành công tới Misa Amis") {
        showToast({
          content: "Tạo token thành công",
          status: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ["misa-config"],
        });
      }
    },
  });

  const handleMisaConnect = () => {
    connectMutation.mutate();
  };

  return (
    <div className="flex flex-col w-full">
      {/* Config */}
      <div className="flex flex-col gap-y-[10px]">
        <div className="flex justify-between items-center">
          <strong className="text-[15px]">Access Token</strong>
          <div
            onClick={handleMisaConnect}
            className="flex items-center gap-x-[7px] px-[15px] py-[7px] border border-neutral-600/30 rounded-[10px] cursor-pointer"
          >
            <GrConnect className="text-black/70 text-[15px]" />
            <p className="text-[12px] text-black/70 select-none">
              Tạo Token mới
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between px-[15px] py-[12px] bg-neutral-300/30 rounded-[10px]">
          <span className="w-[90%] break-all text-[12px] line-clamp-2 text-black/70">
            {config?.accessToken}
          </span>
          <Button
            onPress={() => copyToClipBoard(config?.accessToken as string)}
            isIconOnly
            variant="light"
          >
            <IoClipboardOutline className="text-[18px] text-black/70" />
          </Button>
        </div>
        <p className="text-[11px] font-semibold text-red-500">
          Lưu ý: Token sẽ tự động refresh mỗi 20 phút và sẽ tự động chạy ngầm
          đồng bộ dữ liệu của Misa, vui lòng chạy thủ công nếu token không hoạt
          động hoặc không tồn tại.
        </p>
      </div>
      {/* Total */}
      <div className="mt-[40px] flex flex-col"></div>
    </div>
  );
}

"use client";

import { useGetMisaConfig } from "@/hooks/misaHooks";
import { copyToClipBoard } from "@/utils/clipboard";
import { HiOutlineDotsVertical } from "react-icons/hi";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import {
  IoClipboardOutline,
  IoRefreshOutline,
  IoSyncOutline,
} from "react-icons/io5";
import { GrConnect } from "react-icons/gr";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  connectMisaService,
  syncDataMisaService,
} from "@/services/misaService";
import { showToast } from "@/utils/toast";
import { useState } from "react";

export default function Page() {
  const { data: config } = useGetMisaConfig();
  const [isLoadingSync, setIsLoadingSync] = useState(false);

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

  const syncAllMisaDataMutation = useMutation({
    mutationKey: ["sync-all-misa-data"],
    mutationFn: syncDataMisaService,
    onMutate() {
      setIsLoadingSync(true);
    },
    onSuccess(data) {
      if (data.message === "Đồng bộ tất cả dữ liệu MISA thành công") {
        showToast({
          content: data.message,
          status: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ["misa-data-count"],
        });
      }
    },
    onError() {
      showToast({
        content: "Đồng bộ dữ liệu thất bại, vui lòng thử lại",
        status: "danger",
      });
    },
  });

  const handleMisaConnect = () => {
    connectMutation.mutate();
  };

  const handleSyncAllMisaData = () => {
    syncAllMisaDataMutation.mutate();
  };

  const handleFirstTimeInitMisa = async () => {
    await connectMutation.mutate();

    setTimeout(async () => {
      await syncAllMisaDataMutation.mutate();
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full">
      {!config?.accessToken ? (
        <>
          <div className="flex flex-col gap-y-[10px] desktop:h-[600px] max-desktop:h-[400px] items-center justify-center">
            <Button
              onPress={handleFirstTimeInitMisa}
              size="lg"
              className="bg-black text-white"
            >
              Nhấn vào đây để kết nối tới Misa
            </Button>
            <span className="text-[14px] text-black/70">
              Hiện tại bạn chưa kết nối với Misa, vui lòng kết nối để đồng bộ dữ
              liệu cho toàn hệ thống
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col">
            <div className="flex flex-col gap-y-[10px]">
              <div className="flex justify-between items-center">
                <strong className="text-[18px]">Cấu hình Misa</strong>

                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="light" size="sm" isIconOnly>
                      <HiOutlineDotsVertical className="text-[18px]" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    itemClasses={{
                      title: "font-manrope text-[13px]",
                    }}
                    variant="flat"
                  >
                    <DropdownItem
                      color="primary"
                      key="connect"
                      startContent={<IoRefreshOutline />}
                    >
                      Tạo mới token
                    </DropdownItem>
                    <DropdownItem
                      color="primary"
                      key="sync"
                      startContent={<IoSyncOutline />}
                    >
                      Đồng bộ dữ liệu
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
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
                Lưu ý: Token sẽ tự động refresh mỗi 20 phút và sẽ tự động chạy
                ngầm đồng bộ dữ liệu của Misa, vui lòng chạy thủ công nếu token
                không hoạt động hoặc không tồn tại.
              </p>
            </div>
          </div>
        </>
      )}
      {/* Config */}
    </div>
  );
}

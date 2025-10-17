"use client";

import { clientDataState } from "@/atoms/client-atoms";
import {
  addAttendanceServerModal,
  blockModalState,
  buildDocumentModalState,
  invoiceModalState,
  scanModalState,
  syncModalState,
} from "@/atoms/modal-atoms";
import { Button, Modal, ModalContent } from "@heroui/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ScanAnimation } from "./animation";
import {
  createAttendanceServerState,
  scanDataState,
} from "@/atoms/service-atoms";
import {
  scanBarcodeService,
  syncOrderService,
  updateStatusOrderService,
} from "@/services/orderService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/utils/toast";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { SyncOrderLoader } from "./loading";
import { UpdateOrder } from "@/interfaces/Service";
import { useParams } from "next/navigation";
import { buildOrderService } from "@/services/misaService";
import { useGetOwnerInfo } from "@/hooks/userHooks";
import { postActivityLogService } from "@/services/activityService";
import { createAttendanceServerService } from "@/services/attendanceService";
import { linkValidation } from "@/utils/validate";

export function BlockModal() {
  const [isToggleModal, setIsToggleModal] = useAtom(blockModalState);
  const setIsToggleScanModal = useSetAtom(scanModalState);
  const clientData = useAtomValue(clientDataState);

  useEffect(() => {
    if (clientData.isBlocked) {
      setIsToggleModal(true);
      setIsToggleScanModal(false);
    } else {
      setIsToggleModal(false);
    }
  }, [clientData.isBlocked]);

  return (
    <Modal
      placement="top"
      backdrop="blur"
      radius="md"
      shadow="md"
      hideCloseButton={true}
      isKeyboardDismissDisabled={true}
      isOpen={isToggleModal}
    >
      <ModalContent>
        <div className="flex flex-col items-center bg-white py-[20px] font-manrope gap-y-[6px]">
          <h1 className="font-bold text-[19px]">
            Hệ thống tạm ngừng hoạt động
          </h1>
          <p className="text-[13px]">
            Quá trình đồng bộ đang diễn ra, vui lòng chờ vài phút...
          </p>
        </div>
      </ModalContent>
    </Modal>
  );
}

type ScanModalProps = {
  isFast: string;
  currentId: string;
};

export function ScanModal({ isFast, currentId }: ScanModalProps) {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;
  const { data: info } = useGetOwnerInfo();
  const [isToggleModal, setIsToggleModal] = useAtom(scanModalState);
  const [scanData, setScanData] = useAtom(scanDataState);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const buildMutation = useMutation({
    mutationKey: ["document", orderId],
    mutationFn: buildOrderService,
    onSuccess(data) {
      if (data.message === "Đẩy đơn hàng sang MISA thành công") {
        queryClient.invalidateQueries({
          queryKey: ["detail"],
        });
        showToast({
          content:
            "Xin chứng từ thành công, vui lòng đợi kết quả tại Misa Amis",
          status: "success",
        });
      }
      setIsToggleModal(false);
    },

    onError() {
      showToast({
        content: "Đã có lỗi xảy ra, vui lòng thử lại",
        status: "danger",
      });
      setIsToggleModal(false);
    },
  });

  const scanMutation = useMutation({
    mutationKey: ["scan"],
    mutationFn: ({ isFast, data }: { isFast: string; data: typeof scanData }) =>
      scanBarcodeService(isFast, data),
    onSuccess(data) {
      if (data.message === "Quét barcode thành công") {
        showToast({
          content: data.message,
          status: "success",
        });
        activityLogMutation.mutate({
          type: "stock",
          userId: info?.userId,
          note: currentId,
        });
        buildMutation.mutate({
          orderId: orderId,
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
      setIsToggleModal(false);
      inputRef.current?.focus();
    },
  });

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
          if (currentId !== buffer) {
            showToast({
              content: "Bạn quét nhầm đơn hàng rồi, vui lòng kiểm tra lại",
              status: "danger",
            });
            return;
          }
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
  }, [scanMutation, isFast, setScanData, currentId]);

  return (
    <Modal
      placement="center"
      backdrop="opaque"
      radius="md"
      shadow="md"
      onClose={() => setIsToggleModal(false)}
      isKeyboardDismissDisabled={true}
      isOpen={isToggleModal}
    >
      <ModalContent>
        <div className="flex flex-col items-center bg-white py-[20px] font-manrope gap-y-[6px]">
          <ScanAnimation />
          <strong className="text-[14px]">
            Vui lòng quét{" "}
            <span className="text-custom-primary">
              {isFast === "fast" ? "Mã đơn hàng" : "Mã vận đơn"}
            </span>{" "}
            để cập nhật trạng thái đơn
          </strong>
          <input ref={inputRef} type="text" readOnly className="hidden" />
        </div>
      </ModalContent>
    </Modal>
  );
}

export function SyncModal() {
  const [isToggleModal, setIsToggleModal] = useAtom(syncModalState);
  const [isLoadingSync, setIsLoadingSync] = useState(false);

  const queryClient = useQueryClient();
  const syncMutation = useMutation({
    mutationKey: ["sync-orders"],
    mutationFn: syncOrderService,
    onMutate() {
      setIsLoadingSync(true);
    },
    onSuccess(data) {
      if (data.message === "Đồng bộ thành công") {
        showToast({
          content: data.message,
          status: "success",
          variant: "flat",
        });
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });
      }
      setIsLoadingSync(false);
      setIsToggleModal(false);
    },
    onError() {
      showToast({
        content: "Quá trình đồng bộ thất bại",
        description: "Vui lòng kiểm tra internet và thử lại",
        status: "danger",
      });
      setIsToggleModal(false);
    },
  });

  const handleSyncOrder = () => {
    syncMutation.mutate();
  };

  return (
    <Modal
      placement="center"
      backdrop="opaque"
      radius="md"
      shadow="md"
      size="2xl"
      hideCloseButton={isLoadingSync}
      isDismissable={!isLoadingSync}
      onClose={() => setIsToggleModal(false)}
      isKeyboardDismissDisabled={true}
      isOpen={isToggleModal}
    >
      <ModalContent>
        {isLoadingSync ? (
          <>
            <div className="flex flex-col !px-[40px] bg-white py-[40px] font-manrope gap-y-[20px]">
              <SyncOrderLoader />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col !px-[40px] bg-white py-[40px] font-manrope gap-y-[20px]">
              <h2 className="text-[22px] font-bold text-center">
                Xác nhận đồng bộ thủ công
              </h2>
              <div className="flex items-center gap-x-[10px] px-[10px] py-[20px] bg-yellow-500/20 rounded-[15px]">
                <IoIosInformationCircleOutline className="text-[30px] text-yellow-600" />
                <p className="text-sm text-yellow-600">
                  Quá trình này sẽ mất một khoảng thời gian, bấm{" "}
                  <span className="font-bold">Xác Nhận</span> sẽ gửi thông báo
                  cho toàn bộ hệ thống !
                </p>
              </div>
              <div className="flex items-center justify-end">
                <Button
                  onPress={handleSyncOrder}
                  size="md"
                  variant="flat"
                  className="w-full bg-black text-black"
                >
                  <p className="!text-[14px] text-white font-bold">
                    Xác Nhận Đồng Bộ
                  </p>
                </Button>
              </div>
            </div>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export function ConfirmInvoiceModal() {
  const { data: info } = useGetOwnerInfo();
  const [isToggleModal, setIsToggleModal] = useAtom(invoiceModalState);
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;

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
  const updateMutation = useMutation({
    mutationKey: ["update-order"],
    mutationFn: async ({
      orderId,
      data,
    }: {
      orderId: string;
      data: UpdateOrder;
    }) => updateStatusOrderService(orderId, data),

    onSuccess(data, variables) {
      queryClient.invalidateQueries({
        queryKey: ["detail"],
      });
      if (data.message === "Cập nhật trạng thái thành công") {
        showToast({
          content: "Xử lý đơn thành công",
          status: "success",
        });
        activityLogMutation.mutate({
          type: "confirm",
          note: variables.orderId,
          userId: info?.userId,
        });
      }
      setIsToggleModal(false);
    },
    onError() {
      showToast({
        content: "Đã có lỗi xảy ra, vui lòng thử lại",
        status: "danger",
      });
      setIsToggleModal(false);
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

  return (
    <Modal
      placement="center"
      backdrop="opaque"
      radius="md"
      shadow="md"
      size="2xl"
      onClose={() => setIsToggleModal(false)}
      isKeyboardDismissDisabled={true}
      isOpen={isToggleModal}
    >
      <ModalContent>
        <div className="flex flex-col !px-[40px] bg-white py-[40px] font-manrope gap-y-[20px]">
          <h2 className="text-[22px] font-bold text-center">
            Xác nhận in hoá đơn
          </h2>
          <div className="flex items-center gap-x-[10px] px-[10px] py-[20px] bg-yellow-500/20 rounded-[15px]">
            <IoIosInformationCircleOutline className="text-[30px] text-yellow-600" />
            <p className="text-sm text-yellow-600">
              Quá trình này chỉ nhằm phân loại đơn và chưa ảnh hưởng tới việc
              xin chứng từ của Misa Amis
            </p>
          </div>
          <div className="flex items-center justify-end">
            <Button
              onPress={() => handleUpdateOrderStatus("invoice")}
              size="md"
              variant="flat"
              className="w-full bg-black text-black"
            >
              <p className="!text-[14px] text-white font-bold">
                Xác Nhận In Hoá Đơn
              </p>
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

export function BuildMisaDocumentModal() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;
  const [isToggleModal, setIsToggleModal] = useAtom(buildDocumentModalState);

  const queryClient = useQueryClient();

  const buildMutation = useMutation({
    mutationKey: ["document", orderId],
    mutationFn: buildOrderService,
    onSuccess(data) {
      if (data.message === "Đẩy đơn hàng sang MISA thành công") {
        queryClient.invalidateQueries({
          queryKey: ["detail"],
        });
        showToast({
          content:
            "Xin chứng từ thành công, vui lòng đợi kết quả tại Misa Amis",
          status: "success",
        });
      }
      setIsToggleModal(false);
    },

    onError() {
      showToast({
        content: "Đã có lỗi xảy ra, vui lòng thử lại",
        status: "danger",
      });
      setIsToggleModal(false);
    },
  });

  const handleBuildDocument = () => {
    buildMutation.mutate({
      orderId: orderId,
    });
  };

  return (
    <Modal
      placement="center"
      backdrop="opaque"
      radius="md"
      shadow="md"
      size="2xl"
      onClose={() => setIsToggleModal(false)}
      isKeyboardDismissDisabled={true}
      isOpen={isToggleModal}
    >
      <ModalContent>
        <div className="flex flex-col !px-[40px] bg-white py-[40px] font-manrope gap-y-[20px]">
          <h2 className="text-[22px] font-bold text-center">
            Xin chứng từ hoá đơn bán hàng
          </h2>
          <div className="flex items-center gap-x-[10px] px-[10px] py-[20px] bg-red-500/20 rounded-[15px]">
            <IoIosInformationCircleOutline className="text-[30px] text-red-600" />
            <p className="text-sm text-red-600">
              Quá trình này sẽ đẩy đơn hàng này lên{" "}
              <span className="font-bold">Misa Amis để xin chứng từ</span>. Vui
              lòng kiểm tra kỹ trước khi lên đơn !!!
            </p>
          </div>
          <div className="flex items-center justify-end">
            <Button
              onPress={handleBuildDocument}
              size="md"
              variant="flat"
              className="w-full bg-black text-black"
            >
              <p className="!text-[14px] text-white font-bold">
                Xác Nhận Xin Chứng Từ
              </p>
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

export function AddAttendanceServerModal() {
  const [isToggleModal, setIsToggleModal] = useAtom(addAttendanceServerModal);
  const [submitData, setSubmitData] = useAtom(createAttendanceServerState);
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationKey: ["create-attendance-server"],
    mutationFn: createAttendanceServerService,
    onSuccess(data) {
      if (data.message === "Tạo máy chủ chấm công thành công") {
        queryClient.invalidateQueries({
          queryKey: ["attendance-server"],
        });
        showToast({
          content: data.message,
          status: "success",
        });
        setIsToggleModal(false);
        setSubmitData({
          domain: "",
          password: "",
          serverName: "",
          username: "",
        });
      }
    },
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSubmitData({
      ...submitData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (
      submitData.domain === "" ||
      submitData.password === "" ||
      submitData.username === "" ||
      submitData.serverName === ""
    ) {
      showToast({
        content: "Vui lòng nhập hết tất cả các trường cần thiết",
        status: "warning",
      });
      return;
    }
    const linkValidate = linkValidation(submitData.domain);
    if (!linkValidate) {
      showToast({
        content: "Vui lòng nhập đúng định dạng của đường link",
        status: "danger",
      });
      return;
    }
    createMutation.mutate(submitData);
  };
  return (
    <Modal
      placement="center"
      backdrop="opaque"
      radius="md"
      shadow="md"
      size="2xl"
      onClose={() => setIsToggleModal(false)}
      isKeyboardDismissDisabled={true}
      isOpen={isToggleModal}
    >
      <ModalContent>
        <div className="flex flex-col !px-[40px] bg-white py-[40px] font-manrope gap-y-[20px]">
          <h2 className="text-[22px] font-bold text-center">
            Thêm máy chủ chấm công
          </h2>
          <div className="flex flex-col gap-y-[15px]">
            <div className="flex flex-col gap-y-[5px]">
              <label
                htmlFor="name"
                className="text-[13px] font-medium text-neutral-800"
              >
                Tên máy chủ
              </label>
              <input
                id="name"
                type="text"
                name="serverName"
                onChange={handleOnChange}
                value={submitData.serverName}
                placeholder="VD: Picare-01"
                className="outline-none text-[13px] px-[15px] py-[10px] transition-all duration-300 rounded-xl border border-neutral-500/30 focus:border-neutral-500"
              />
            </div>
            <div className="flex flex-col gap-y-[5px]">
              <label
                htmlFor="domain"
                className="text-[13px] font-medium text-neutral-800"
              >
                Domain
              </label>
              <input
                id="domain"
                type="text"
                name="domain"
                onChange={handleOnChange}
                value={submitData.domain}
                placeholder="VD: http://171.240.241.233:5000"
                className="outline-none text-[13px] px-[15px] py-[10px] transition-all duration-300 rounded-xl border border-neutral-500/30 focus:border-neutral-500"
              />
              <span className="text-[12px] text-red-600 ml-[5px]">
                Vui lòng copy URL và bỏ dấu / ở phía cuối
              </span>
            </div>
            <div className="flex flex-col gap-y-[5px]">
              <label
                htmlFor="username"
                className="text-[13px] font-medium text-neutral-800"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                onChange={handleOnChange}
                value={submitData.username}
                placeholder="VD: picare123"
                className="outline-none text-[13px] px-[15px] py-[10px] transition-all duration-300 rounded-xl border border-neutral-500/30 focus:border-neutral-500"
              />
            </div>
            <div className="flex flex-col gap-y-[5px]">
              <label
                htmlFor="password"
                className="text-[13px] font-medium text-neutral-800"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                onChange={handleOnChange}
                type="text"
                value={submitData.password}
                placeholder="VD: matkhau123"
                className="outline-none text-[13px] px-[15px] py-[10px] transition-all duration-300 rounded-xl border border-neutral-500/30 focus:border-neutral-500"
              />
            </div>
            <span className="text-[12px] text-red-600 ml-[5px]">
              Nhập đúng để đăng nhập vào Auth Digest của HIKVISION
            </span>
          </div>
          <div className="flex items-center justify-end">
            <Button
              onPress={handleSubmit}
              size="md"
              variant="flat"
              className="w-full bg-black text-black"
            >
              <p className="!text-[14px] text-white font-bold">Xác Nhận Tạo</p>
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

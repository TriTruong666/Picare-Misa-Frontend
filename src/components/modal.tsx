"use client";

import { clientDataState } from "@/atoms/client-atoms";
import { blockModalState, scanModalState } from "@/atoms/modal-atoms";
import { Modal, ModalContent } from "@heroui/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { ScanAnimation } from "./animation";
import { scanDataState } from "@/atoms/service-atoms";
import { scanBarcodeService } from "@/services/orderService";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "@/utils/toast";

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
  const [isToggleModal, setIsToggleModal] = useAtom(scanModalState);
  const [scanData, setScanData] = useAtom(scanDataState);
  const inputRef = useRef<HTMLInputElement>(null);

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

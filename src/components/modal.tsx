"use client";

import { clientDataState } from "@/atoms/client-atoms";
import { blockModalState } from "@/atoms/modal-atoms";
import { Modal, ModalContent } from "@heroui/react";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export function BlockModal() {
  const [isToggleModal, setIsToggleModal] = useAtom(blockModalState);
  const clientData = useAtomValue(clientDataState);

  useEffect(() => {
    if (clientData.isBlocked) {
      setIsToggleModal(true);
    } else {
      setIsToggleModal(false);
    }
  }, [clientData.isBlocked]);

  return (
    <Modal
      placement="top"
      backdrop="blur"
      radius="none"
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

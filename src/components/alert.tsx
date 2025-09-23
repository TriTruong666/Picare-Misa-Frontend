"use client";

import { alertState } from "@/atoms/alert-atoms";
import { clientDataState } from "@/atoms/client-atoms";
import { Alert } from "@heroui/react";
import { useAtom, useAtomValue } from "jotai";

export function EventAlert() {
  const [isVisible, setIsVisible] = useAtom(alertState);
  const eventData = useAtomValue(clientDataState);

  if (!eventData) return null;

  return (
    <div className="">
      <Alert
        radius="none"
        title={eventData.message}
        variant="flat"
        color="default"
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
      />
    </div>
  );
}

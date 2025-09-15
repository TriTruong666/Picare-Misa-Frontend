"use client";

import { alertState } from "@/atoms/alert-atoms";
import { clientDataState } from "@/atoms/client-atoms";
import { Alert } from "@heroui/react";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";

export function EventAlert() {
  const [isVisible, setIsVisible] = useAtom(alertState);
  const eventData = useAtomValue(clientDataState);

  useEffect(() => {
    if (eventData.status === "success") {
      if (typeof window !== "undefined") {
        location.reload();
      }
    }
  }, [eventData]);

  if (!eventData) return null;

  return (
    <div className="">
      <Alert
        title={eventData.message}
        variant="flat"
        color="warning"
        isVisible={isVisible}
        onClose={() => setIsVisible(false)} // tắt alert thủ công
      />
    </div>
  );
}

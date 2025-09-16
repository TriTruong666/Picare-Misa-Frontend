"use client";

import { clientDataState } from "@/atoms/client-atoms";
import { handleReload } from "@/utils/navigate";
import { useAtomValue } from "jotai";
import { useEffect } from "react";

export function SSEHandler() {
  const clientData = useAtomValue(clientDataState);

  useEffect(() => {
    if (clientData.status === "success") {
      handleReload();
    }
  }, [clientData.status]);

  return null;
}

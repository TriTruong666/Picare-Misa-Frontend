"use client";

import { clientDataState } from "@/atoms/client-atoms";
import { alertState } from "@/atoms/alert-atoms";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_TEST_API_URL;

export default function SSEClient() {
  const setClientData = useSetAtom(clientDataState);
  const setIsVisible = useSetAtom(alertState);

  useEffect(() => {
    const eventSource = new EventSource(`${API_URL}/events`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setClientData(data);
      setIsVisible(true); // khi có event thì bật alert
      console.log("🔔 SSE data:", data);
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [setClientData, setIsVisible]);

  return null;
}

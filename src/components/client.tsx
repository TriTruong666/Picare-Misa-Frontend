"use client";

import { clientDataState } from "@/atoms/client-atoms";
import { alertState } from "@/atoms/alert-atoms";
import { useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { showToast } from "@/utils/toast";

const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_TEST_API_URL
    : process.env.NEXT_PUBLIC_API_URL;

export default function SSEClient() {
  const setClientData = useSetAtom(clientDataState);
  const setIsVisible = useSetAtom(alertState);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connect = () => {
      eventSource = new EventSource(`${API_URL}/events`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status === "health") return;
        setClientData(data);
        setIsVisible(true);
      };

      eventSource.onerror = (err) => {
        eventSource?.close();

        if (!reconnectTimeout.current) {
          reconnectTimeout.current = setTimeout(() => {
            showToast({
              content: "Đang cố gắng kết nối lại với server...",
              status: "warning",
            });
            connect();
            reconnectTimeout.current = null;
          }, 5000);
        }
      };
    };

    connect();

    return () => {
      eventSource?.close();
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [setClientData, setIsVisible]);

  return null;
}

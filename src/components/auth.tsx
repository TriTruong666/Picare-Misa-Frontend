"use client";

import { useGetOwnerInfo } from "@/hooks/userHooks";
import { handleGoToRoute } from "@/utils/navigate";
import { useEffect } from "react";

export default function AuthComponent() {
  const { data: info, isLoading: isGetUserInfo } = useGetOwnerInfo();

  useEffect(() => {
    if (isGetUserInfo) return;
    if (!info) {
      handleGoToRoute("/");
    }
  }, [info, isGetUserInfo]);

  return null;
}

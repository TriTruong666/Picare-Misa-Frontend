"use client";

import {
  useGetActivityLog,
  useGetActivityLogData,
} from "@/hooks/activityHooks";
import { ActivityLog } from "@/interfaces/Activity";
import { relativeTime } from "@/utils/format";
import { Pagination } from "@heroui/react";
import { useState } from "react";

export default function Page() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data: activities } = useGetActivityLog(page, limit);
  const { data: activity_data } = useGetActivityLogData(page, limit);

  const totalPage = Math.max(
    1,
    Math.ceil(((activity_data?.count as number) || 0) / limit)
  );

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <strong className="text-[18px]">Hoạt động của người dùng</strong>
        </div>
        {activities?.length === 0 ? (
          <>
            <div className="flex items-center justify-center h-[400px]">
              <p className="text-[14px] text-black/70">
                Hiện tại chưa có hoạt động nào...
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col mt-[40px]">
              {activities?.map((item) => (
                <LogItem key={item.logId} {...item} />
              ))}
              {(activities ?? []).length > 0 && (
                <div className="mt-[40px]">
                  <Pagination
                    isCompact
                    showControls
                    onChange={(value) => setPage(value)}
                    page={page}
                    total={totalPage}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LogItem({ createdAt, name, type, note }: ActivityLog) {
  if (type === "accounting") {
    return (
      <div className="flex items-center justify-between pb-[15px] pt-[12px]">
        <p className="text-sm">
          {name}: {note}
        </p>
        <span className="text-[13px] font-bold">{relativeTime(createdAt)}</span>
      </div>
    );
  }

  if (type === "try-login") {
    return (
      <div className="flex items-center justify-between pb-[15px] pt-[12px]">
        <p className="text-sm text-red-500">
          Ai đó đang cố gắng đăng nhập tại địa chỉ IP: {note}
        </p>
        <span className="text-[13px] font-bold">{relativeTime(createdAt)}</span>
      </div>
    );
  }

  if (type === "logout") {
    return (
      <div className="flex items-center justify-between pb-[15px] pt-[12px]">
        <p className="text-sm">
          <span className="font-semibold">{name}</span> đã đăng xuất khỏi hệ
          thống
        </p>
        <span className="text-[13px] font-bold">{relativeTime(createdAt)}</span>
      </div>
    );
  }

  if (type === "invoice") {
    return (
      <div className="flex items-center justify-between pb-[15px] pt-[12px]">
        <p className="text-sm">
          <span className="font-semibold">{name}</span> đã xin chứng từ của đơn
          hàng <span className="text-custom-primary">#{note}</span>
        </p>
        <span className="text-[13px] font-bold">{relativeTime(createdAt)}</span>
      </div>
    );
  }

  if (type === "confirm") {
    return (
      <div className="flex items-center justify-between pb-[15px] pt-[12px]">
        <p className="text-sm">
          <span className="font-semibold">{name}</span> đã xác nhận in hoá đơn
          đơn hàng <span className="text-custom-primary">#{note}</span>
        </p>
        <span className="text-[13px] font-bold">{relativeTime(createdAt)}</span>
      </div>
    );
  }

  if (type === "stock") {
    return (
      <div className="flex items-center justify-between pb-[15px] pt-[12px]">
        <p className="text-sm">
          <span className="font-semibold">{name}</span> đã quét và xuất kho đơn{" "}
          <span className="text-yellow-500">#{note}</span>
        </p>
        <span className="text-[13px] font-bold">{relativeTime(createdAt)}</span>
      </div>
    );
  }

  return null;
}

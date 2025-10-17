"use client";

import { addAttendanceServerModal } from "@/atoms/modal-atoms";
import { SycnLoader, TableOrderLoader } from "@/components/loading";
import { AddAttendanceServerModal } from "@/components/modal";
import {
  useGetAttendanceData,
  useGetAttendanceEmployee,
  useGetAttendanceServer,
} from "@/hooks/attendanceHooks";
import { AttendanceUser } from "@/interfaces/Attendance";
import { SyncAttendanceData } from "@/interfaces/Service";
import { syncAttendanceDataService } from "@/services/attendanceService";
import { formatDateAndTime } from "@/utils/format";
import { showToast } from "@/utils/toast";
import { Pagination } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { IoSyncOutline } from "react-icons/io5";
import { TiPlusOutline } from "react-icons/ti";

export default function Page() {
  const [isLoadingSync, setIsLoadingSync] = useState(false);
  const setToggleModal = useSetAtom(addAttendanceServerModal);
  const { data: servers = [] } = useGetAttendanceServer();
  const limit = 20;
  const [page, setPage] = useState(1);
  const type = "fingerprint";
  const { data: employees = [], isLoading: isLoadingAttendance } =
    useGetAttendanceEmployee(page, limit, type);
  const { data: attendanceData } = useGetAttendanceData(page, limit, type);
  const totalPage = Math.max(
    1,
    Math.ceil(((attendanceData?.count as number) || 0) / limit)
  );

  const syncMutation = useMutation({
    mutationKey: ["sync-attendance-all"],
    mutationFn: ({ type, data }: { type: string; data?: SyncAttendanceData }) =>
      syncAttendanceDataService(type, data),
    onMutate() {
      setIsLoadingSync(true);
    },

    onSuccess(data) {
      if (data.message === "Không có máy chủ nào để đồng bộ") {
        showToast({
          content: data.message,
          status: "warning",
        });
      }
      if (data.message === "Đã đồng bộ tất cả dữ liệu chấm công thành công") {
        showToast({
          content: data.message,
          status: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      setIsLoadingSync(false);
    },
    onError() {
      showToast({
        content: "Quá trình đồng bộ thất bại",
        description: "Vui lòng kiểm tra internet và thử lại",
        status: "danger",
      });
      setIsLoadingSync(false);
    },
  });

  const handleSyncAttendance = async () => {
    try {
      await syncMutation.mutate({
        type: "all",
        data: {
          serverId: "",
          minor: 75 as number,
        },
      });
      await syncMutation.mutate({
        type: "all",
        data: {
          serverId: "",
          minor: 104 as number,
        },
      });
    } catch (error) {}
  };
  return (
    <>
      <AddAttendanceServerModal />
      <div
        className={`relative flex flex-col w-full min-h-full ${
          (employees ?? []).length === 0 && "h-full"
        }`}
      >
        <div className="flex flex-col w-full bg-white rounded-[15px] px-[20px] py-[20px] shadow gap-y-[30px] h-full">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[19px] text-black/80">
              Quản lý chấm công
            </h2>
            <div className="flex items-center gap-x-[20px]">
              <div
                onClick={() => setToggleModal(true)}
                className="flex items-center gap-x-[7px] px-[15px] py-[7px] border border-neutral-600/30 rounded-[10px] cursor-pointer"
              >
                <TiPlusOutline className="text-black/70 text-[15px]" />
                <p className="text-[12px] text-black/70 select-none">
                  Thêm máy chấm công
                </p>
              </div>
              <div
                onClick={handleSyncAttendance}
                className="flex items-center gap-x-[7px] px-[15px] py-[7px] border border-neutral-600/30 rounded-[10px] cursor-pointer"
              >
                <IoSyncOutline className="text-black/70 text-[15px]" />
                <p className="text-[12px] text-black/70 select-none">
                  Đồng bộ dữ liệu
                </p>
              </div>
            </div>
          </div>
          {/* Nav */}
          <div className="flex justify-between items-center">
            <div className="flex">
              <div className="flex items-center rounded-full px-[7px] py-[5px] bg-neutral-400/40 gap-x-[5px]">
                <NavLinkItem title="Khuôn mặt" href="/dashboard/attendance" />
                <NavLinkItem
                  title="Vân tay"
                  href="/dashboard/attendance/fingerprint"
                />
                {(servers ?? []).map((server) => (
                  <NavLinkItem
                    key={server.serverId}
                    href={`/dashboard/attendance/${server.serverId}`}
                    title={server.serverName}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Table */}
          {isLoadingAttendance ? (
            <>
              <div className="">
                <TableOrderLoader />
              </div>
            </>
          ) : isLoadingSync ? (
            <>
              <SycnLoader />
            </>
          ) : employees.length === 0 ? (
            <>
              <div className="w-full desktop:h-[600px] max-desktop:h-[450px] flex flex-col justify-center items-center gap-y-[15px]">
                <h1 className="text-[15px] font-normal text-black/70">
                  Chưa có ghi nhận chấm công nào...
                </h1>
              </div>
            </>
          ) : (
            <>
              <table>
                <thead>
                  <tr className="border border-black/10 grid grid-cols-12">
                    <th className="text-start font-semibold border-r border-black/10 text-[14px] py-[10px] text-black/70 col-span-3 px-[25px]">
                      Mã nhân viên
                    </th>
                    <th className="text-start font-semibold border-r border-black/10 text-[14px] py-[10px] text-black/70 col-span-4 px-[25px]">
                      Tên nhân viên
                    </th>
                    <th className="text-start font-semibold border-r border-black/10 text-[14px] py-[10px] text-black/70 col-span-3 px-[25px]">
                      Thời gian
                    </th>
                    <th className="text-start font-semibold border-r border-black/10 text-[14px] py-[10px] text-black/70 col-span-2 px-[25px]">
                      Máy chủ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, idx) => (
                    <EmployeeTableItem key={idx} {...emp} />
                  ))}
                </tbody>
              </table>
              {(employees ?? []).length > 0 && (
                <div className="flex">
                  <Pagination
                    isCompact
                    showControls
                    onChange={(value) => {
                      setPage(value);
                    }}
                    initialPage={page}
                    total={totalPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function EmployeeTableItem({
  checkinTime,
  empId,
  empName,
  server,
}: AttendanceUser) {
  return (
    <tr className="border-x border-b border-black/10 grid grid-cols-12">
      <td className="text-start font-semibold border-r border-black/10 text-[14px] py-[13px] col-span-3 px-[25px]">
        {empId}
      </td>
      <td className="text-start font-semibold border-r border-black/10 text-[14px] py-[13px] col-span-4 px-[25px]">
        {empName}
      </td>
      <td className="text-start font-semibold border-r border-black/10 text-[14px] py-[13px] col-span-3 px-[25px]">
        {formatDateAndTime(checkinTime)}
      </td>
      <td className="text-start font-semibold border-r border-black/10 text-[14px] py-[13px] col-span-2 px-[25px]">
        {server.serverName}
      </td>
    </tr>
  );
}

type NavLinkItemProps = {
  title: string;
  href: string;
  onClick?(): void;
};

function NavLinkItem({ title, href, onClick }: NavLinkItemProps) {
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const url = new URL(href, "http://localhost:3000");
  const hrefPath = url.pathname;
  const hrefParams = new URLSearchParams(url.search);

  // chỉ active khi path + query trùng
  const isActive =
    pathName === hrefPath &&
    Array.from(hrefParams.entries()).every(
      ([key, value]) => searchParams.get(key) === value
    ) &&
    // đồng thời đảm bảo không thừa param khác
    hrefParams.toString() === searchParams.toString();

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`rounded-full px-[25px] py-[5px] ${
        isActive ? "bg-white shadow-2xl" : ""
      }`}
    >
      <p
        className={`text-[13px] text-center ${
          isActive ? "text-black font-semibold" : "text-black/70"
        }`}
      >
        {title}
      </p>
    </Link>
  );
}

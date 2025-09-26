"use client";

import {
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tab,
  Tabs,
} from "@heroui/react";
import Image from "next/image";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { FiUserCheck } from "react-icons/fi";
import { GoBell } from "react-icons/go";
import { AiOutlineLogout } from "react-icons/ai";
import { RiSettingsLine } from "react-icons/ri";
import { IoHelpOutline } from "react-icons/io5";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutService } from "@/services/authService";
import { handleGoToRoute } from "@/utils/navigate";
import { useGetOwnerInfo } from "@/hooks/userHooks";
import { postActivityLogService } from "@/services/activityService";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ActivityLog } from "@/interfaces/Activity";
import { relativeTime } from "@/utils/format";
import { useGetActivityLog } from "@/hooks/activityHooks";
import { useAtom, useSetAtom } from "jotai";
import { notificationDropdownState } from "@/atoms/dropdown-atoms";

export default function Navbar() {
  const { data: info } = useGetOwnerInfo();
  const setIsToggleDropdown = useSetAtom(notificationDropdownState);

  const queryClient = useQueryClient();
  const activityLogMutation = useMutation({
    mutationKey: ["log"],
    mutationFn: postActivityLogService,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["activity-log"],
      });
    },
  });
  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: logoutService,
    onSuccess(data) {
      if (data.message === "Đăng xuất thành công") {
        if (typeof window !== "undefined") {
          localStorage.setItem("storedName", info?.name as string);
        }
        handleGoToRoute("/");
        activityLogMutation.mutate({
          userId: info?.userId,
          type: "logout",
        });
      }
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex justify-between items-center">
      <Link href={`/dashboard/order`}>
        <Image
          src={`/logo.png`}
          alt="logo"
          width={150}
          height={100}
          className="object-cover scale-[0.9]"
        />
      </Link>
      <div className="flex items-center gap-x-[20px]">
        {/* Search */}
        {/* <div className="flex px-[15px] py-[7px] bg-white rounded-[8px] items-center gap-x-[10px] transition-all duration-300 border focus-within:border-black/50">
          <IoIosSearch className="text-[18px] text-black/70" />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh"
            className="outline-none bg-transparent text-[13px] w-[300px]"
          />
        </div> */}

        {/* Utils */}
        <div className="flex gap-x-[15px] relative">
          <Button
            onPress={() => setIsToggleDropdown(true)}
            isIconOnly
            variant="light"
          >
            <GoBell className="text-[20px] text-black/70" />
          </Button>
          <NotificationDropdown />
        </div>

        {/* Config */}
        <div className="relative">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light">
                <RiSettingsLine className="text-[20px] text-black/70" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static">
              <DropdownItem
                href="/dashboard/setting/profile"
                key="setting-profile"
                startContent={<FiUserCheck />}
              >
                <p className="font-manrope">Tài khoản</p>
              </DropdownItem>
              <DropdownItem
                href="/dashboard/setting"
                key="setting"
                startContent={<HiOutlineCog6Tooth />}
              >
                <p className="font-manrope">Cài đặt</p>
              </DropdownItem>
              <DropdownItem
                href="/dashboard/help"
                key="help"
                startContent={<IoHelpOutline />}
              >
                <p className="font-manrope">Hỗ trợ</p>
              </DropdownItem>
              <DropdownItem
                onPress={handleLogout}
                key="logout"
                className="text-danger"
                color="danger"
                startContent={<AiOutlineLogout />}
              >
                <p className="font-manrope">Đăng xuất</p>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

function NotificationDropdown() {
  const [isToggleDropdown, setIsToggleDropdown] = useAtom(
    notificationDropdownState
  );
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsToggleDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsToggleDropdown]);

  const [selectedTab, setSelectedTab] = useState("system");
  const [page] = useState(1);
  const [limit] = useState(50);

  const { data: activities } = useGetActivityLog(page, limit);
  return (
    <AnimatePresence>
      {isToggleDropdown && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute min-w-[400px] max-h-[600px] rounded-2xl z-[200] bg-white top-[40px] right-[-60%] shadow-2xl pt-[20px]"
        >
          <div className="flex flex-col h-full max-h-[580px]">
            <div className="flex items-center justify-between px-[20px]">
              <strong>Thông báo</strong>
              <Tabs
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(String(key))}
                variant="underlined"
                size="sm"
                aria-label="notifications"
              >
                <Tab key="system" title="Hệ thống"></Tab>
                <Tab key="activity" title="Hoạt động"></Tab>
              </Tabs>
            </div>
            {/* Main Here */}
            <div className="flex-1 flex-col mt-[10px] overflow-auto scroll-smooth">
              {activities?.length === 0 && (
                <>
                  <div className="flex items-center justify-center h-[400px]">
                    <p className="text-sm font-semibold">
                      Chưa có hoạt động nào
                    </p>
                  </div>
                </>
              )}
              {selectedTab === "activity" && (
                <>
                  <div className="flex flex-col">
                    {activities?.map((item) => (
                      <ActivityItem key={item.logId} {...item} />
                    ))}
                  </div>
                </>
              )}
              {selectedTab === "system" && (
                <>
                  <div className="flex items-center justify-center h-[400px]">
                    <p className="text-sm font-semibold">
                      Chưa có thông báo mới nào
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ActivityItem({ createdAt, name, type, note }: ActivityLog) {
  if (type === "logout")
    return (
      <div className="flex justify-between gap-x-[10px] py-[15px] border-b border-neutral-400/30 px-[20px] last:border-hidden">
        <div className="flex flex-col gap-y-[5px]">
          <div className="flex items-center gap-x-[7px]">
            <strong className="text-[13px]">{name}</strong>
            <span className="text-black/60 text-[12px]">
              {relativeTime(createdAt)}
            </span>
          </div>
          <p className="text-[13px] text-black/60">
            <span className="font-semibold text-yellow-500">Đăng xuất</span>{" "}
            khỏi hệ thống
          </p>
        </div>
        <div className="w-[8px] h-[8px] rounded-full bg-green-500 mt-[5px]"></div>
      </div>
    );
  if (type === "confirm")
    return (
      <div className="flex justify-between gap-x-[10px] py-[15px] border-b border-neutral-400/30 px-[20px] last:border-hidden">
        <div className="flex flex-col gap-y-[5px]">
          <div className="flex items-center gap-x-[7px]">
            <strong className="text-[13px]">{name}</strong>
            <span className="text-black/60 text-[12px]">
              {relativeTime(createdAt)}
            </span>
          </div>
          <p className="text-[13px] text-black/60">
            Đã xác nhận{" "}
            <span className="font-semibold text-black">In hoá đơn</span> đơn
            hàng{" "}
            <span className="font-semibold text-custom-primary">#{note}</span>
          </p>
        </div>
        <div className="w-[8px] h-[8px] rounded-full bg-green-500 mt-[5px]"></div>
      </div>
    );
  if (type === "invoice")
    return (
      <div className="flex justify-between gap-x-[10px] py-[15px] border-b border-neutral-400/30 px-[20px] last:border-hidden">
        <div className="flex flex-col gap-y-[5px]">
          <div className="flex items-center gap-x-[7px]">
            <strong className="text-[13px]">{name}</strong>
            <span className="text-black/60 text-[12px]">
              {relativeTime(createdAt)}
            </span>
          </div>
          <p className="text-[13px] text-black/60">
            Đã <span className="font-semibold text-black">Xin chứng từ</span>{" "}
            đơn hàng{" "}
            <span className="font-semibold text-custom-primary">#{note}</span>
          </p>
        </div>
        <div className="w-[8px] h-[8px] rounded-full bg-green-500 mt-[5px]"></div>
      </div>
    );
  if (type === "stock")
    return (
      <div className="flex justify-between gap-x-[10px] py-[15px] border-b border-neutral-400/30 px-[20px] last:border-hidden">
        <div className="flex flex-col gap-y-[5px]">
          <div className="flex items-center gap-x-[7px]">
            <strong className="text-[13px]">{name}</strong>
            <span className="text-black/60 text-[12px]">
              {relativeTime(createdAt)}
            </span>
          </div>
          <p className="text-[13px] text-black/60">
            Đã <span className="font-semibold text-black">Xuất kho</span> đơn
            hàng{" "}
            <span className="font-semibold text-custom-primary">#{note}</span>
          </p>
        </div>
        <div className="w-[8px] h-[8px] rounded-full bg-green-500 mt-[5px]"></div>
      </div>
    );
  return null;
}

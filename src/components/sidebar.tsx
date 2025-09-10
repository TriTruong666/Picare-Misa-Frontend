"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { IoFileTrayOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

export default function DashboardSidebar() {
  const items = [
    {
      title: "Đơn hàng",
      icon: IoFileTrayOutline,
      href: "/dashboard/order",
    },
    {
      title: "Đã xử lý",
      icon: FaCheck,
      href: "/dashboard/order/complete",
    },
  ];
  return (
    <div className="flex flex-col w-full desktop:h-[850px] max-desktop:h-[640px] px-[12px] py-[20px] justify-between bg-white rounded-[15px] shadow">
      {/* Main */}
      <div className="flex flex-col gap-y-[15px]">
        {items.map((item, idx) => {
          return <SidebarItem key={idx} {...item} />;
        })}
      </div>
    </div>
  );
}

type SidebarItemProps = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

function SidebarItem({ title, icon: Icon, href }: SidebarItemProps) {
  const pathName = usePathname();
  const isActive = pathName === href;

  return (
    <Link
      href={href}
      className={`flex items-center px-[12px] py-[7px] rounded-[8px] justify-between transition-all duration-300 hover:bg-black/10 cursor-pointer ${
        isActive ? "!bg-black" : ""
      }`}
    >
      <div className="flex items-center gap-x-[13px]">
        {/* icon đổi màu dựa vào isActive */}
        <Icon
          className={`text-[18px] ${isActive ? "text-white" : "text-black/70"}`}
        />
        <p
          className={`text-[15px] ${
            isActive ? "!text-white font-semibold" : "text-black/70"
          }`}
        >
          {title}
        </p>
      </div>
    </Link>
  );
}

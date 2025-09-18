"use client";
import { useGetOwnerInfo } from "@/hooks/userHooks";
import { User } from "@/interfaces/User";
import { Chip } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { IoFileTrayOutline } from "react-icons/io5";
import { LuWarehouse } from "react-icons/lu";
import { AiOutlineScan } from "react-icons/ai";
import { TbInvoice } from "react-icons/tb";

export default function DashboardSidebar() {
  const { data: info } = useGetOwnerInfo();

  const adminMenu = [
    {
      title: "Đơn hàng",
      icon: IoFileTrayOutline,
      href: "/dashboard/order",
    },
    {
      title: "Xuất hoá đơn",
      icon: TbInvoice,
      href: "/dashboard/order/invoice",
    },
    {
      title: "Xuất kho",
      icon: LuWarehouse,
      href: "/dashboard/order/stock",
    },
    {
      title: "Quét Barcode",
      icon: AiOutlineScan,
      href: "/dashboard/scan",
    },
  ];
  const staffMenu = [
    {
      title: "Đơn hàng",
      icon: IoFileTrayOutline,
      href: "/dashboard/order",
    },
    {
      title: "Xuất kho",
      icon: LuWarehouse,
      href: "/dashboard/order/stock",
    },
    {
      title: "Quét Barcode",
      icon: AiOutlineScan,
      href: "/dashboard/scan",
    },
  ];

  const accountMenu = [
    {
      title: "Đơn hàng",
      icon: IoFileTrayOutline,
      href: "/dashboard/order",
    },
    {
      title: "Xuất hoá đơn",
      icon: TbInvoice,
      href: "/dashboard/order/invoice",
    },
    {
      title: "Quét Barcode",
      icon: AiOutlineScan,
      href: "/dashboard/scan",
    },
  ];

  const roleMap: Record<User["role"], string> = {
    admin: "Admin",
    accountant: "Kế toán",
    staff: "Kho",
  };

  return (
    <div className="relative flex flex-col w-full h-full min-h-full">
      <div className="flex flex-col w-full h-full px-[12px] py-[20px] justify-between bg-white rounded-[15px] shadow">
        {/* Main */}
        {info?.role === "admin" && (
          <div className="flex flex-col gap-y-[15px]">
            {adminMenu.map((item, idx) => {
              return <SidebarItem key={idx} {...item} />;
            })}
          </div>
        )}
        {info?.role === "staff" && (
          <div className="flex flex-col gap-y-[15px]">
            {staffMenu.map((item, idx) => {
              return <SidebarItem key={idx} {...item} />;
            })}
          </div>
        )}
        {info?.role === "accountant" && (
          <div className="flex flex-col gap-y-[15px]">
            {accountMenu.map((item, idx) => {
              return <SidebarItem key={idx} {...item} />;
            })}
          </div>
        )}
        <div className="flex justify-between items-center px-[10px]">
          <div className="flex flex-col gap-y-[2px]">
            <strong className="text-[14px]">{info?.name || "Username"}</strong>
            <p className="text-[12px] text-black/60">
              {info?.email || "email@gmail.com"}
            </p>
          </div>
          <Chip size="sm" variant="dot" color="primary">
            {roleMap[info?.role as string] || "unknown"}
          </Chip>
        </div>
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

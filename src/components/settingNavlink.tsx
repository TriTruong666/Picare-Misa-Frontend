"use client";

import { useGetOwnerInfo } from "@/hooks/userHooks";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingNavlinkMenu() {
  const menu = [
    {
      title: "Cài đặt chung",
      href: "/dashboard/setting",
    },
    {
      title: "Thông tin",
      href: "/dashboard/setting/profile",
    },
    {
      title: "Bảo mật",
      href: "/dashboard/setting/security",
    },
    {
      title: "Haravan",
      href: "/dashboard/setting/haravan",
    },
    {
      title: "Misa Amis",
      href: "/dashboard/setting/misa",
    },
    {
      title: "Hoạt động",
      href: "/dashboard/setting/activity",
    },
  ];
  return (
    <div className="flex flex-col h-full ">
      {menu.map((item, idx) => (
        <NavlinkItem key={idx} {...item} />
      ))}
    </div>
  );
}

type NavlinkItemProps = {
  title: string;
  href: string;
  allowedRoles?: string[];
};

function NavlinkItem({ title, href, allowedRoles }: NavlinkItemProps) {
  const pathName = usePathname();
  const isActive = pathName === href;
  const { data: info } = useGetOwnerInfo();

  if (allowedRoles && !allowedRoles.some((r) => info?.role.includes(r))) {
    return null;
  }

  return (
    <Link
      href={href}
      className="group relative flex items-center px-[10px] py-[10px] max-desktop:w-[190px] desktop:w-[250px] overflow-hidden"
    >
      {/* Nền trượt */}
      <span
        className={`absolute left-0 bottom-0 h-full w-0 bg-black transition-all duration-500 ease-in-out group-hover:w-full ${
          isActive ? "bg-black w-full" : ""
        }`}
      ></span>

      {/* Chữ */}
      <span
        className={`relative z-10 text-black/70 text-sm transition-colors duration-500 group-hover:text-white ${
          isActive ? "!text-white" : ""
        }`}
      >
        {title}
      </span>
    </Link>
  );
}

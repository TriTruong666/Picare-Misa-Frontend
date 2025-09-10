"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Page() {
  const items = [
    {
      title: "Tất cả",
      href: "/dashboard/order",
    },
    {
      title: "Đã giao",
      href: "/",
    },
    {
      title: "Đã thanh toán",
      href: "/",
    },
  ];
  return (
    <div className="relative flex flex-col w-full h-full">
      {/* Main */}
      <div className="flex flex-col w-full bg-white rounded-[15px] px-[20px] py-[20px] shadow gap-y-[30px] h-full">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-[19px] text-black/80">
            Quản lý đơn sàn
          </h2>
        </div>
        {/* Nav */}
        <div className="flex justify-between items-center">
          <div className="flex items-center rounded-full px-[7px] py-[5px] bg-neutral-400/40 gap-x-[5px]">
            {items.map((item, idx) => {
              return <NavLinkItem key={idx} {...item} />;
            })}
          </div>
        </div>
        {/* Table */}
      </div>
    </div>
  );
}

type NavLinkItemProps = {
  title: string;
  href: string;
};

function NavLinkItem({ title, href }: NavLinkItemProps) {
  const pathName = usePathname();
  const isActive = pathName === href;
  return (
    <Link
      href={href}
      className={`rounded-full px-[20px] py-[5px] ${
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

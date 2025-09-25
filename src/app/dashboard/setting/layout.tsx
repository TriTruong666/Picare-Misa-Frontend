import SettingNavlinkMenu from "@/components/settingNavlink";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Cài đặt",
  description: "Quản lý cá nhân",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <div className="relative flex flex-col w-full min-h-full">
        <div className="flex flex-col w-full bg-white rounded-[15px] px-[20px] py-[20px] shadow gap-y-[30px] h-full">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-[19px] text-black/80">Cài đặt</h2>
          </div>
          <div className="flex mt-[10px] gap-x-[80px]">
            {/* Navlink */}
            <div className="">
              <SettingNavlinkMenu />
            </div>
            {/* Main */}
            <div className="w-full mt-[10px]">{children}</div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

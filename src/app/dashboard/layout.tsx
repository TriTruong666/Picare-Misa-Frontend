import { EventAlert } from "@/components/alert";
import AuthComponent from "@/components/auth";
import SSEClient from "@/components/client";
import Navbar from "@/components/navbar";
import DashboardSidebar from "@/components/sidebar";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard PicareVN",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <div className="relative flex flex-col font-manrope bg-custom-foreground w-screen h-screen">
        <AuthComponent />
        <EventAlert />
        <SSEClient />
        {/* Navbar */}
        <div className="shrink-0 px-[30px]">
          <Navbar />
        </div>

        <div className="flex flex-1 gap-x-[30px] px-[30px] pb-[40px] overflow-hidden">
          {/* Sidebar */}
          <div className="w-[250px] shrink-0">
            <DashboardSidebar />
          </div>

          {/* Main content scrollable */}
          <div className="flex-1 overflow-y-auto pr-[10px]">{children}</div>
        </div>
      </div>
    </Suspense>
  );
}

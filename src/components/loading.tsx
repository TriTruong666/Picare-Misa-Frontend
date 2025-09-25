"use client";

import dynamic from "next/dynamic";
import catLoading from "@/static/animation/cat-load.json";
import tableLoading from "@/static/animation/basic-loading.json";

const DynamicLottie = dynamic(() => import("lottie-react"), { ssr: false });

export function SyncOrderLoader() {
  return (
    <div className="w-full desktop:h-[600px] max-desktop:h-[450px] flex flex-col justify-center items-center">
      <DynamicLottie
        animationData={catLoading}
        loop
        autoplay
        className="w-[300px] h-[300px]"
      />
      <h1 className="text-[15px] font-normal text-black/70">
        Đang trong quá trình đồng bộ dữ liệu, vui lòng chờ...
      </h1>
    </div>
  );
}

export function TableOrderLoader() {
  return (
    <div className="w-full desktop:h-[600px] max-desktop:h-[450px] flex flex-col justify-center items-center gap-y-[15px]">
      <DynamicLottie
        animationData={tableLoading}
        loop
        autoplay
        className="w-[150px] h-[150px]"
      />
    </div>
  );
}

export function SyncMisaLoader() {
  return (
    <div className="w-full desktop:h-[600px] max-desktop:h-[450px] flex flex-col justify-center items-center gap-y-[15px]">
      <DynamicLottie
        animationData={tableLoading}
        loop
        autoplay
        className="w-[200px] h-[200px]"
      />
    </div>
  );
}

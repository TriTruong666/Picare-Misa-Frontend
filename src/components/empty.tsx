"use client";

import dynamic from "next/dynamic";
import emptyAnimation from "@/static/animation/empty.json";
const DynamicLottie = dynamic(() => import("lottie-react"), { ssr: false });

export function EmptyCompleteOrder() {
  return (
    <div className="w-full desktop:h-[600px] max-desktop:h-[450px] flex flex-col justify-center items-center gap-y-[15px]">
      <DynamicLottie
        animationData={emptyAnimation}
        loop
        autoplay
        className="w-[250px] h-[250px]"
      />
      <h1 className="text-[15px] font-normal text-black/70">
        Chưa có đơn nào được xử lý...
      </h1>
    </div>
  );
}

export function EmptyOrder() {
  return (
    <div className="w-full desktop:h-[600px] max-desktop:h-[450px] flex flex-col justify-center items-center gap-y-[15px]">
      <DynamicLottie
        animationData={emptyAnimation}
        loop
        autoplay
        className="w-[250px] h-[250px]"
      />
      <h1 className="text-[15px] font-normal text-black/70">
        Không tìm thấy đơn hàng nào, bạn hãy{" "}
        <span className="font-bold">Đồng bộ dữ liệu</span>
      </h1>
    </div>
  );
}

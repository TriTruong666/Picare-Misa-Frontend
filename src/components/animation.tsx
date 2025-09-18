"use client";

import dynamic from "next/dynamic";
import scanAnimation from "@/static/animation/scan.json";

const DynamicLottie = dynamic(() => import("lottie-react"), { ssr: false });

export function ScanAnimation() {
  return (
    <div className="">
      <DynamicLottie
        animationData={scanAnimation}
        loop
        autoplay
        className="w-[200px] h-[200px]"
      />
    </div>
  );
}

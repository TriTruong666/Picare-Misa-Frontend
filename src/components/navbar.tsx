"use client";

import { Button } from "@heroui/react";
import Image from "next/image";
import { IoIosSearch } from "react-icons/io";
import { GoBell } from "react-icons/go";
import { useAtom } from "jotai";
import { navbarDropdownAtoms } from "@/atoms/navbar-atoms";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Navbar() {
  const [isToggleDropdown, setIsToggleDropdown] = useAtom(navbarDropdownAtoms);

  return (
    <div className="flex justify-between items-center">
      <Link href={`/dashboard/order`} className="">
        <Image
          src={`/logo.png`}
          alt=""
          width={150}
          height={100}
          className="object-cover scale-[0.9]"
        />
      </Link>
      <div className="flex items-center gap-x-[20px]">
        {/* Search */}
        <div className="flex px-[15px] py-[7px] bg-white rounded-[8px] items-center gap-x-[10px] transition-all duration-300 border focus-within:border-black/50">
          <IoIosSearch className="text-[18px] text-black/70" />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh"
            className="outline-none bg-transparent text-[13px]"
          />
        </div>
        {/* Utils */}
        <div className="flex gap-x-[15px]">
          <Button isIconOnly variant="light">
            <GoBell className="text-[20px] text-black/70" />
          </Button>
        </div>
        {/* Config */}
        <div className="relative">
          <Image
            onClick={() => setIsToggleDropdown(!isToggleDropdown)}
            src={`/avatar.jpg`}
            alt=""
            width={40}
            height={40}
            className="object-cover rounded-full cursor-pointer"
          />
          <SettingDropdown />
        </div>
      </div>
    </div>
  );
}

function SettingDropdown() {
  const [isToggleDropdown, setIsToggleDropdown] = useAtom(navbarDropdownAtoms);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsToggleDropdown(false);
      }
    }

    if (isToggleDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isToggleDropdown, setIsToggleDropdown]);

  return (
    <AnimatePresence>
      {isToggleDropdown && (
        <motion.div
          ref={dropdownRef}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute max-laptop:right-[-10px] z-[200] max-laptop:top-[50px] bg-white w-[200px] h-[300px] shadow-2xl rounded-[10px] flex flex-col"
        ></motion.div>
      )}
    </AnimatePresence>
  );
}

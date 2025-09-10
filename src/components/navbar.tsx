"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import Image from "next/image";
import { IoIosSearch } from "react-icons/io";
import { FiUserCheck } from "react-icons/fi";
import { GoBell } from "react-icons/go";
import { useAtom } from "jotai";
import { navbarDropdownAtoms } from "@/atoms/navbar-atoms";
import { AiOutlineLogout } from "react-icons/ai";
import { IoHelpOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Navbar() {
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
            className="outline-none bg-transparent text-[13px] w-[300px]"
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
          <Dropdown>
            <DropdownTrigger>
              <Image
                src={`/avatar.jpg`}
                alt=""
                width={40}
                height={40}
                className="object-cover rounded-full cursor-pointer"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                href="/"
                key="setting"
                startContent={<FiUserCheck />}
              >
                <p className="font-manrope">Tài khoản</p>
              </DropdownItem>
              <DropdownItem
                key="help"
                href="/"
                startContent={<IoHelpOutline />}
              >
                <p className="font-manrope">Hỗ trợ</p>
              </DropdownItem>
              <DropdownItem
                key="logout"
                className="text-danger"
                color="danger"
                startContent={<AiOutlineLogout />}
              >
                <p className="font-manrope">Đăng xuất</p>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
          className="absolute desktop:right-[-10px] desktop:top-[60px] max-desktop:right-[-10px] z-[200] max-desktop:top-[50px] bg-white w-[200px] h-[300px] shadow-2xl rounded-[10px] flex flex-col"
        ></motion.div>
      )}
    </AnimatePresence>
  );
}

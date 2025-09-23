"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import Image from "next/image";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { FiUserCheck } from "react-icons/fi";
import { GoBell } from "react-icons/go";
import { AiOutlineLogout } from "react-icons/ai";
import { RiSettingsLine } from "react-icons/ri";
import { IoHelpOutline } from "react-icons/io5";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { logoutService } from "@/services/authService";
import { handleGoToRoute } from "@/utils/navigate";
import { useGetOwnerInfo } from "@/hooks/userHooks";

export default function Navbar() {
  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: logoutService,
    onSuccess(data) {
      if (data.message === "Đăng xuất thành công") {
        handleGoToRoute("/");
      }
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex justify-between items-center">
      <Link href={`/dashboard/order`}>
        <Image
          src={`/logo.png`}
          alt="logo"
          width={150}
          height={100}
          className="object-cover scale-[0.9]"
        />
      </Link>
      <div className="flex items-center gap-x-[20px]">
        {/* Search */}
        {/* <div className="flex px-[15px] py-[7px] bg-white rounded-[8px] items-center gap-x-[10px] transition-all duration-300 border focus-within:border-black/50">
          <IoIosSearch className="text-[18px] text-black/70" />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh"
            className="outline-none bg-transparent text-[13px] w-[300px]"
          />
        </div> */}

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
              <Button isIconOnly variant="light">
                <RiSettingsLine className="text-[20px] text-black/70" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static">
              <DropdownItem
                href="/dashboard/setting/profile"
                key="setting-profile"
                startContent={<FiUserCheck />}
              >
                <p className="font-manrope">Tài khoản</p>
              </DropdownItem>
              <DropdownItem
                href="/dashboard/setting"
                key="setting"
                startContent={<HiOutlineCog6Tooth />}
              >
                <p className="font-manrope">Cài đặt</p>
              </DropdownItem>
              <DropdownItem
                href="/dashboard/help"
                key="help"
                startContent={<IoHelpOutline />}
              >
                <p className="font-manrope">Hỗ trợ</p>
              </DropdownItem>
              <DropdownItem
                onPress={handleLogout}
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

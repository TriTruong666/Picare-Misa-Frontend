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
import { AiOutlineLogout } from "react-icons/ai";
import { RiSettingsLine } from "react-icons/ri";
import { IoHelpOutline } from "react-icons/io5";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Navbar() {
  const [debounceValue, setDebounceValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Đồng bộ khi load trang
  useEffect(() => {
    const urlQuery = searchParams.get("query") || "";
    setSearchValue(urlQuery);
    setDebounceValue(urlQuery);
  }, [pathname]); // chỉ chạy khi đổi route

  // debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(searchValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    if (pathname !== "/dashboard/order") return;

    const currentQuery = searchParams.get("query") || "";

    if (debounceValue === currentQuery) return;

    if (debounceValue.trim()) {
      router.replace(`/dashboard/order?query=${debounceValue}`);
    } else {
      router.replace(`/dashboard/order`);
    }
  }, [debounceValue, pathname]);

  useEffect(() => {
    if (pathname !== "/dashboard/order") {
      setSearchValue("");
      setDebounceValue("");
    }
  }, [pathname]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

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
        <div className="flex px-[15px] py-[7px] bg-white rounded-[8px] items-center gap-x-[10px] transition-all duration-300 border focus-within:border-black/50">
          <IoIosSearch className="text-[18px] text-black/70" />
          <input
            value={searchValue}
            onChange={handleSearch}
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
              <Button isIconOnly variant="light">
                <RiSettingsLine className="text-[20px] text-black/70" />
              </Button>
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
                href="/"
                key="help"
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

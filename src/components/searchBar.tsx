"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";

export default function SearchBar() {
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
  );
}

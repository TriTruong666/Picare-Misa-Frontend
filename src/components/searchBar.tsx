"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";

export default function OrderSearchBar() {
  const [searchValue, setSearchValue] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Đồng bộ value với query khi load trang
  useEffect(() => {
    const query = searchParams.get("query") || "";
    setSearchValue(query);
  }, [pathname, searchParams]);

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchValue.trim()) {
        params.set("query", searchValue.trim());
      } else {
        params.delete("query");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  return (
    <div className="flex py-[7px] bg-white items-center gap-x-[10px] transition-all duration-300 border-b-[2px] focus-within:border-black/50">
      <IoIosSearch className="text-[18px] text-black/70" />
      <input
        onChange={handleSearch}
        value={searchValue}
        type="text"
        placeholder="Tìm đơn hàng..."
        className="outline-none bg-transparent text-[13px] w-[300px]"
      />
    </div>
  );
}

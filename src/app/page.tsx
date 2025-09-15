"use client";
import { useGetOwnerInfo } from "@/hooks/userHooks";
import { Login } from "@/interfaces/Service";
import { loginService } from "@/services/authService";
import { handleGoToRoute } from "@/utils/navigate";
import { showToast } from "@/utils/toast";
import { Button } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { RxEyeOpen, RxEyeClosed } from "react-icons/rx";

export default function Home() {
  const { data: info, isLoading: isGetUserInfo } = useGetOwnerInfo();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState<Login>({
    email: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationKey: ["login", loginData.email, loginData.password],
    mutationFn: loginService,
    onSuccess(data) {
      if (data.message === "Đăng nhập thành công") {
        showToast({
          status: "success",
          content: "Dang nhap thanh cong",
        });
      }
      if (data.message === "Sai email hoặc mật khẩu, vui lòng thử lại") {
        showToast({
          status: "danger",
          content: "Dang nhap that bai",
        });
        setLoginData({
          ...loginData,
          password: "",
        });
      }
    },
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      await loginMutation.mutateAsync(loginData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowpassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (isGetUserInfo) return;
    if (info) {
      handleGoToRoute("/dashboard/order");
    }
  }, [info, isGetUserInfo]);
  return (
    <div className="relative w-screen h-screen max-h-screen overflow-hidden flex justify-center items-center font-manrope select-none">
      <div className="flex justify-center absolute left-[40px] top-[20px]">
        <Image
          src={`/logo.png`}
          alt=""
          width={150}
          height={100}
          className="object-cover scale-[0.9]"
        />
      </div>
      {/* Hidden Modal */}
      <div className="flex flex-col">
        <div className="flex flex-col items-center gap-y-[9px]">
          <h2 className="font-semibold text-[22px] text-black/80">
            Chào mừng bạn quay trở lại
          </h2>
          <p className="text-black/60 text-[15px]">
            Vui lòng nhập email và mật khẩu để tiếp tục
          </p>
        </div>
        {/* Form */}
        <div className="flex flex-col mt-[40px] gap-y-[15px]">
          {/* Email */}
          <div className="flex flex-col gap-y-[7px]">
            <label htmlFor="form-email" className="text-sm font-bold">
              Email
            </label>
            <input
              type="text"
              name="email"
              onChange={handleOnChange}
              placeholder="Nhập email tại đây"
              id="form-email"
              className="max-desktop:w-[370px] outline-none border border-black/20 px-[14px] py-[9px] rounded-[10px] max-desktop:text-[14px] transition-all duration-300 focus:border-black/50"
            />
          </div>
          {/* Password */}
          <div className="flex flex-col gap-y-[7px]">
            <label htmlFor="form-email" className="text-sm font-bold">
              Mật khẩu
            </label>
            <div className="flex justify-between  max-desktop:w-[370px] border border-black/20 px-[14px] py-[9px] rounded-[10px] max-desktop:text-[14px] transition-all duration-300 focus-within:border-black/50">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={handleOnChange}
                placeholder="Nhập mật khẩu tại đây"
                id="form-email"
                className="outline-none w-[90%]"
              />
              {showPassword ? (
                <>
                  <RxEyeOpen
                    onClick={handleShowpassword}
                    className="text-[18px] text-black/70"
                  />
                </>
              ) : (
                <>
                  <RxEyeClosed
                    onClick={handleShowpassword}
                    className="text-[18px] text-black/50"
                  />
                </>
              )}
            </div>
          </div>
          <div className="mt-[10px]">
            <Button
              onPress={handleLogin}
              className="w-full bg-custom-primary/50 text-custom-primary"
            >
              <p className="text-custom-primary font-semibold">Đăng nhập</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý chấm công",
  description: "Chấm công PicareVN",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

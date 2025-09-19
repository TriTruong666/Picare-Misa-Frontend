import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quét Barcode",
  description: "Hệ thống quét Barcode của PicareVN",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

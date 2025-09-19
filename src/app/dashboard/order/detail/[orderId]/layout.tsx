import type { Metadata } from "next";

interface Props {
  params: { orderId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderId } = await params;

  return {
    title: `Đơn hàng #${orderId}`,
    description: `Trang thông tin chi tiết của đơn hàng ${orderId}`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

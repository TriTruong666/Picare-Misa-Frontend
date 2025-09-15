import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans, Manrope } from "next/font/google";
import { Provider } from "jotai";
import "./globals.css";
import { QueryProvider, UIProvider } from "@/components/provider";

const geistManrope = Manrope({
  variable: "--font-geist-manrope",
  subsets: ["latin"],
});

const geistDM = DM_Sans({
  variable: "--font-geist-dm",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PicareVN",
  description: "Website quản lý đơn hàng sàn của CTY TNHH PicareVN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <UIProvider>
        <Provider>
          <html lang="en">
            <body
              className={`${geistSans.variable} ${geistMono.variable} ${geistDM.variable} ${geistManrope.variable} antialiased overflow-x-hidden`}
            >
              {children}
            </body>
          </html>
        </Provider>
      </UIProvider>
    </QueryProvider>
  );
}

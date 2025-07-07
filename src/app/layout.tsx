import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToasterWrapper } from "@/components/ui/ToasterWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ScoreLens - Every Shot, Every Rule",
  description: "Hệ thống tính điểm và quản lý giải đấu bida chuyên nghiệp",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-black`}>
        {children}
        <ToasterWrapper />
      </body>
    </html>
  );
}

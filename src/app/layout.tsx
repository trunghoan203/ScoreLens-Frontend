import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToasterWrapper } from "@/components/ui/ToasterWrapper";
import { I18nProvider } from "@/lib/i18n/provider";
import { LanguageAttribute } from "@/components/shared/LanguageAttribute";

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
    <html>
      <body className={`${inter.className} bg-black`}>
        <I18nProvider>
          <LanguageAttribute />
          {children}
          <ToasterWrapper />
        </I18nProvider>
      </body>
    </html>
  );
}

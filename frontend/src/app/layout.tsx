import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "@/styles/globals.css";
import { ChatbotWidget } from "@/components/shared/ChatbotWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Công ty Luật Hợp danh Nghiệp Hưng | Nền Tảng Pháp Lý & Trợ Lý Trí Tuệ Nhân Tạo",
  description:
    "Công ty Luật Hợp danh Nghiệp Hưng - Đồng hành cùng cá nhân và doanh nghiệp với giải pháp pháp lý chuyên nghiệp, minh bạch và Trợ lý Pháp lý AI 24/7.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ChatbotWidget />
      </body>
    </html>
  );
}

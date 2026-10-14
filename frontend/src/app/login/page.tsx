import type { Metadata } from "next";
import { LoginSection } from "@/components/shared/LoginSection";

export const metadata: Metadata = {
  title: "Đăng nhập | Công ty Luật Hợp danh Nghiệp Hưng",
};

export default function LoginPage() {
  return <LoginSection />;
}

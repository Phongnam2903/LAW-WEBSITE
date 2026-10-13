import type { Metadata } from "next";
import { LoginSection } from "@/components/shared/LoginSection";

export const metadata: Metadata = {
  title: "Đăng nhập - VietLex Law",
};

export default function LoginPage() {
  return <LoginSection />;
}

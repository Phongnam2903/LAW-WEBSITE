import type { Metadata } from "next";
import { ForgotPasswordSection } from "@/components/shared/ForgotPasswordSection";

export const metadata: Metadata = {
  title: "Quên mật khẩu | VietLex Law",
  description:
    "Khôi phục mật khẩu tài khoản VietLex Law bằng quy trình xác minh OTP an toàn qua email.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordSection />;
}

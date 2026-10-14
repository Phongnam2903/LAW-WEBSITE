import type { Metadata } from "next";
import { ForgotPasswordSection } from "@/components/shared/ForgotPasswordSection";

export const metadata: Metadata = {
  title: "Quên mật khẩu | Công ty Luật Hợp danh Nghiệp Hưng",
  description:
    "Khôi phục mật khẩu tài khoản tại Công ty Luật Hợp danh Nghiệp Hưng bằng quy trình xác minh OTP an toàn qua email.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordSection />;
}

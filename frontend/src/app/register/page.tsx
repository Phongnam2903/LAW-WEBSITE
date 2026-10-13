import type { Metadata } from "next";
import { RegisterSection } from "@/components/shared/RegisterSection";

export const metadata: Metadata = {
  title: "Tạo tài khoản | VietLex Law",
  description:
    "Đăng ký tài khoản khách hàng miễn phí trên VietLex Law để đặt lịch tư vấn, theo dõi tiến trình hồ sơ và kết nối trực tiếp với luật sư phụ trách.",
};

export default function RegisterPage() {
  return <RegisterSection />;
}

import type { Metadata } from "next";
import { RegisterSection } from "@/components/shared/RegisterSection";

export const metadata: Metadata = {
  title: "Tạo tài khoản | Công ty Luật Hợp danh Nghiệp Hưng",
  description:
    "Đăng ký tài khoản khách hàng miễn phí tại Công ty Luật Hợp danh Nghiệp Hưng để đặt lịch tư vấn, theo dõi tiến trình hồ sơ và kết nối trực tiếp với luật sư phụ trách.",
};

export default function RegisterPage() {
  return <RegisterSection />;
}

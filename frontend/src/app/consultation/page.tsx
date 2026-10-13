import type { Metadata } from "next";
import { ConsultationSection } from "@/components/shared/ConsultationSection";

export const metadata: Metadata = {
  title: "Đặt Lịch Tư Vấn Pháp Lý | VietLex Law",
  description:
    "Đăng ký tư vấn pháp lý trực tiếp hoặc trực tuyến cùng đội ngũ luật sư giàu kinh nghiệm của VietLex. Bảo mật tuyệt đối theo quy định Luật Luật sư.",
};

export default function ConsultationPage() {
  return <ConsultationSection />;
}

import type { Metadata } from "next";
import { ChatPageSection } from "@/components/shared/ChatPageSection";

export const metadata: Metadata = {
  title: "Trợ lý Pháp lý AI | VietLex Law",
  description:
    "Trợ lý trí tuệ nhân tạo chuyên sâu về Pháp luật Việt Nam. Hỗ trợ tra cứu quy định pháp luật, phân tích sơ bộ tình huống và chuẩn bị hồ sơ tư vấn trực tuyến.",
};

export default function ChatPage() {
  return <ChatPageSection />;
}

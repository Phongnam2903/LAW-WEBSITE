import { NextResponse } from "next/server";
import { env } from "@/config/env";
import type { ChatApiResponse } from "@/types/chat";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.message !== "string") {
      return NextResponse.json(
        {
          error: "Yêu cầu không hợp lệ. 'message' phải là một chuỗi ký tự.",
        },
        { status: 400 }
      );
    }

    const message = body.message.trim();
    if (!message) {
      return NextResponse.json(
        {
          error: "Vui lòng nhập nội dung câu hỏi pháp lý.",
        },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          error: "Nội dung câu hỏi quá dài (tối đa 5.000 ký tự).",
        },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    const agentUrl = `${env.aiAgentUrl}/api/v1/chat`;

    try {
      const response = await fetch(agentUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error(`AI Agent backend error (${response.status}):`, errorText);
        throw new Error(`AI Agent backend responded with status ${response.status}`);
      }

      const data: ChatApiResponse = await response.json();
      return NextResponse.json(data);
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);

      const isAbort =
        fetchError instanceof Error && fetchError.name === "AbortError";

      console.error(
        "Lỗi kết nối tới AI Agent backend:",
        isAbort ? "Request timeout sau 35s" : fetchError
      );

      // Graceful fallback nếu agent đang khởi động lại hoặc mất kết nối
      const fallbackPayload: ChatApiResponse = {
        response:
          "Hệ thống Trợ lý Pháp lý AI của **Công ty Luật Hợp danh Nghiệp Hưng** hiện đang trong quá trình cập nhật cơ sở dữ liệu pháp lý mới.\n\n" +
          "Để được hỗ trợ giải đáp tình huống pháp lý ngay lập tức, Quý khách vui lòng liên hệ:\n" +
          "- 📞 **Hotline trực tuyến 24/7:** `1900 1234` hoặc `(028) 3822 9999`\n" +
          "- 📅 **Đặt lịch hẹn tư vấn:** Quý khách có thể gửi yêu cầu và hồ sơ vụ việc trực tiếp cho luật sư phụ trách.",
        analysis: "Fallback dự phòng khi AI Agent backend tạm thời không phản hồi.",
        citations: [],
        has_grounding: false,
        intent: "consultation_booking",
        action: {
          label: "Đặt lịch tư vấn với Luật sư",
          href: "/consultation",
        },
      };

      return NextResponse.json(fallbackPayload, { status: 200 });
    }
  } catch (error: unknown) {
    console.error("Lỗi nội bộ API route handler chat:", error);
    return NextResponse.json(
      {
        error: "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.",
      },
      { status: 500 }
    );
  }
}

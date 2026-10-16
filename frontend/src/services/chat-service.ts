import type { ChatApiResponse } from "@/types/chat";

export async function sendChatMessage(message: string): Promise<ChatApiResponse> {
  const response = await fetch("/api/agent/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error || `Yêu cầu thất bại với mã lỗi ${response.status}`
    );
  }

  return response.json();
}

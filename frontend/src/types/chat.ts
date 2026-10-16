export interface ChatAction {
  label: string;
  href: string;
}

export interface ChatApiResponse {
  response: string;
  analysis?: string;
  citations?: string[];
  has_grounding: boolean;
  intent?: string | null;
  action?: ChatAction | null;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  citations?: string[];
  suggestions?: string[];
  action?: ChatAction | null;
  has_grounding?: boolean;
  analysis?: string;
  intent?: string | null;
}

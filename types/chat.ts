// types/chat.ts
// 訊息角色型別
export type ChatRole = 'user' | 'assistant'

// 聊天訊息型別定義
export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
}

// types/sessions.ts
// Sessions 相關型別

export type SessionUser = {
  id: string
  name: string
  email: string
}

export type Session = {
  id: string
  user_id: string
  latest_message_sent_at: string | null
  created_at: string
  notes?: string | null
  user: SessionUser | null
  messages_count?: number // 訊息數量
  attention_count?: number // 需注意訊息數量
}

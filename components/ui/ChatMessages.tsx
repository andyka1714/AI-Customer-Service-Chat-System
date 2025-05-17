// components/ui/ChatMessages.tsx
// 訊息列表元件，支援 user/assistant 樣式
import React from 'react'
import type { ChatMessage } from '@/types/chat'
import { highlightKeywords } from '@/lib/keywords/highlightKeywords'

interface ChatMessagesProps {
  messages: ChatMessage[]
  showAssistantStatus?: boolean // 是否顯示 assistant 狀態，預設 false
  keywords?: string[] // 要 highlight 的關鍵字
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, showAssistantStatus = false, keywords = [] }) => (
  <>
    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <div className="flex flex-col items-end max-w-[75%]">
          <div
            className={`relative rounded-2xl px-4 py-2 break-words text-base shadow-md transition-all
              ${msg.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-md'
                : 'text-foreground rounded-bl-md border border-border'}
            `}
          >
            {highlightKeywords(msg.content, keywords)}
          </div>
          {showAssistantStatus && msg.role === 'assistant' && (
            <span className="text-xs text-muted-foreground mt-1 ml-2">已回覆</span>
          )}
        </div>
      </div>
    ))}
  </>
)

export default ChatMessages

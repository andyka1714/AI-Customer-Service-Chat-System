// components/ui/ChatMessages.tsx
// 訊息列表元件，支援 user/assistant 樣式
import React, { useRef, useEffect } from 'react'
import type { ChatMessage } from '@/types/chat'
import { highlightKeywords } from '@/lib/keywords/highlightKeywords'
import CustomScrollbar, { CustomScrollbarHandle } from '@/components/ui/CustomScrollbar'

interface ChatMessagesProps {
  messages: ChatMessage[]
  showAssistantStatus?: boolean // 是否顯示 assistant 狀態，預設 false
  keywords?: string[] // 要 highlight 的關鍵字
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, showAssistantStatus = false, keywords = [] }) => {
  // 取得 CustomScrollbar 控制 handle
  const scrollbarRef = useRef<CustomScrollbarHandle>(null)

  // 訊息變動時自動捲動到底部
  useEffect(() => {
    scrollbarRef.current?.scrollToBottom()
  }, [messages])

  return (
    <CustomScrollbar ref={scrollbarRef} className='h-full overflow-y-auto flex flex-col gap-2 p-4'>
      {/* 訊息列表 */}
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
    </CustomScrollbar>
  )
}

export default ChatMessages

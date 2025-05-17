// components/ui/ChatMessages.tsx
// 訊息列表元件，支援 user/assistant 樣式
import React from 'react'
import type { ChatMessage } from '@/types/chat'

interface ChatMessagesProps {
  messages: ChatMessage[]
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => (
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
            {msg.content}
          </div>
          {msg.role === 'assistant' && (
            <span className="text-xs text-muted-foreground mt-1 ml-2">已回覆</span>
          )}
        </div>
      </div>
    ))}
  </>
)

export default ChatMessages

'use client'

import { useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// 訊息型別定義
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  // 聊天訊息狀態
  const [messages, setMessages] = useState<ChatMessage[]>([])
  // 輸入框內容
  const [input, setInput] = useState('')
  // 是否正在回覆
  const [isReplying, setIsReplying] = useState(false)
  // 捲動到底部用
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 處理訊息送出
  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsReplying(true)
    // 模擬 AI 回覆
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '這是 AI 的回覆內容',
        },
      ])
      setIsReplying(false)
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 1000)
  }

  // 按下 Enter 送出
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen">
      <Card
        className="p-0 w-full max-w-[600px] h-full flex flex-col justify-between border-none bg-white/80 backdrop-blur-md overflow-hidden rounded-none shadow-none"
      >
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground select-none pt-24 m-0">
              <span className="font-bold text-2xl mb-1">開始對話吧！</span>
              <span className="text-base">請輸入訊息並送出</span>
            </div>
          )}
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
          {isReplying && (
            <div className="flex justify-start">
              <div className="relative rounded-2xl px-4 py-2 max-w-[75%] text-foreground animate-pulse border border-border rounded-bl-md">
                AI 正在輸入...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <form
          className="flex items-center gap-2 px-6 py-4 bg-white/90 backdrop-blur-md border border-border rounded-xl m-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
        >
          <Input
            className="flex-1 bg-transparent border-none focus:ring-0 focus-visible:ring-0 shadow-none text-base placeholder:text-muted-foreground"
            placeholder="請輸入訊息..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isReplying}
            autoFocus
          />
          <Button
            type="submit"
            disabled={isReplying || !input.trim()}
            className="rounded-full px-3 py-2 h-10 w-10 flex items-center justify-center bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-all"
            aria-label="發送"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="currentColor" d="M2.5 17.5l15-7.5-15-7.5v6.25l10 1.25-10 1.25v6.25z"/></svg>
          </Button>
        </form>
      </Card>
    </div>
  )
}
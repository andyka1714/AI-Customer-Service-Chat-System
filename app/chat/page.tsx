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
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-xl h-[70vh] flex flex-col justify-between shadow-lg">
        <CardContent className="flex-1 overflow-y-auto px-0 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground select-none">
              <span className="font-semibold text-lg">開始對話吧！</span>
              <span className="text-sm mt-2">請輸入訊息並送出</span>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-xl px-4 py-2 max-w-[70%] break-words text-base shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent text-accent-foreground'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isReplying && (
            <div className="flex justify-start">
              <div className="rounded-xl px-4 py-2 max-w-[70%] bg-accent text-accent-foreground animate-pulse">
                AI 正在輸入...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <form
          className="flex items-center gap-2 border-t px-6 py-4 bg-card"
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
        >
          <Input
            className="flex-1"
            placeholder="請輸入訊息..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isReplying}
            autoFocus
          />
          <Button type="submit" disabled={isReplying || !input.trim()}>
            發送
          </Button>
        </form>
      </Card>
    </div>
  )
}
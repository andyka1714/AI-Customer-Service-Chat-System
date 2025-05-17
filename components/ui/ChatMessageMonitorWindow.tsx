// components/ui/ChatMessageMonitorWindow.tsx
// 監控用 Chat message 視窗元件
import React, { useEffect, useState } from 'react'
import type { Session } from '@/types/sessions'
import { supabase } from '@/lib/supabaseClient'
import type { ChatMessage } from '@/types/chat'
import ChatMessages from '@/components/ui/ChatMessages'
import { extractMatchedKeywords } from '@/lib/keywords/extractMatchedKeywords'

interface ChatMessageMonitorWindowProps {
  session: Session
}

const ChatMessageMonitorWindow: React.FC<ChatMessageMonitorWindowProps> = ({ session }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // 取得歷史訊息
  useEffect(() => {
    if (!session.id) return
    let ignore = false
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true })
      if (!ignore && data) setMessages(data)
    }
    fetchMessages()
    return () => { ignore = true }
  }, [session.id])

  // 監聽 Realtime 頻道
  useEffect(() => {
    if (!session.id) return
    const channel = supabase
      .channel('public:messages:' + session.id)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${session.id}`,
        },
        (payload: any) => {
          setMessages(prev => {
            if (prev.some(m => m.id === payload.new.id)) return prev
            return [...prev, payload.new]
          })
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [session.id])

  // 每次訊息變動時，自動捲動到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 計算本 session 所有訊息出現過的關鍵字
  const matchedKeywords = Array.from(
    new Set(
      messages.flatMap(m => extractMatchedKeywords(m.content))
    )
  )

  return (
    <div className="border rounded-lg p-4 bg-white shadow h-[400px] flex flex-col">
      <div className="flex items-center justify-between font-bold mb-2">
        <span className="truncate max-w-[70%]" title={session.user?.name || session.id}>
          {session.user?.name || session.id}
        </span>
        {/* 狀態燈號 */}
        {(() => {
          let color = 'red-500'
          let title = '尚未有訊息或超過一小時未有訊息'
          if (session.latest_message_sent_at) {
            const latest = new Date(session.latest_message_sent_at)
            const now = new Date()
            const diffMs = now.getTime() - latest.getTime()
            const isActive = diffMs <= 60 * 60 * 1000 // 一小時內
            color = isActive ? 'green-500' : 'red-500'
            title = isActive ? '一小時內有訊息' : '超過一小時未有訊息'
          }
          // 以 currentColor 實現水波紋動畫顏色跟隨主體
          const rippleClass =
            'after:content-[" "] after:absolute after:inset-0 after:rounded-full after:animate-ping after:bg-current after:opacity-30';
          return (
            <span
              className={`w-3 h-3 rounded-full inline-block border border-gray-300 relative bg-${color} text-${color} ${rippleClass}`}
              title={title}
            />
          )
        })()}
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center">（無訊息）</div>
        ) : (
          <>
            <ChatMessages messages={messages} keywords={matchedKeywords} />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  )
}

export default ChatMessageMonitorWindow

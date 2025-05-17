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
      <div className="font-bold mb-2">{session.user?.name || session.id}</div>
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

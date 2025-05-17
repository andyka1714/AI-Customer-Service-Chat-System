'use client'

import { useRef, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card } from '@/components/ui/shadcn/card'
import { Input } from '@/components/ui/shadcn/input'
import { Button } from '@/components/ui/shadcn/button'
import { useSelector } from 'react-redux'
import CustomScrollbar from '@/components/ui/CustomScrollbar'
import { extractMatchedKeywords } from '@/lib/extractMatchedKeywords'
import type { ChatMessage } from '@/types/chat'
import ChatMessages from '@/components/ui/ChatMessages'

export default function ChatPage() {
  // 聊天訊息狀態
  const [messages, setMessages] = useState<ChatMessage[]>([])
  // 輸入框內容
  const [input, setInput] = useState('')
  // 是否正在回覆
  const [isReplying, setIsReplying] = useState(false)
  // 捲動到底部用
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // 新增聊天室 session 狀態
  const [sessionId, setSessionId] = useState<string | null>(null)
  // 取得目前用戶資訊（假設已登入，從 redux 取得 user）
  const user = useSelector((state: any) => state.user?.user)

  // 取得歷史訊息（依 sessionId）
  useEffect(() => {
    if (!sessionId) return
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
      if (data) setMessages(data)
    }
    fetchMessages()
  }, [sessionId])

  // 訂閱 Realtime（依 sessionId）
  useEffect(() => {
    if (!sessionId) return
    // 先移除舊的 channel，避免重複訂閱
    const channel = supabase
      .channel('public:messages:' + sessionId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload: any) => {
          // 檢查 payload.new 是否已存在於 messages，避免重複
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
  }, [sessionId])

  // 處理訊息送出（需有 sessionId）
  const handleSend = async () => {
    if (!input.trim() || !sessionId || !user) return
    setInput('')
    setIsReplying(true)
    // 新增使用者訊息，需取得 message id
    const { data: inserted, error } = await supabase
      .from('messages')
      .insert([
        { content: input.trim(), role: 'user', session_id: sessionId, user_id: user.id }
      ])
      .select('id')
      .single()
    if (error || !inserted) {
      setIsReplying(false)
      return
    }
    const messageId = inserted.id
    // 僅比對實際出現的關鍵字
    const matchedKeywords = extractMatchedKeywords(input.trim())
    if (matchedKeywords.length > 0) {
      // 查詢目前 session 已有的 keywords
      const { data: existedKeywords } = await supabase
        .from('message_keywords')
        .select('keyword')
        .eq('session_id', sessionId)
      const existedSet = new Set((existedKeywords || []).map((k: any) => k.keyword))
      // 過濾只插入 session 尚未出現過的 keyword
      const toInsert = matchedKeywords.filter(kw => !existedSet.has(kw))
      if (toInsert.length > 0) {
        const now = new Date().toISOString()
        await supabase.from('message_keywords').insert(
          toInsert.map((kw) => ({
            session_id: sessionId,
            message_id: messageId,
            keyword: kw,
            created_at: now
          }))
        )
      }
    }
    // 更新 session 最後訊息時間
    await supabase.from('sessions').update({ lastest_message_sended_at: new Date().toISOString() }).eq('id', sessionId)
    // 呼叫 OpenAI API 取得 AI 回覆
    try {
      // 取得目前 session 所有訊息，組成對話上下文
      const { data: allMessages } = await supabase
        .from('messages')
        .select('role,content')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
      // 組成 OpenAI 格式
      const chatHistory = (allMessages || []).map((m: any) => ({ role: m.role, content: m.content }))
      // 呼叫 OpenAI
      const { fetchOpenAIChat } = await import('@/lib/openai')
      const aiReply = await fetchOpenAIChat(chatHistory)
      // 寫入 AI 回覆訊息，取得 id
      const { data: aiInserted } = await supabase.from('messages').insert([
        { content: aiReply, role: 'assistant', session_id: sessionId, user_id: user.id }
      ]).select('id').single()
      // 比對 AI 回覆關鍵字並寫入 message_keywords（同樣僅存實際出現的）
      if (aiInserted) {
        const aiMatched = extractMatchedKeywords(aiReply)
        if (aiMatched.length > 0) {
          // 查詢目前 session 已有的 keywords（再次查詢，確保最新）
          const { data: existedKeywords2 } = await supabase
            .from('message_keywords')
            .select('keyword')
            .eq('session_id', sessionId)
          const existedSet2 = new Set((existedKeywords2 || []).map((k: any) => k.keyword))
          const toInsert2 = aiMatched.filter(kw => !existedSet2.has(kw))
          if (toInsert2.length > 0) {
            const now = new Date().toISOString()
            await supabase.from('message_keywords').insert(
              toInsert2.map((kw) => ({
                session_id: sessionId,
                message_id: aiInserted.id,
                keyword: kw,
                created_at: now
              }))
            )
          }
        }
      }
    } catch (err) {
      // 若失敗則顯示錯誤訊息
      await supabase.from('messages').insert([
        { content: 'AI 回覆失敗，請稍後再試。', role: 'assistant', session_id: sessionId, user_id: 'ai' }
      ])
    }
    setIsReplying(false)
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 按下 Ctrl+Enter 或 Cmd+Enter 才送出，避免中文輸入法誤送
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // macOS 使用 metaKey (Command)，Windows/Linux 使用 ctrlKey
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  // 頁面初始自動取得或建立 session
  useEffect(() => {
    if (!user) return
    if (sessionId) return // 已有 sessionId 就不再查詢/建立
    let isMounted = true
    const getOrCreateSession = async () => {
      // 先查詢是否有現有 session
      const { data: sessions, error } = await supabase
        .from('sessions')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
      if (!isMounted) return
      if (sessions && sessions.length > 0) {
        setSessionId(sessions[0].id)
      } else {
        // 沒有則建立新 session
        const { data, error } = await supabase
          .from('sessions')
          .insert([{ user_id: user.id }])
          .select('id')
          .single()
        if (!isMounted) return
        if (data) setSessionId(data.id)
      }
    }
    getOrCreateSession()
    return () => { isMounted = false }
  }, [user, sessionId])

  // 每次訊息或 AI 回覆狀態變動時，自動捲動到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isReplying])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <Card
        className="p-0 w-full max-w-[600px] h-full flex flex-col justify-between border-none bg-white/80 backdrop-blur-md overflow-hidden rounded-none shadow-none"
      >
        <CustomScrollbar className="flex-1 overflow-y-auto p-4 space-y-4">
          {(messages.length === 0 && !isReplying) && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground select-none pt-24 m-0">
              <span className="font-bold text-2xl mb-1">開始對話吧！</span>
              <span className="text-base">請輸入訊息並送出</span>
            </div>
          )}
          <ChatMessages messages={messages} showAssistantStatus />
          {isReplying && (
            <div className="flex justify-start">
              <div className="relative rounded-2xl px-4 py-2 max-w-[75%] text-foreground animate-pulse border border-border rounded-bl-md">
                AI 正在輸入...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CustomScrollbar>
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
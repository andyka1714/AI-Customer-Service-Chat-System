// components/ui/ChatMessageMonitorWindow.tsx
// 監控用 Chat message 視窗元件
import React, { useEffect, useState, useMemo } from 'react'
import { List, NotebookPen } from 'lucide-react'
import type { Session } from '@/types/sessions'
import type { ChatMessage } from '@/types/chat'
import { supabase } from '@/lib/supabaseClient'
import { extractMatchedKeywords } from '@/lib/keywords/extractMatchedKeywords'
import { Textarea } from '@/components/ui/shadcn/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/shadcn/dialog'
import ChatMessages from '@/components/ui/ChatMessages'
import { Button } from '@/components/ui/shadcn/button'
import { updateSessionNotes } from '@/redux/sessionsSlice'
import { useAppDispatch } from '@/redux/store'
import { toast } from "sonner"
import CustomScrollbar from '@/components/ui/CustomScrollbar'

interface ChatMessageMonitorWindowProps {
  session: Session
}

const ChatMessageMonitorWindow: React.FC<ChatMessageMonitorWindowProps> = ({ session }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [notesDialogOpen, setNotesDialogOpen] = useState(false)
  const [notes, setNotes] = useState(session.notes || '')
  const [notesLoading, setNotesLoading] = useState(false)
  const [attentionMessagesDialogOpen, setAttentionMessagesDialogOpen] = useState(false)
  const dispatch = useAppDispatch()

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

  // 計算本 session 所有訊息出現過的關鍵字
  const matchedKeywords = Array.from(
    new Set(
      messages.flatMap(m => extractMatchedKeywords(m.content))
    )
  )

  // 取得需注意訊息（role 為 user 且包含關鍵字）
  const attentionMessages = useMemo(() =>
    messages.filter(m =>
      m.role === 'user' && matchedKeywords.some(keyword => m.content.includes(keyword))
    ), [messages, matchedKeywords])

  // 總訊息數量
  const totalMessages = messages.length

  // 計算符合條件的需注意訊息數量：role 為 user 且 content 包含任一關鍵字
  const totalAttentionMessages =
  messages.filter(m =>
    m.role === 'user' && matchedKeywords.some(keyword => m.content.includes(keyword))
  ).length

  // 儲存 notes 的函式
  async function handleSaveNotes() {
    setNotesLoading(true)
    try {
      await dispatch(updateSessionNotes({ sessionId: session.id, notes })).unwrap()
      setNotesDialogOpen(false)
      // 儲存成功提示
      toast.success('備註已成功儲存')
    } catch (err) {
      // 顯示錯誤提示
      toast.error('儲存備註時發生錯誤，請稍後再試。')
    }
    setNotesLoading(false)
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow h-[400px] flex flex-col">
      <div className="flex items-center justify-between font-bold mb-2">
        <span className="truncate w-[calc(100%-70px)]" title={session.user?.name || session.id}>
          {session.user?.name || session.id}
        </span>
        {/* 狀態燈號區塊外層 Wrapper，左側加兩個 Lucide icons */}
        <div className="flex items-center gap-2 ml-2">
          <List size={16} className="text-gray-600 cursor-pointer" onClick={() => setAttentionMessagesDialogOpen(true)} />
          <NotebookPen size={16} className="text-gray-600 cursor-pointer" onClick={() => setNotesDialogOpen(true)} />
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
              'after:content-[\" \"] after:absolute after:inset-0 after:rounded-full after:animate-ping after:bg-current after:opacity-30';
            return (
              <span
                className={`w-3 h-3 rounded-full inline-block border border-gray-300 relative bg-${color} text-${color} ${rippleClass}`}
                title={title}
              />
            )
          })()}
        </div>
      </div>
      {/* 新增：訊息統計區塊 */}
      <div className="flex gap-2 text-[10px] text-gray-500 mb-1">
        <span>總訊息數：{totalMessages}</span>
        <span>需注意訊息數：{totalAttentionMessages}</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center">（無訊息）</div>
        ) : (
          <ChatMessages messages={messages} keywords={matchedKeywords} />
        )}
      </div>
      {/* 編輯 Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>編輯內部備註</DialogTitle>
          </DialogHeader>
          <Textarea
            value={notes}
            onChange={(e: any) => setNotes(e.target.value)}
            rows={6}
            placeholder="請輸入內部備註..."
            className="resize-none"
            disabled={notesLoading}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="cursor-pointer">取消</Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleSaveNotes}
              disabled={notesLoading || !notes.trim()}
              className="cursor-pointer"
            >
              {notesLoading ? '儲存中...' : '儲存'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* 關鍵字列表 Dialog */}
      <Dialog open={attentionMessagesDialogOpen} onOpenChange={setAttentionMessagesDialogOpen}>
        <DialogContent className="max-h-[90vh] h-[600px] overflow-y-auto flex flex-col">
          <DialogHeader>
            <DialogTitle>
              需注意的訊息
              <span className="ml-2 text-xs text-gray-500 font-normal">({attentionMessages.length})</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
              {attentionMessages.length === 0 ? (
                  <div className="text-gray-400 text-center py-4">（無需注意訊息）</div>
              ) : (
                <CustomScrollbar className="h-full flex flex-col gap-2 py-2 overflow-auto px-2">
                  {attentionMessages.map((m) => (
                    <div key={m.id} className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-base text-gray-700 shadow-sm max-w-full">
                      <span dangerouslySetInnerHTML={{
                        __html: matchedKeywords.reduce((acc, keyword) =>
                          acc.split(keyword).join(`<span class='bg-yellow-200 font-bold'>${keyword}</span>`), m.content)
                      }} />
                    </div>
                  ))}
                </CustomScrollbar>
              )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="cursor-pointer">關閉</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ChatMessageMonitorWindow

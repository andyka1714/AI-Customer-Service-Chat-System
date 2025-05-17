// app/monitor/page.tsx
'use client'
import React, { useEffect } from 'react'
import CustomScrollbar from '@/components/ui/CustomScrollbar'
import ChatMessageMonitorWindow from '@/components/ui/ChatMessageMonitorWindow'
import { useSelector } from 'react-redux'
import { fetchSessions, fetchActiveCount } from '@/redux/sessionsSlice'
import { useAppDispatch } from '@/redux/store'
import SearchBar from '@/components/ui/SearchBar'
import CustomPaginationProps from '@/components/ui/CustomPaginationProps'
import type { Session } from '@/types/sessions'
import { Card } from '@/components/ui/shadcn/card'
import { Skeleton } from '@/components/ui/shadcn/skeleton'
import { supabase } from '@/lib/supabaseClient'

const MonitorPage: React.FC = () => {
  // 取得 sessions 狀態
  const sessions = useSelector((state: any) => state.sessions.sessions)
  const loading = useSelector((state: any) => state.sessions.loading)
  const error = useSelector((state: any) => state.sessions.error)
  const activeCount = useSelector((state: any) => state.sessions.activeCount)
  const dispatch = useAppDispatch()

  const [page, setPage] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const pageSize = 10
  const [search, setSearch] = React.useState('')

  // 取得分頁資料
  useEffect(() => {
    dispatch(fetchSessions({ search, page, pageSize }))
      .then(res => {
        // 型別斷言 payload 結構
        const payload = res.payload as { sessions: Session[]; total: number } | undefined
        if (payload && typeof payload.total === 'number') {
          setTotal(payload.total)
        }
      })
  }, [dispatch, search, page])

  // 取得活躍對話數
  useEffect(() => {
    dispatch(fetchActiveCount())
  }, [dispatch])

  // 監聽 sessions 新增與 latest_message_sent_at 更新，及時刷新列表與活躍對話數
  useEffect(() => {
    // sessions 新增
    const sessionInsertChannel = supabase
      .channel('public:sessions-insert')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sessions' },
        () => {
          dispatch(fetchSessions({ search, page, pageSize }))
          dispatch(fetchActiveCount())
        }
      )
      .subscribe()
    // sessions 更新 latest_message_sent_at
    const sessionUpdateChannel = supabase
      .channel('public:sessions-update')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sessions' },
        (payload) => {
          if (payload.new.latest_message_sent_at !== payload.old.latest_message_sent_at) {
            dispatch(fetchSessions({ search, page, pageSize }))
            dispatch(fetchActiveCount())
          }
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(sessionInsertChannel)
      supabase.removeChannel(sessionUpdateChannel)
    }
  }, [dispatch, search, page, pageSize])

  return (
    <div className="flex flex-col items-stretch w-full h-full p-6">
      <h1 className="text-2xl font-bold mb-6 self-center">客戶對話監控管理</h1>
      {/* 活躍對話數統計卡片 */}
      <Card className="mb-3 w-full max-w-xs self-center text-center py-4 shadow-md gap-1">
        <div className="text-base font-semibold text-muted-foreground mb-1">活躍對話數（1小時內）</div>
        <div className="text-2xl font-bold text-primary">{activeCount !== null ? activeCount : '載入中...'}</div>
      </Card>
      {/* 搜尋欄位 */}
      <SearchBar func={val => { setSearch(val); setPage(1); }} placeholder="搜尋用戶名稱或 Email..." />
      <CustomScrollbar className="flex-1 overflow-y-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sessions.map((session: Session) => (
            <ChatMessageMonitorWindow key={session.id} session={session} />
          ))}
        </div>
      </CustomScrollbar>
      <CustomPaginationProps page={page} total={total} pageSize={pageSize} setPage={setPage} />
    </div>
  )
}

export default MonitorPage

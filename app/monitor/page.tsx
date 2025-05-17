// app/monitor/page.tsx
'use client'
import React, { useEffect } from 'react'
import CustomScrollbar from '@/components/ui/CustomScrollbar'
import ChatMessageMonitorWindow from '@/components/ui/ChatMessageMonitorWindow'
import { useSelector } from 'react-redux'
import { fetchSessions } from '@/redux/sessionsSlice'
import { useAppDispatch } from '@/redux/store'
import SearchBar from '@/components/ui/SearchBar'
import CustomPaginationProps from '@/components/ui/CustomPaginationProps'
import type { Session } from '@/types/sessions'

const MonitorPage: React.FC = () => {
  // 取得 sessions 狀態
  const sessions = useSelector((state: any) => state.sessions.sessions)
  const loading = useSelector((state: any) => state.sessions.loading)
  const error = useSelector((state: any) => state.sessions.error)
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

  return (
    <div className="flex flex-col items-stretch w-full h-full p-6">
      <h1 className="text-2xl font-bold mb-6 self-center">客戶對話監控管理</h1>
      {/* 搜尋欄位 */}
      <SearchBar func={val => { setSearch(val); setPage(1); }} placeholder="搜尋用戶名稱或 Email..." />
      <CustomScrollbar className="flex-1 overflow-y-auto space-y-4">
        {loading ? (
          <div className="w-full space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 h-[400px]" />
            ))}
          </div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sessions.map((session: Session) => (
              <ChatMessageMonitorWindow key={session.id} session={session} />
            ))}
          </div>
        )}
      </CustomScrollbar>
      <CustomPaginationProps page={page} total={total} pageSize={pageSize} setPage={setPage} />
    </div>
  )
}

export default MonitorPage

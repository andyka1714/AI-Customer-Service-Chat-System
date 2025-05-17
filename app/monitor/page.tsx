// app/monitor/page.tsx
'use client'
import React, { useEffect } from 'react'
import CustomScrollbar from '@/components/ui/CustomScrollbar'
import ChatMessageMonitorWindow from '@/components/ui/ChatMessageMonitorWindow'
import { useSelector } from 'react-redux'
import { fetchSessions } from '@/redux/sessionsSlice'
import { useAppDispatch } from '@/redux/store'

const MonitorPage: React.FC = () => {
  // 取得 sessions 狀態
  const sessions = useSelector((state: any) => state.sessions.sessions)
  const loading = useSelector((state: any) => state.sessions.loading)
  const error = useSelector((state: any) => state.sessions.error)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchSessions())
  }, [dispatch])

  // 只取前 10 筆 session
  const topSessions = sessions.slice(0, 10)

  return (
    <div className="flex flex-col items-stretch w-full h-full p-6">
      <h1 className="text-2xl font-bold mb-6 self-center">客戶對話監控管理</h1>
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
            {topSessions.map((session: any) => (
              <ChatMessageMonitorWindow key={session.id} session={session} />
            ))}
          </div>
        )}
      </CustomScrollbar>
    </div>
  )
}

export default MonitorPage

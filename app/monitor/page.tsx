// app/monitor/page.tsx
'use client'
import React, { useEffect, useState, useRef } from 'react'
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
  const [search, setSearch] = useState('')
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    dispatch(fetchSessions())
  }, [dispatch])

  // 只取前 10 筆 session
  const topSessions = sessions.slice(0, 10)

  // 處理 search bar 輸入，1 秒 debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      dispatch(fetchSessions(value))
    }, 1000)
  }

  return (
    <div className="flex flex-col items-stretch w-full h-full p-6">
      <h1 className="text-2xl font-bold mb-6 self-center">客戶對話監控管理</h1>
      {/* 搜尋欄位 */}
      <div className="w-full flex justify-end mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="搜尋用戶名稱或 Email..."
          className="border border-input rounded-md px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
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

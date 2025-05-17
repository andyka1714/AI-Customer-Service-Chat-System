'use client'
// app/sessions/page.tsx
// 客服對話 sessions 管理頁

import { useEffect, useState, useRef } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table'
import { useSelector } from 'react-redux'
import { fetchSessions } from '@/redux/sessionsSlice'
import { useAppDispatch } from '@/redux/store'
import type { Session } from '@/types/sessions'

export default function SessionsPage() {
  const sessions = useSelector((state: any) => state.sessions.sessions)
  const loading = useSelector((state: any) => state.sessions.loading)
  const error = useSelector((state: any) => state.sessions.error)
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState('')
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    dispatch(fetchSessions())
  }, [dispatch])

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
      <h1 className="text-2xl font-bold mb-6 self-center">客戶對話管理列表</h1>
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
      {loading ? (
        <div className="w-full space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-destructive">{error}</div>
      ) : (
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">用戶名稱</TableHead>
              <TableHead className="w-1/4">Email</TableHead>
              <TableHead className="w-1/4">最後訊息時間</TableHead>
              <TableHead className="w-1/4">建立時間</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">目前沒有任何 session</TableCell>
              </TableRow>
            ) : (
              sessions.map((s: Session) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium truncate">{s.user?.name || '未知用戶'}</TableCell>
                  <TableCell className="truncate">{s.user?.email || '-'}</TableCell>
                  <TableCell>{s.latest_message_sent_at ? new Date(s.latest_message_sent_at).toLocaleString('zh-TW') : '-'}</TableCell>
                  <TableCell>{new Date(s.created_at).toLocaleString('zh-TW')}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

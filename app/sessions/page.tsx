'use client'
// app/sessions/page.tsx
// 客服對話 sessions 管理頁

import React, { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/shadcn/skeleton'
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/shadcn/table'
import { useSelector } from 'react-redux'
import { fetchSessions } from '@/redux/sessionsSlice'
import { useAppDispatch } from '@/redux/store'
import type { Session } from '@/types/sessions'
import SearchBar from '@/components/ui/SearchBar'
import CustomPaginationProps from '@/components/ui/CustomPaginationProps'

export default function SessionsPage() {
  const sessions = useSelector((state: any) => state.sessions.sessions)
  const loading = useSelector((state: any) => state.sessions.loading)
  const error = useSelector((state: any) => state.sessions.error)
  const dispatch = useAppDispatch()

  // 分頁狀態
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10
  const [search, setSearch] = useState('')

  // 取得分頁資料
  useEffect(() => {
    dispatch(fetchSessions({ search, page, pageSize }))
      .then(res => {
        const payload = res.payload as { sessions: Session[]; total: number } | undefined
        if (payload && typeof payload.total === 'number') {
          setTotal(payload.total)
        }
      })
  }, [dispatch, search, page])

  return (
    <div className="flex flex-col items-stretch w-full h-full p-6">
      <h1 className="text-2xl font-bold mb-6 self-center">客戶對話管理列表</h1>
      {/* 搜尋欄位 */}
      <SearchBar func={value => { setSearch(value); setPage(1); }} placeholder="搜尋用戶名稱或 Email..." />
      {loading ? (
        <div className="w-full space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-destructive">{error}</div>
      ) : (
        <>
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
          {/* 分頁元件 */}
          <CustomPaginationProps page={page} total={total} pageSize={pageSize} setPage={setPage} />
        </>
      )}
    </div>
  )
}

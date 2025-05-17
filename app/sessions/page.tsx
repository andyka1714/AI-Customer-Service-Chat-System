'use client'
// app/sessions/page.tsx
// 客服對話 sessions 管理頁

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table'
import type { Session } from '@/types/sessions'

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/sessions')
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || '取得 sessions 失敗')
        setSessions(json.sessions)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [])

  return (
    <div className="flex flex-col items-stretch w-full h-full p-6">
      <h1 className="text-2xl font-bold mb-6 self-center">客戶聊天管理列表</h1>
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
              sessions.map((s) => (
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

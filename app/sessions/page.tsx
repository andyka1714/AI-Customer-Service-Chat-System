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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/shadcn/dialog'
import { Button } from '@/components/ui/shadcn/button'
import { Textarea } from '@/components/ui/shadcn/textarea'
import { NotebookPen } from 'lucide-react'
import { toast } from 'sonner'
import { updateSessionNotes } from '@/redux/sessionsSlice'

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

  // 編輯備註 Dialog 狀態
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editSessionId, setEditSessionId] = useState<string | null>(null)
  const [editNotes, setEditNotes] = useState('')
  const [editLoading, setEditLoading] = useState(false)

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

  // 開啟編輯 Dialog
  const handleEditNotes = (session: Session) => {
    setEditSessionId(session.id)
    setEditNotes(session.notes || '')
    setEditDialogOpen(true)
  }
  // 關閉 Dialog
  const handleCloseDialog = () => {
    setEditDialogOpen(false)
    setEditSessionId(null)
    setEditNotes('')
  }
  // 儲存備註（呼叫 redux thunk）
  const handleSaveNotes = async () => {
    if (!editSessionId) return
    setEditLoading(true)
    try {
      await dispatch(updateSessionNotes({ sessionId: editSessionId, notes: editNotes })).unwrap()
      setEditDialogOpen(false)
      toast.success('備註已成功儲存')
    } catch (err) {
      toast.error('儲存備註時發生錯誤，請稍後再試。')
    }
    setEditLoading(false)
  }

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
                <TableHead className="w-1/6">用戶名稱</TableHead>
                <TableHead className="w-1/6">Email</TableHead>
                <TableHead className="w-1/6">訊息數量</TableHead> {/* 新增訊息數量欄位 */}
                <TableHead className="w-1/6">最後訊息時間</TableHead>
                <TableHead className="w-1/6">備註</TableHead>
                <TableHead className="w-1/6">建立時間</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">目前沒有任何 session</TableCell>
                </TableRow>
              ) : (
                sessions.map((s: Session) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium truncate">{s.user?.name || '未知用戶'}</TableCell>
                    <TableCell className="truncate">{s.user?.email || '-'}</TableCell>
                    <TableCell>{s.messages_count ?? '-'}</TableCell> {/* 顯示訊息數量 */}
                    <TableCell>{s.latest_message_sent_at ? new Date(s.latest_message_sent_at).toLocaleString('zh-TW') : '-'}</TableCell>
                    <TableCell className="truncate max-w-[200px] flex items-center gap-2">
                      {s.notes || <span className="text-gray-400">（無備註）</span>}
                      <NotebookPen size={16} className="text-gray-600 cursor-pointer ml-1" onClick={() => handleEditNotes(s)} />
                    </TableCell>
                    <TableCell>{new Date(s.created_at).toLocaleString('zh-TW')}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {/* 分頁元件 */}
          <CustomPaginationProps page={page} total={total} pageSize={pageSize} setPage={setPage} />
          {/* 編輯備註 Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>編輯內部備註</DialogTitle>
              </DialogHeader>
              <Textarea
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                rows={6}
                placeholder="請輸入內部備註..."
                className="resize-none"
                disabled={editLoading}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="cursor-pointer">取消</Button>
                </DialogClose>
                <Button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={editLoading || !editNotes.trim()}
                  className="cursor-pointer"
                >
                  {editLoading ? '儲存中...' : '儲存'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}

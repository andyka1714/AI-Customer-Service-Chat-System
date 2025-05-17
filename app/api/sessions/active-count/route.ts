// app/api/sessions/active-count/route.ts
// 取得一小時內有訊息互動的活躍對話數
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  // 權限檢查：僅 admin 可用
  const cookieStore = await cookies();
  const userRole = cookieStore.get('user_role')?.value;
  if (userRole !== 'admin') {
    return NextResponse.json({ error: '無權限' }, { status: 403 })
  }
  // 取得一小時前的時間（UTC）
  const now = new Date()
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  // 查詢 latest_message_sent_at 在一小時內的 session
  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('id, latest_message_sent_at, users!inner(role)')
    .gte('latest_message_sent_at', oneHourAgo.toISOString())
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  // 過濾 admin
  const activeCount = (sessions || []).filter((s: any) => s.users?.role !== 'admin').length
  return NextResponse.json({ activeCount })
}

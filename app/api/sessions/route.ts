// app/api/sessions/route.ts
// Sessions API：取得所有 sessions，僅限 admin 權限
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: NextRequest) {
  // 從 cookie 取得 user_role，僅 admin 可用
  const cookieStore = await cookies();
  const userRole = cookieStore.get('user_role')?.value;
  if (userRole !== 'admin') {
    return NextResponse.json({ error: '無權限' }, { status: 403 })
  }
  // 查詢所有 sessions，inner join users table 取得基本資料
  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('id, user_id, latest_message_sent_at, created_at, notes, users!inner(id, name, email)')
    .order('latest_message_sent_at', { ascending: false })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  // 將 users 欄位展平成 user，並移除 users 欄位
  const result = (sessions || []).map((s: any) => {
    const { users, ...rest } = s
    return {
      ...rest,
      user: users ? { id: users.id, name: users.name, email: users.email } : null
    }
  })
  return NextResponse.json({ sessions: result })
}

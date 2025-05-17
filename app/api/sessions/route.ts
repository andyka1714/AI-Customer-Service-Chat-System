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
  // 取得 search query
  const { searchParams } = req.nextUrl
  const search = searchParams.get('search')?.trim() || ''
  // 查詢 sessions，支援名稱/Email 模糊搜尋
  let query = supabase
    .from('sessions')
    .select('id, user_id, latest_message_sent_at, created_at, notes, users!inner(id, role, name, email)')
    .order('latest_message_sent_at', { ascending: false })
  if (search) {
    // 正確針對 join 的 users table 做 or 模糊搜尋
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`, { foreignTable: 'users' })
  }
  const { data: sessions, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  const result = (sessions || [])
    .filter((s: any) => s.users?.role !== 'admin')
    .map((s: any) => {
      const { users: user, ...rest } = s
      return {
        ...rest,
        user: user ? { id: user.id, name: user.name, email: user.email } : null
      }
    })
  return NextResponse.json({ sessions: result })
}

// app/api/sessions/update-notes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: NextRequest) {
  const { sessionId, notes } = await req.json()
  if (!sessionId) {
    return NextResponse.json({ error: '缺少 sessionId' }, { status: 400 })
  }
  const { error } = await supabase
    .from('sessions')
    .update({ notes })
    .eq('id', sessionId)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}

import { NextResponse } from 'next/server'
import { validateLoginApi } from '@/validators/api/signin'
import { checkAccount } from '@/lib/accounts'
import { serialize } from 'cookie'

export async function POST(request: Request) {
  const data = await request.json()
  const errors = validateLoginApi(data)

  if (errors.email || errors.password) {
    return NextResponse.json({ success: false, errors }, { status: 400 })
  }

  const user = checkAccount(data)
  if (user) {
    // 設定 user_token 與 user_role cookie
    const response = NextResponse.json({ success: true, user })
    response.headers.append('Set-Cookie', serialize('user_token', user.token, { path: '/', httpOnly: false }))
    response.headers.append('Set-Cookie', serialize('user_role', user.role, { path: '/', httpOnly: false }))
    return response
  } else {
    return NextResponse.json({ success: false, errors: { password: '帳號或密碼錯誤' } }, { status: 401 })
  }
}

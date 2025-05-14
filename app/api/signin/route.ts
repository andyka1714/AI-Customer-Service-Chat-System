import { NextResponse } from 'next/server'
import { validateLoginApi } from '@/validators/api/signin'
import { checkAccount } from '@/lib/accounts'

export async function POST(request: Request) {
  const body = await request.json()
  const { email, password } = body
  const errors = validateLoginApi({ email, password })

  if (errors.email || errors.password) {
    return NextResponse.json({ success: false, errors }, { status: 400 })
  }

  const user = checkAccount(email, password)
  if (user) {
    return NextResponse.json({ success: true, user })
  } else {
    return NextResponse.json({ success: false, errors: { password: '帳號或密碼錯誤' } }, { status: 401 })
  }
}

import { NextResponse } from 'next/server'
import { validateLoginApi } from '@/validators/api/signin'
import { checkAccount } from '@/lib/accounts'

export async function POST(request: Request) {
  const data = await request.json()
  const errors = validateLoginApi(data)

  if (errors.email || errors.password) {
    return NextResponse.json({ success: false, errors }, { status: 400 })
  }

  const user = checkAccount(data)
  if (user) {
    return NextResponse.json({ success: true, user })
  } else {
    return NextResponse.json({ success: false, errors: { password: '帳號或密碼錯誤' } }, { status: 401 })
  }
}

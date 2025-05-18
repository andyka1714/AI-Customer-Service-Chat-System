// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 僅攔截 /sessions 路徑
  if (request.nextUrl.pathname.startsWith('/sessions')) {
    // 從 cookie 取得 user_role
    const userRole = request.cookies.get('user_role')?.value
    const token = request.cookies.get('user_token')?.value
    // 未登入或非 admin 則導向 /chat
    if (!token || userRole !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/chat'
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/sessions/:path*'],
}

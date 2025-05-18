// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 僅攔截 root path 並依角色導向
  if (request.nextUrl.pathname === '/') {
    const userRole = request.cookies.get('user_role')?.value
    if (userRole === 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/monitor'
      return NextResponse.redirect(url)
    }
    if (userRole === 'user') {
      const url = request.nextUrl.clone()
      url.pathname = '/chat'
      return NextResponse.redirect(url)
    }
  }

  // 當進入 /sessions 時，若為 user 則導向 /chat
  if (request.nextUrl.pathname.startsWith('/sessions')) {
    // 從 cookie 取得 user_role
    const userRole = request.cookies.get('user_role')?.value
    // 未登入或非 admin 則導向 /chat
    if (userRole !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/chat'
      return NextResponse.redirect(url)
    }
  }

  // 當進入 /chat 時，若為 admin 則導向 /monitor
  if (request.nextUrl.pathname === '/chat') {
    const userRole = request.cookies.get('user_role')?.value
    console.log('userRole', userRole)
    if (userRole === 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/monitor'
      return NextResponse.redirect(url)
    }
  }

  // 當進入 /monitor 時，若為 user 則導向 /chat
  if (request.nextUrl.pathname === '/monitor') {
    const userRole = request.cookies.get('user_role')?.value
    if (userRole === 'user') {
      const url = request.nextUrl.clone()
      url.pathname = '/chat'
      return NextResponse.redirect(url)
    }
  }

  // 除了 /signin 頁面，其他頁面都需檢查 token，無 token 則導向 /signin
  if (request.nextUrl.pathname !== '/signin') {
    const token = request.cookies.get('user_token')?.value
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/signin'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/sessions', '/chat'],
}

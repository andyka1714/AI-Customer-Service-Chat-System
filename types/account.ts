// types/account.ts
// 帳戶相關型別定義

export type UserRole = 'user' | 'admin'

export interface Account {
  id: string
  email: string
  password: string
  role: UserRole
  name: string
}

// checkAccount 回傳型別（不含密碼，含 mock token）
export interface AccountAuthResult {
  id: string
  email: string
  role: UserRole
  name: string
  token: string
}

// 登入驗證參數型別
export interface AccountAuthParams {
  email: string
  password: string
}

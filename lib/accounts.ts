// 帳戶管理（可用於登入驗證）
export type UserRole = 'user' | 'admin'

export interface Account {
  email: string
  password: string
  role: UserRole
  name: string
}

export const accounts: Account[] = [
  { email: 'user1@acme.com', password: '123456', role: 'user', name: '用戶一' },
  { email: 'user2@acme.com', password: '654321', role: 'user', name: '用戶二' },
  { email: 'user3@acme.com', password: 'abc123', role: 'user', name: '用戶三' },
  { email: 'admin@acme.com', password: 'admin888', role: 'admin', name: '管理員' },
]

export function checkAccount(email: string, password: string) {
  // 回傳不包含密碼的 user data
  const found = accounts.find(
    (acc) => acc.email === email && acc.password === password
  )
  if (!found) return null
  // 移除密碼欄位
  const { password: _pw, ...userData } = found
  return userData
}

import { randomUUID } from 'crypto'
import type { Account, UserRole, AccountAuthResult, AccountAuthParams } from '@/types/account'

// 帳戶管理（可用於登入驗證）
export { UserRole }

export const accounts: Account[] = [
  { id: 'd919a3d4-2576-4e09-bb85-15d2fa40671c', email: 'user1@acme.com', password: '123456', role: 'user', name: '用戶一' },
  { id: 'b589bda2-7c36-4cec-9caf-b41ce5b3e3ec', email: 'user2@acme.com', password: '123456', role: 'user', name: '用戶二' },
  { id: '3c6c043d-f178-4430-916f-6b273dc0b71f', email: 'user3@acme.com', password: '123456', role: 'user', name: '用戶三' },
  { id: 'af0fe077-64cc-4073-a95e-bdcfa8d8c927', email: 'admin@acme.com', password: 'admin888', role: 'admin', name: '管理員' },
]

export function checkAccount(params: AccountAuthParams): AccountAuthResult | null {
  const { email, password } = params
  // 回傳不包含密碼的 user data，並加上 mock token
  const found = accounts.find(
    (acc) => acc.email === email && acc.password === password
  )
  if (!found) return null
  // 產生 mock token
  const token = randomUUID()
  // 移除密碼欄位
  const { password: _pw, ...userData } = found
  return { ...userData, token }
}

// types/redux/user.ts
// Redux user 狀態相關型別
import type { UserRole } from '@/types/account'
import type { SignInErrors } from '@/types/auth'

export interface UserInfo {
  email: string
  name: string
  role: UserRole
  token?: string
}

export interface UserState {
  user: UserInfo | null
  loading: boolean
  errors: SignInErrors
}

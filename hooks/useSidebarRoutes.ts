// hooks/useSidebarRoutes.ts
// 根據 user role 回傳可顯示的 sidebar routes
import { useSelector } from 'react-redux'
import { sidebarRoutes } from '@/lib/routes'

export function useSidebarRoutes() {
  const user = useSelector((state: any) => state.user?.user)
  const userRole = user?.role
  // 依 roles 權限過濾
  return sidebarRoutes.filter(item => item.roles.includes(userRole))
}

// lib/routes.ts
// Sidebar 路由與標題、icon 設定（集中管理）
import { MessageSquareMore, ListChecks } from 'lucide-react'

export interface SidebarRoute {
  title: string
  url: string
  icon: any // lucide-react icon component
  roles: string[] // 可存取此 route 的角色
}

export const sidebarRoutes: SidebarRoute[] = [
  {
    title: '智能客服',
    url: '/chat',
    icon: MessageSquareMore,
    roles: ['user', 'admin'],
  },
  {
    title: '對話管理',
    url: '/sessions',
    icon: ListChecks,
    roles: ['admin'],
  },
]

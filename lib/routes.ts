// lib/routes.ts
// Sidebar 路由與標題、icon 設定（集中管理）
import { MessageSquareMore, Monitor } from 'lucide-react'

export interface SidebarRoute {
  title: string
  url: string
  icon: any // lucide-react icon component
  roles: string[] // 可存取此 route 的角色
}

export const sidebarRoutes: SidebarRoute[] = [
  {
    title: '聊天',
    url: '/chat',
    icon: MessageSquareMore,
    roles: ['user', 'admin'],
  },
  {
    title: '對話監控',
    url: '/sessions',
    icon: Monitor,
    roles: ['admin'],
  },
]

import { LogOut, ChevronUp } from "lucide-react"
import { useSelector, useDispatch } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'
import { signoutUser } from '@/redux/userSlice'
import Link from 'next/link'
import { useSidebarRoutes } from '@/hooks/useSidebarRoutes'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/shadcn/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu"

export function AppSidebar() {
  // 取得 redux user name 與 role
  const user = useSelector((state: any) => state.user?.user)
  const userName = user?.name || '使用者'
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()

  // 取得可顯示的 sidebar routes
  const filteredRoutes = useSidebarRoutes()

  // 登出處理
  const handleLogout = async () => {
    await dispatch(signoutUser() as any)
    router.replace('/signin')
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-bold">TransBiz 智能客服系統</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredRoutes.map((item) => (
                <SidebarMenuItem key={item.title} data-active={pathname === item.url}>
                  <SidebarMenuButton asChild data-active={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="w-full">
          <SidebarMenuItem className="w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  {userName}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-60"
              >
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut />
                  <span>登出</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

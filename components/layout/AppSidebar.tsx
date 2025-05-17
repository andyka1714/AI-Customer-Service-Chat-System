import { Monitor, MessageSquareMore, LogOut, ChevronUp } from "lucide-react"
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { signoutUser } from '@/redux/userSlice'

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
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Menu items.
const items = [
  {
    title: "Chat",
    url: "#",
    icon: MessageSquareMore,
  },
  {
    title: "Monitor",
    url: "#",
    icon: Monitor,
  },
]

export function AppSidebar() {
  // 取得 redux user name，型別斷言 state 為 RootState
  const userName = useSelector((state: any) => (state.user?.user?.name ? state.user.user.name : '使用者'))
  const dispatch = useDispatch()
  const router = useRouter()

  // 登出處理
  const handleLogout = async () => {
    await dispatch(signoutUser() as any)
    router.replace('/signin')
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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

'use client'

import { usePathname } from 'next/navigation'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Header } from "@/components/layout/Header"
import type { AppLayoutProps } from '@/types/layout'

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const isSignin = pathname === '/signin'

 if (isSignin) return <>{children}</>

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full flex flex-col h-screen overflow-hidden'>
        <Header />
        {children}
      </main>
    </SidebarProvider>
  )
}

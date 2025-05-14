'use client'

import { usePathname } from 'next/navigation'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Header } from "@/components/layout/Header"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const isSignin = pathname === '/signin'

 if (isSignin) return <>{children}</>

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full'>
        <Header />
        {children}
      </main>
    </SidebarProvider>
  )
}

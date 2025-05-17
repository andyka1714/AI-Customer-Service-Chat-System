// Header 元件，左側有 sidebar toggle button，右側可擴充
'use client'

import * as React from 'react'
import { Button } from '@/components/ui/shadcn/button'
import { PanelRight } from "lucide-react"
import { useSidebar } from "@/components/ui/shadcn/sidebar"

export function Header() {
  const { toggleSidebar } = useSidebar()
  return (
    <header className="flex items-center h-16 px-4 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      {/* Sidebar toggle button，僅手機版顯示 */}
      <Button
        variant="ghost"
        className="mr-2"
        aria-label="開啟選單"
        onClick={toggleSidebar}
      >
        <PanelRight className="w-6 h-6 text-primary" />
      </Button>
      {/* 右側可放用戶資訊、通知等 */}
      <div className="ml-auto flex items-center gap-2">
        {/* ...可擴充內容... */}
      </div>
    </header>
  )
}

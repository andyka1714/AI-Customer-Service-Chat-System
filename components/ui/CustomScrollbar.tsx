// components/ui/CustomScrollbar.tsx
// 自訂可自動隱藏的捲軸元件，支援 children 傳入
import { useRef, useState, useEffect } from 'react'
import type { CustomScrollbarProps } from '@/types/scrollbar'

export default function CustomScrollbar({ children, className = '', style }: CustomScrollbarProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollbar, setShowScrollbar] = useState(true)
  const hideTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const content = scrollRef.current
    if (!content) return
    // 滾動時顯示捲軸，1 秒後自動隱藏
    const handleScroll = () => {
      setShowScrollbar(true)
      if (hideTimer.current) clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => setShowScrollbar(false), 1000)
    }
    content.addEventListener('scroll', handleScroll)
    // 初始 1 秒後隱藏
    hideTimer.current = setTimeout(() => setShowScrollbar(false), 1000)
    return () => {
      content.removeEventListener('scroll', handleScroll)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  return (
    <div
      ref={scrollRef}
      className={`custom-scrollbar${showScrollbar ? '' : ' hide-scrollbar'} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

// components/ui/CustomScrollbar.tsx
// 自訂可自動隱藏的捲軸元件，支援 children 傳入
import React, { useRef, useImperativeHandle, forwardRef, useEffect, useState } from 'react'
import type { CustomScrollbarProps } from '@/types/scrollbar'

export interface CustomScrollbarHandle {
  scrollToBottom: () => void
}

const CustomScrollbar = forwardRef<CustomScrollbarHandle, CustomScrollbarProps>(
  ({ children, className = '', style }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [showScrollbar, setShowScrollbar] = useState(true)
    const hideTimer = useRef<NodeJS.Timeout | null>(null)

    // 暴露 scrollToBottom 方法給父層
    useImperativeHandle(ref, () => ({
      scrollToBottom: () => {
        if (scrollRef.current) {
          // 使用 scrollTo 支援 smooth 行為
          scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth',
          })
        }
      }
    }))

    useEffect(() => {
      hideTimer.current = setTimeout(() => setShowScrollbar(false), 1000)
      return () => {
        if (hideTimer.current) clearTimeout(hideTimer.current)
      }
    }, [])

    return (
      <div
        ref={scrollRef}
        className={`custom-scrollbar${showScrollbar ? '' : ' hide-scrollbar'} ${className}`}
        style={style}
        onScroll={e => {
          e.stopPropagation()
          setShowScrollbar(true)
          if (hideTimer.current) clearTimeout(hideTimer.current)
          hideTimer.current = setTimeout(() => setShowScrollbar(false), 1000)
        }}
      >
        {children}
      </div>
    )
  }
)

export default CustomScrollbar

// types/scrollbar.ts
// CustomScrollbar 元件的 props 型別
import type { ReactNode } from 'react'

export interface CustomScrollbarProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

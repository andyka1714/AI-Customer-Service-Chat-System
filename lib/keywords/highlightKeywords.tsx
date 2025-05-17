// lib/highlightKeywords.tsx
// 將訊息內容中的關鍵字加上高亮樣式
import React from 'react'

export function highlightKeywords(text: string, keywords: string[] = []) {
  if (!keywords.length) return text
  // 避免關鍵字重複與特殊字元
  const escaped = keywords.filter(Boolean).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!escaped.length) return text
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    keywords.some(k => k && part.toLowerCase() === k.toLowerCase())
      ? <span key={i} className="bg-yellow-200 text-yellow-900 font-bold px-1 rounded">{part}</span>
      : part
  )
}

// lib/extractMatchedKeywords.ts
// 關鍵字比對工具函式，僅回傳實際出現在 text 內容中的 keywords（不重複，且以實際出現的原字串為主）
import { keywords } from './keywords'

export function extractMatchedKeywords(text: string): string[] {
  if (!text) return []
  const matched: string[] = []
  // 以原始順序逐一比對，僅取實際出現的片段
  keywords.forEach((kw) => {
    // 以 indexOf 判斷是否出現，並避免重複
    if (text.indexOf(kw) !== -1 && !matched.includes(kw)) {
      matched.push(kw)
    }
  })
  return matched
}

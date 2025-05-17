// components/ui/SearchBar.tsx
// 通用搜尋欄位元件，支援 value、onChange、placeholder props
// 使用 shadcn 樣式，支援外部 className 傳入
import React from 'react'

interface SearchBarProps {
  func: (value: string) => void // 直接傳入要執行的 function
  placeholder?: string
  className?: string
  debounceMs?: number
}

const SearchBar: React.FC<SearchBarProps> = ({
  func,
  placeholder = '搜尋...',
  className = '',
  debounceMs = 1000,
}) => {
  const [search, setSearch] = React.useState('')
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null)

  // 處理輸入與 debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearch(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      func(val)
    }, debounceMs)
  }

  return (
    <div className={`w-full flex justify-start mb-4 ${className}`}>
      <input
        type="text"
        value={search}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="border border-input rounded-md px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  )
}

export default SearchBar

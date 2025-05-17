// components/ui/CustomPagination.tsx
// 監控頁面專用分頁元件，shadcn 樣式
import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
} from '@/components/ui/shadcn/pagination'
import { Button } from '@/components/ui/shadcn/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CustomPaginationProps {
  page: number
  total: number
  pageSize: number
  setPage: (page: number) => void
}

const CustomPagination: React.FC<CustomPaginationProps> = ({ page, total, pageSize, setPage }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            aria-label="上一頁"
            className="cursor-pointer"
          >
            <span className="sr-only">上一頁</span>
            <ChevronLeft className="size-4" />
          </Button>
        </PaginationItem>
        {/* 動態產生分頁按鈕，僅顯示前後 2 頁與首尾 */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
          .map((p, idx, arr) => (
            <React.Fragment key={p}>
              {idx > 0 && p - arr[idx - 1] > 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <Button
                  variant={p === page ? 'outline' : 'ghost'}
                  size="icon"
                  onClick={() => setPage(p)}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </Button>
              </PaginationItem>
            </React.Fragment>
          ))}
        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            aria-label="下一頁"
            className="cursor-pointer"
          >
            <span className="sr-only">下一頁</span>
            <ChevronRight className="size-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default CustomPagination

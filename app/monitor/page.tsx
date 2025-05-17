// app/monitor/page.tsx
'use client'
import React from 'react'
import CustomScrollbar from '@/components/ui/CustomScrollbar'

// 基本 Chat message 視窗元件
const ChatMessageWindow: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow min-h-[300px] flex flex-col">
      <div className="font-bold mb-2">對話視窗 {sessionId}</div>
      {/* 這裡未來可放入訊息列表、輸入框等 */}
      <div className="text-gray-500 flex-1">（訊息內容顯示區）</div>
    </div>
  )
}

const MonitorPage: React.FC = () => {
  // 模擬 10 個對話 session id，未來可串接 API
  const sessionIds = Array.from({ length: 10 }, (_, i) => `session-${i + 1}`)

  return (
    <div className="flex flex-col items-stretch w-full h-full p-6">
      <h1 className="text-2xl font-bold mb-6 self-center">客戶對話監控管理</h1>
      <CustomScrollbar className="flex-1 overflow-y-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
          {sessionIds.map((id) => (
            <ChatMessageWindow key={id} sessionId={id} />
          ))}
        </div>
      </CustomScrollbar>
    </div>
  )
}

export default MonitorPage

// app/monitor/page.tsx
'use client'
import React from 'react'
import CustomScrollbar from '@/components/ui/CustomScrollbar'
import ChatMessageMonitorWindow from '@/components/ui/ChatMessageMonitorWindow'

const MonitorPage: React.FC = () => {
  // 模擬 10 個對話 session id，未來可串接 API
  const sessionIds = Array.from({ length: 10 }, (_, i) => `session-${i + 1}`)

  return (
    <div className="flex flex-col items-stretch w-full h-full p-6">
      <h1 className="text-2xl font-bold mb-6 self-center">客戶對話監控管理</h1>
      <CustomScrollbar className="flex-1 overflow-y-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
          {sessionIds.map((id) => (
            <ChatMessageMonitorWindow key={id} sessionId={id} />
          ))}
        </div>
      </CustomScrollbar>
    </div>
  )
}

export default MonitorPage

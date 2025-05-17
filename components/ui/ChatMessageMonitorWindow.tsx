// components/ui/ChatMessageMonitorWindow.tsx
// 監控用 Chat message 視窗元件
import React from 'react'
import type { Session } from '@/types/sessions'

interface ChatMessageMonitorWindowProps {
  session: Session
}

const ChatMessageMonitorWindow: React.FC<ChatMessageMonitorWindowProps> = ({ session }) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow min-h-[300px] flex flex-col">
      <div className="font-bold mb-2">{session.user?.name || session.id}</div>
      {/* 這裡未來可放入訊息列表、輸入框等 */}
      <div className="text-gray-500 flex-1">（訊息內容顯示區）</div>
    </div>
  )
}

export default ChatMessageMonitorWindow

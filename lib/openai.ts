// lib/openai.ts
// 封裝 OpenAI Chat API 請求

export async function fetchOpenAIChat(messages: { role: 'user' | 'assistant', content: string }[]) {
  // 呼叫自訂 API Route
  const response = await fetch('/api/chat-completion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4-1106-preview',
      messages: [
        // 系統提示詞，要求 AI 回覆簡短
        {
          role: 'system',
          content: '請用繁體中文回答，內容盡量簡短，維持在 50 字內，若內容較複雜則不超過 100 字。',
        },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
    }),
  })
  if (!response.ok) {
    throw new Error('OpenAI API 代理回應失敗')
  }
  const data = await response.json()
  // 回傳 AI 回覆內容
  return data.choices?.[0]?.message?.content || ''
}

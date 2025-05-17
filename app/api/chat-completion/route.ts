// Next.js API Route：代理 OpenAI Chat API 請求
import OpenAI from 'openai'

export const runtime = 'edge'

export async function POST(req: Request) {
  // 取得 .env.local 的 OpenAI API 金鑰
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: '缺少 OPENAI_API_KEY' }), { status: 500 })
  }
  const body = await req.json()
  // 初始化 OpenAI SDK
  const openai = new OpenAI({ apiKey })
  try {
    // 呼叫 OpenAI SDK chat.completions.create
    const completion = await openai.chat.completions.create({
      ...body,
    })
    return new Response(JSON.stringify(completion), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'OpenAI 請求失敗' }), { status: 500 })
  }
}

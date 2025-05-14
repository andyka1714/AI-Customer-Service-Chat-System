"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { validateLogin } from "@/validators/ui/signin"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  // 處理登入送出
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validateLogin({ email, password })
    setErrors(validation)
    if (validation.email || validation.password) {
      setLoading(false)
      return
    }
    setLoading(true)
    // 模擬登入流程
    setTimeout(() => {
      setLoading(false)
      router.push("/chat")
    }, 1000)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-background">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white/90 border border-border rounded-xl shadow-md px-8 py-10 flex flex-col items-center"
      >
        <h1 className="text-xl font-semibold mb-2">登入</h1>
        <p className="text-sm text-muted-foreground mb-6">請輸入您的電子郵件與密碼登入</p>
        <div className="w-full mb-4">
          <label className="block text-xs mb-1 text-muted-foreground" htmlFor="email">電子郵件</label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="user@acme.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="mb-2"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div className="w-full mb-6">
          <label className="block text-xs mb-1 text-muted-foreground" htmlFor="password">密碼</label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="請輸入密碼"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>
        <Button
          type="submit"
          className="w-full mb-4"
          disabled={loading}
        >
          {loading ? "登入中..." : "登入"}
        </Button>
      </form>
    </div>
  )
}

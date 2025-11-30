"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    console.log("[v0] Login attempt for:", email)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("[v0] Login response:", { data, error: signInError })

      if (signInError) {
        console.error("[v0] Login error:", signInError)
        setError("이메일 또는 비밀번호가 올바르지 않습니다.")
        setLoading(false)
        return
      }

      console.log("[v0] Login successful, redirecting...")

      if (typeof window !== "undefined" && data.session) {
        localStorage.setItem("session", JSON.stringify(data.session))
      }

      // 관리자 계정인지 확인
      if (data.user?.email === "admin@aidaily.com") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
      router.refresh()
    } catch (err) {
      console.error("[v0] Login exception:", err)
      setError("로그인 중 오류가 발생했습니다.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <span className="text-4xl">✨</span>
            <span className="text-foreground font-bold tracking-tight">보험사 데일리 메시지</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>로그인</CardTitle>
            <CardDescription>계정에 로그인하여 뉴스 생성을 시작하세요</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && <div className="p-3 text-sm text-foreground bg-muted rounded-lg border">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="text-sm text-right">
                <Link href="/auth/reset-password" className="text-foreground hover:underline font-medium">
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={loading}>
                {loading ? "로그인 중..." : "로그인"}
              </Button>

              <div className="text-sm text-center text-muted-foreground">
                계정이 없으신가요?{" "}
                <Link href="/auth/signup" className="text-foreground hover:underline font-medium">
                  회원가입
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

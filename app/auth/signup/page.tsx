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

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.")
      return
    }

    setLoading(true)

    console.log("[v0] Signup attempt for:", email)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            typeof window !== "undefined" ? `${window.location.origin}/auth/callback?next=/dashboard` : undefined,
          data: {
            name: name,
            full_name: name,
            display_name: name,
            service_name: "AI Daily Content",
          },
        },
      })

      console.log("[v0] Signup response:", { data, error: signUpError })

      if (signUpError) {
        console.error("[v0] Signup error:", signUpError)
        setError(signUpError.message)
        setLoading(false)
        return
      }

      console.log("[v0] Signup successful")

      // No need to manually insert - the trigger handles it when auth.users row is created

      // Redirect based on whether session exists (email confirmation required or not)
      if (data.session) {
        // Email confirmation disabled - direct login
        router.push("/dashboard")
      } else {
        // Email confirmation required - show verification page
        router.push("/auth/verify-email")
      }
    } catch (err: any) {
      console.error("[v0] Signup exception:", err)
      setError(err.message || "회원가입 중 오류가 발생했습니다.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <span className="text-4xl">✨</span>
            <span className="text-foreground font-bold tracking-tight">보험사 데일리 메시지</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>회원가입</CardTitle>
            <CardDescription>무료로 가입하고 뉴스 생성을 시작하세요</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && <div className="p-3 text-sm text-foreground bg-muted rounded-lg border">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={loading}>
                {loading ? "가입 중..." : "회원가입"}
              </Button>

              <div className="text-sm text-center text-muted-foreground">
                이미 계정이 있으신가요?{" "}
                <Link href="/auth/login" className="text-foreground hover:underline font-medium">
                  로그인
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

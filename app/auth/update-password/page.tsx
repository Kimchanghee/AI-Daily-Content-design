"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [validSession, setValidSession] = useState(false)

  useEffect(() => {
    // 비밀번호 재설정 세션 확인
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      setValidSession(!!data.session)
    }
    checkSession()
  }, [])

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

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      alert("비밀번호가 성공적으로 변경되었습니다.")
      router.push("/auth/login")
    } catch (err: any) {
      setError(err.message || "비밀번호 변경 중 오류가 발생했습니다.")
      setLoading(false)
    }
  }

  if (!validSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>세션이 만료되었습니다</CardTitle>
            <CardDescription>비밀번호 재설정 링크가 유효하지 않거나 만료되었습니다.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/auth/reset-password">다시 시도하기</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
              AI Daily Content
            </span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>새 비밀번호 설정</CardTitle>
            <CardDescription>새로운 비밀번호를 입력해주세요</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="password">새 비밀번호</Label>
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

            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "변경 중..." : "비밀번호 변경"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

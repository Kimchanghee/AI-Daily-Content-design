"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (resetError) {
        setError(resetError.message)
        setLoading(false)
        return
      }

      setSubmitted(true)
      setLoading(false)
    } catch (err) {
      setError("비밀번호 재설정 요청 중 오류가 발생했습니다.")
      setLoading(false)
    }
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
            <CardTitle>비밀번호 재설정</CardTitle>
            <CardDescription>
              {submitted ? "비밀번호 재설정 링크를 이메일로 전송했습니다." : "가입하신 이메일 주소를 입력해주세요"}
            </CardDescription>
          </CardHeader>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

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
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "전송 중..." : "재설정 링크 보내기"}
                </Button>

                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  로그인으로 돌아가기
                </Link>
              </CardFooter>
            </form>
          ) : (
            <CardFooter className="flex flex-col gap-4">
              <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm">
                <p className="font-medium mb-1">이메일을 확인해주세요</p>
                <p className="text-green-600">{email}로 비밀번호 재설정 링크를 전송했습니다.</p>
              </div>

              <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
                <ArrowLeft className="w-4 h-4" />
                로그인으로 돌아가기
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}

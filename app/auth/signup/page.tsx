"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

const DEFAULT_AVATAR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+PGNpcmNsZSBjeD0iNjAiIGN5PSI2MCIgcj0iNjAiIGZpbGw9IiNlNWU3ZWIiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjQ1IiByPSIyMCIgZmlsbD0iIzliYTFhYiIvPjxwYXRoIGQ9Ik0yNSAxMTBjMC0yNSAxNS00MCAzNS00MHMzNSAxNSAzNSA0MCIgZmlsbD0iIzliYTFhYiIvPjwvc3ZnPg=="

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profileImage, setProfileImage] = useState<string>(DEFAULT_AVATAR)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

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

    if (!phone || phone.length < 10) {
      setError("올바른 핸드폰 번호를 입력해주세요.")
      return
    }

    setLoading(true)

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
            phone: phone,
            profile_image: profileImage,
            service_name: "DM 데일리 메시지",
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      if (data.session) {
        router.push("/dashboard")
      } else {
        router.push("/auth/verify-email")
      }
    } catch (err: any) {
      setError(err.message || "회원가입 중 오류가 발생했습니다.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <span className="text-foreground font-bold tracking-tight">DM</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>회원가입</CardTitle>
            <CardDescription>3일 무료 체험으로 시작하세요</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && <div className="p-3 text-sm text-foreground bg-muted rounded-lg border">{error}</div>}

              <div className="space-y-2">
                <Label>프로필 사진</Label>
                <div className="flex items-center gap-4">
                  <div
                    className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <img src={profileImage || "/placeholder.svg"} alt="프로필" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      사진 업로드
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">없으면 기본 이미지가 사용됩니다</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">본명 *</Label>
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
                <Label htmlFor="phone">핸드폰 번호 *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="010-0000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일 *</Label>
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
                <Label htmlFor="password">비밀번호 *</Label>
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
                <Label htmlFor="confirmPassword">비밀번호 확인 *</Label>
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

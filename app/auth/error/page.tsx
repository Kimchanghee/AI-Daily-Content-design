"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message") || "인증 중 오류가 발생했습니다."

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <span className="text-4xl">✨</span>
            <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
              AI Daily Content
            </span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <CardTitle>인증 오류</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
              <p className="font-medium mb-2">다시 시도해주세요</p>
              <p className="text-red-600">문제가 계속되면 고객 지원팀에 문의해주세요.</p>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button asChild variant="outline" className="flex-1 bg-transparent">
              <Link href="/auth/signup">회원가입</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/auth/login">로그인</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

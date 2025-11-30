"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function MainHeader({ user: _user }: { user: any }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        // Supabase 클라이언트 동적 import
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("[v0] Auth check error:", error)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between max-w-[1400px] mx-auto px-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="font-bold text-xl">보험사 데일리 메시지</div>
          </Link>
          <div className="h-9 w-20 bg-muted animate-pulse rounded" />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-[1400px] mx-auto px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="font-bold text-xl">보험사 데일리 메시지</div>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">대시보드</Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <span className="hidden sm:inline">{user.email}</span>
                    <span className="sm:hidden">메뉴</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/mypage">마이페이지</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">설정</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>로그아웃</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">로그인</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-black hover:bg-gray-800 text-white">무료 체험 시작</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

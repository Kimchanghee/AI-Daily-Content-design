"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface HeaderProps {
  isLoggedIn: boolean
  userName: string
}

export default function Header({ isLoggedIn, userName }: HeaderProps) {
  const router = useRouter()

  return (
    <header className="bg-black text-white py-4 px-4">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">DailyNews</h1>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-gray-300">{userName}님</span>
              <Button
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white hover:text-black text-sm bg-transparent"
                onClick={() => router.push("/dashboard")}
              >
                마이페이지
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white hover:text-black text-sm bg-transparent"
                onClick={() => router.push("/auth/login")}
              >
                로그인
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white hover:text-black text-sm bg-transparent"
                onClick={() => router.push("/auth/signup")}
              >
                회원가입
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

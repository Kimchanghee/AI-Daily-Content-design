"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import type { ZodiacFortune } from "@/components/templates/fortune-types"
import { renderFortuneTemplate } from "@/components/templates/fortune-renderer"

const DEFAULT_AVATAR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+PGNpcmNsZSBjeD0iNjAiIGN5PSI2MCIgcj0iNjAiIGZpbGw9IiNlNWU3ZWIiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjQ1IiByPSIyMCIgZmlsbD0iIzliYTFhYiIvPjxwYXRoIGQ9Ik0yNSAxMTBjMC0yNSAxNS00MCAzNS00MHMzNSAxNSAzNSA0MCIgZmlsbD0iIzliYTFhYiIvPjwvc3ZnPg=="

interface FortunePreviewProps {
  isMobile?: boolean
}

export default function FortunePreview({ isMobile = false }: FortunePreviewProps) {
  const [fortuneData, setFortuneData] = useState<ZodiacFortune[]>([])
  const [userName, setUserName] = useState("홍길동")
  const [userPhone, setUserPhone] = useState("010-0000-0000")
  const [userBrandPhrase, setUserBrandPhrase] = useState("")
  const [profileImageLoaded, setProfileImageLoaded] = useState<HTMLImageElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [dateStr, setDateStr] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const CANVAS_WIDTH = 540
  const CANVAS_HEIGHT = 960

  // 운세 데이터 가져오기
  const fetchFortune = useCallback(async (forceRefresh = false) => {
    setLoading(true)
    try {
      const url = forceRefresh ? "/api/fortune?refresh=true" : "/api/fortune"
      const response = await fetch(url, {
        method: forceRefresh ? "GET" : "POST",
        headers: { "Content-Type": "application/json" },
      })
      const result = await response.json()
      if (result.success) {
        setFortuneData(result.data.fortunes)
        setDateStr(result.data.date)
      }
    } catch (error) {
      console.error("운세 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // 인증 체크 및 운세 로드
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setUserName(user.user_metadata?.name || user.user_metadata?.full_name || "홍길동")
          setUserPhone(user.user_metadata?.phone || "010-0000-0000")
          setUserBrandPhrase(user.user_metadata?.brand_phrase || "")
          const profileImg = user.user_metadata?.profile_image || DEFAULT_AVATAR
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => setProfileImageLoaded(img)
          img.src = profileImg
        } else {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => setProfileImageLoaded(img)
          img.src = DEFAULT_AVATAR
        }
      } catch {
        const img = new Image()
        img.onload = () => setProfileImageLoaded(img)
        img.src = DEFAULT_AVATAR
      }
    }
    checkAuth()
    fetchFortune()
  }, [fetchFortune])

  // 캔버스 렌더링
  useEffect(() => {
    if (!canvasRef.current || fortuneData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = 2
    canvas.width = CANVAS_WIDTH * dpr
    canvas.height = CANVAS_HEIGHT * dpr

    if (isMobile) {
      const mobileWidth = Math.min(320, window.innerWidth - 40)
      canvas.style.width = `${mobileWidth}px`
      canvas.style.height = `${mobileWidth * (960 / 540)}px`
    } else {
      canvas.style.width = "405px"
      canvas.style.height = "720px"
    }

    ctx.scale(dpr, dpr)

    renderFortuneTemplate(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, fortuneData, {
      name: userName,
      phone: userPhone,
      brandPhrase: userBrandPhrase,
      profileImage: profileImageLoaded,
    })
  }, [fortuneData, userName, userPhone, userBrandPhrase, profileImageLoaded, isMobile])

  // 다운로드 핸들러
  const handleDownload = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = `daily-fortune-${new Date().toISOString().split("T")[0]}.png`
    link.href = canvasRef.current.toDataURL("image/png", 1.0)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 새로고침 핸들러
  const handleRefresh = () => {
    fetchFortune(true)
  }

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">오늘의 띠별운세</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "로딩중..." : "새로고침"}
          </Button>
        </div>
      </div>

      {/* 미리보기 */}
      <div className="bg-gray-100 rounded-2xl p-4 flex justify-center items-center">
        <canvas
          ref={canvasRef}
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* 다운로드 버튼 */}
      <Button
        onClick={handleDownload}
        className="mt-4 w-full max-w-[405px] bg-orange-600 hover:bg-orange-700 text-white"
        disabled={fortuneData.length === 0}
      >
        <Download className="w-4 h-4 mr-2" />
        이미지 다운로드
      </Button>

      {dateStr && (
        <p className="text-xs text-gray-500 mt-2">
          {dateStr} 운세 | 매일 오후 9시 업데이트
        </p>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { TEMPLATES, type NewsItem } from "@/components/templates/template-types"
import { renderTemplate } from "@/components/templates/template-renderer"

const DEFAULT_AVATAR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+PGNpcmNsZSBjeD0iNjAiIGN5PSI2MCIgcj0iNjAiIGZpbGw9IiNlNWU3ZWIiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjQ1IiByPSIyMCIgZmlsbD0iIzliYTFhYiIvPjxwYXRoIGQ9Ik0yNSAxMTBjMC0yNSAxNS00MCAzNS00MHMzNSAxNSAzNSA0MCIgZmlsbD0iIzliYTFhYiIvPjwvc3ZnPg=="

export default function NewsTemplateSelector() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState("city-night")
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [profileImageLoaded, setProfileImageLoaded] = useState<HTMLImageElement | null>(null)
  const templateListRef = useRef<HTMLDivElement>(null)
  const [templateListHeight, setTemplateListHeight] = useState(600)

  const CANVAS_WIDTH = 540
  const CANVAS_HEIGHT = 960

  const fetchNews = useCallback(async () => {
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const result = await response.json()
      if (result.success) {
        setNewsData(result.data)
      }
    } catch (error) {
      console.error("뉴스 가져오기 오류:", error)
    }
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setIsLoggedIn(!!user)
        if (user) {
          setUserName(user.user_metadata?.name || user.user_metadata?.full_name || "홍길동")
          setUserPhone(user.user_metadata?.phone || "010-0000-0000")
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
        setIsLoggedIn(false)
        const img = new Image()
        img.onload = () => setProfileImageLoaded(img)
        img.src = DEFAULT_AVATAR
      }
    }
    checkAuth()
    fetchNews()
  }, [fetchNews])

  // 템플릿 리스트 높이 측정
  useEffect(() => {
    if (templateListRef.current) {
      setTemplateListHeight(templateListRef.current.offsetHeight)
    }
  }, [])

  // 캔버스 렌더링
  useEffect(() => {
    if (!canvasRef.current || newsData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = 2
    canvas.width = CANVAS_WIDTH * dpr
    canvas.height = CANVAS_HEIGHT * dpr
    canvas.style.width = `100%`
    canvas.style.height = `auto`
    ctx.scale(dpr, dpr)

    renderTemplate(selectedTemplate, ctx, CANVAS_WIDTH, CANVAS_HEIGHT, newsData, {
      name: userName || "홍길동",
      phone: userPhone || "010-0000-0000",
      profileImage: profileImageLoaded,
    })
  }, [selectedTemplate, newsData, userName, userPhone, profileImageLoaded])

  const handleDownload = () => {
    if (!isLoggedIn) {
      alert("로그인 후 3일 무료 체험을 시작하세요!\n\n지금 가입하시면 모든 템플릿을 무료로 이용하실 수 있습니다.")
      router.push("/auth/login")
      return
    }

    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = `daily-news-${new Date().toISOString().split("T")[0]}.png`
    link.href = canvasRef.current.toDataURL("image/png", 1.0)
    link.click()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="bg-black text-white py-3 px-4">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold tracking-tight">DailyNews</h1>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-gray-300">{userName}님</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white text-white hover:bg-white hover:text-black text-xs bg-transparent"
                  onClick={() => router.push("/dashboard")}
                >
                  마이페이지
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 text-xs"
                  onClick={() => router.push("/auth/login")}
                >
                  로그인
                </Button>
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-gray-200 text-xs"
                  onClick={() => router.push("/auth/signup")}
                >
                  회원가입
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 배너 */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 py-16 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-gray-400 text-sm mb-4 tracking-widest uppercase">
              Smart News Service for Insurance Professionals
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
              매일 아침 30분,
              <br />
              뉴스 정리에 쓰고 계신가요?
            </h2>
            <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
              클릭 한 번으로 고객에게 보낼
              <br className="md:hidden" />
              프로페셔널한 뉴스 이미지를 받아보세요
            </p>
            <div className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-bold">
              <span className="text-lg">🎁</span>
              지금 가입하면 3일 무료 체험
            </div>
          </div>
        </div>
      </section>

      {/* 요일별 토픽 안내 */}
      <section className="py-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4">
          <p className="text-center text-xs text-gray-500 mb-4">
            매일 오후 9시, 요일별 토픽 뉴스가 자동 업데이트됩니다
          </p>
          <div className="flex justify-center items-center gap-3 flex-wrap">
            {[
              { day: "월", topic: "정치", color: "bg-red-500" },
              { day: "화", topic: "경제", color: "bg-blue-500" },
              { day: "수", topic: "사회", color: "bg-green-500" },
              { day: "목", topic: "생활/문화", color: "bg-purple-500" },
              { day: "금", topic: "IT/과학", color: "bg-orange-500" },
            ].map((item) => (
              <div
                key={item.day}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm"
              >
                <span
                  className={`w-6 h-6 flex items-center justify-center ${item.color} text-white text-xs font-bold rounded-full`}
                >
                  {item.day}
                </span>
                <span className="text-gray-800 font-medium text-sm">{item.topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 템플릿 선택 + 미리보기 */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 좌측: 템플릿 선택 */}
            <div className="lg:w-[420px] shrink-0" ref={templateListRef}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-black rounded-full" />
                템플릿 선택
              </h3>
              <div className="space-y-4">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full text-left overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                      selectedTemplate === template.id
                        ? "border-black shadow-xl scale-[1.02]"
                        : "border-gray-200 hover:border-gray-400 hover:shadow-md"
                    }`}
                  >
                    <div className="h-28 w-full relative" style={{ background: template.previewBg }}>
                      {/* 미니 프리뷰 */}
                      <div className="absolute inset-0 flex items-center justify-between px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
                            style={{
                              borderColor: template.accentColor,
                              backgroundColor: "rgba(255,255,255,0.2)",
                            }}
                          >
                            <span style={{ color: template.accentColor }} className="text-lg">
                              👤
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-base" style={{ color: template.accentColor }}>
                              {template.name}
                            </p>
                            <p className="text-xs opacity-80" style={{ color: template.accentColor }}>
                              {template.description}
                            </p>
                          </div>
                        </div>
                        {/* 미니 뉴스 카드 */}
                        <div
                          className="w-24 h-16 rounded-lg flex flex-col justify-center px-2"
                          style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                        >
                          <div className="w-full h-1.5 bg-gray-300 rounded mb-1" />
                          <div className="w-3/4 h-1.5 bg-gray-200 rounded mb-1" />
                          <div className="w-5/6 h-1.5 bg-gray-200 rounded" />
                        </div>
                      </div>
                      {/* 선택 표시 */}
                      {selectedTemplate === template.id && (
                        <div className="absolute top-3 right-3 w-7 h-7 bg-black rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 우측: 미리보기 */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-black rounded-full" />
                미리보기
              </h3>
              {/* 미리보기 컨테이너 - 템플릿 리스트와 높이 동일 */}
              <div
                className="bg-gray-200 rounded-2xl flex items-center justify-center"
                style={{
                  height: `${Math.max(templateListHeight - 52, 600)}px`,
                  padding: "7%",
                }}
              >
                <canvas
                  ref={canvasRef}
                  className="rounded-xl shadow-2xl"
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              {/* 다운로드 버튼 */}
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleDownload}
                  className="bg-black hover:bg-gray-800 text-white px-10 py-4 text-base font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  이미지 다운로드 (PNG)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-100 border-t border-gray-200 py-10">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center text-sm text-gray-600 space-y-2">
            <p className="font-bold text-gray-800 text-base">주식회사 데일리뉴스코리아</p>
            <p>대표: 홍길동 | 사업자등록번호: 123-45-67890</p>
            <p>주소: 서울특별시 강남구 테헤란로 123, 데일리빌딩 15층</p>
            <p>고객센터: 02-1234-5678 | 이메일: support@dailynews.kr</p>
            <p className="text-gray-400 pt-4">© 2025 DailyNews Korea. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

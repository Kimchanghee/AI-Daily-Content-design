"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { TEMPLATES, type NewsItem } from "@/components/templates/template-types"
import { renderTemplate, renderMiniPreview } from "@/components/templates/template-renderer"

const DEFAULT_AVATAR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+PGNpcmNsZSBjeD0iNjAiIGN5PSI2MCIgcj0iNjAiIGZpbGw9IiNlNWU3ZWIiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjQ1IiByPSIyMCIgZmlsbD0iIzliYTFhYiIvPjxwYXRoIGQ9Ik0yNSAxMTBjMC0yNSAxNS00MCAzNS00MHMzNSAxNSAzNSA0MCIgZmlsbD0iIzliYTFhYiIvPjwvc3ZnPg=="

export default function NewsTemplateSelector() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState("city-night")
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("홍길동")
  const [userPhone, setUserPhone] = useState("010-0000-0000")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const miniCanvasRefs = useRef<Map<string, HTMLCanvasElement>>(new Map())
  const [profileImageLoaded, setProfileImageLoaded] = useState<HTMLImageElement | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const CANVAS_WIDTH = 540
  const CANVAS_HEIGHT = 960

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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

  // 메인 캔버스 렌더링
  useEffect(() => {
    if (!canvasRef.current || newsData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = 2
    canvas.width = CANVAS_WIDTH * dpr
    canvas.height = CANVAS_HEIGHT * dpr

    // PC와 모바일 각각 다른 크기 설정 (9:16 비율 유지)
    if (isMobile) {
      // 모바일: 가로 기준 최대 320px
      const mobileWidth = Math.min(320, window.innerWidth - 40)
      canvas.style.width = `${mobileWidth}px`
      canvas.style.height = `${mobileWidth * (960 / 540)}px`
    } else {
      // PC: 글자가 잘 보이도록 크기 확대 (405x720, 9:16 비율)
      canvas.style.width = "405px"
      canvas.style.height = "720px"
    }

    ctx.scale(dpr, dpr)

    renderTemplate(selectedTemplate, ctx, CANVAS_WIDTH, CANVAS_HEIGHT, newsData, {
      name: userName,
      phone: userPhone,
      profileImage: profileImageLoaded,
    })
  }, [selectedTemplate, newsData, userName, userPhone, profileImageLoaded, isMobile])

  useEffect(() => {
    if (newsData.length === 0) return

    TEMPLATES.forEach((template) => {
      const canvas = miniCanvasRefs.current.get(template.id)
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const miniWidth = 50
      const miniHeight = 89
      const dpr = 2
      canvas.width = miniWidth * dpr
      canvas.height = miniHeight * dpr
      canvas.style.width = `${miniWidth}px`
      canvas.style.height = `${miniHeight}px`
      ctx.scale(dpr, dpr)

      renderMiniPreview(template.id, ctx, miniWidth, miniHeight, newsData, {
        name: userName,
        phone: userPhone,
        profileImage: profileImageLoaded,
      })
    })
  }, [newsData, userName, userPhone, profileImageLoaded])

  const handleDownload = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = `daily-news-${new Date().toISOString().split("T")[0]}.png`
    link.href = canvasRef.current.toDataURL("image/png", 1.0)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const setMiniCanvasRef = (id: string) => (el: HTMLCanvasElement | null) => {
    if (el) {
      miniCanvasRefs.current.set(id, el)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
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

      {/* 배너 */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 py-12 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight tracking-tight">
              고객에게 보낼 뉴스,
              <br />
              아직도 직접 만드세요?
            </h2>
            <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
              매일 아침 뉴스 정리하느라 30분씩 쓰지 마세요.
              <br />
              클릭 한 번으로 프로페셔널한 뉴스 이미지를 받아보세요.
            </p>
            <div className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-bold">
              지금 가입하면 3일 무료 체험
            </div>
          </div>
        </div>
      </section>

      {/* 요일별 토픽 안내 */}
      <section className="py-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4">
          <p className="text-center text-xs text-gray-500 mb-3">
            매일 오후 9시, 요일별 토픽 뉴스가 자동 업데이트됩니다
          </p>
          <div className="flex justify-center items-center gap-1 md:gap-2 flex-wrap">
            {[
              { day: "월", topic: "정치", color: "bg-red-500" },
              { day: "화", topic: "경제", color: "bg-blue-500" },
              { day: "수", topic: "사회", color: "bg-green-500" },
              { day: "목", topic: "생활/문화", color: "bg-purple-500" },
              { day: "금", topic: "IT/과학", color: "bg-orange-500" },
            ].map((item) => (
              <div
                key={item.day}
                className="flex items-center gap-1 px-2 md:px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm"
              >
                <span
                  className={`w-5 h-5 flex items-center justify-center ${item.color} text-white text-xs font-bold rounded-full`}
                >
                  {item.day}
                </span>
                <span className="text-gray-800 font-medium text-xs">{item.topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 템플릿 선택 및 미리보기 */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className={isMobile ? "w-full" : "lg:w-[280px] shrink-0"}>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-black rounded-full" />
                템플릿 선택
              </h3>
              {isMobile ? (
                /* 모바일: 가로 스크롤 */
                <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
                  {TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`relative flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 p-2 ${
                        selectedTemplate === template.id
                          ? "border-black shadow-lg scale-105"
                          : "border-gray-200"
                      }`}
                      style={{ background: template.previewBg, width: "80px" }}
                    >
                      <div className="flex items-center justify-center">
                        <canvas ref={setMiniCanvasRef(template.id)} className="rounded" />
                      </div>
                      <p className="text-[10px] font-bold text-center mt-1 text-white drop-shadow-md truncate">
                        {template.name}
                      </p>
                      {selectedTemplate === template.id && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                          <span className="text-white text-[10px]">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                /* PC: 2열 그리드 */
                <div className="grid grid-cols-2 gap-3">
                  {TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 p-2 ${
                        selectedTemplate === template.id
                          ? "border-black shadow-lg"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      style={{ background: template.previewBg }}
                    >
                      <div className="flex items-center justify-center">
                        <canvas ref={setMiniCanvasRef(template.id)} className="rounded" />
                      </div>
                      <p className="text-[10px] font-bold text-center mt-2 text-white drop-shadow-md truncate px-1">
                        {template.name}
                      </p>
                      {selectedTemplate === template.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                          <span className="text-white text-[10px]">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-black rounded-full" />
                미리보기
              </h3>
              {isMobile ? (
                /* 모바일: 풀 너비 중앙 정렬 */
                <div className="bg-gray-200 rounded-xl p-4 flex flex-col items-center">
                  <canvas ref={canvasRef} className="rounded-lg shadow-2xl" />
                  <Button
                    onClick={handleDownload}
                    className="mt-4 bg-black hover:bg-gray-800 text-white px-8 py-3 text-sm font-bold rounded-full shadow-lg"
                  >
                    이미지 다운로드 (PNG)
                  </Button>
                </div>
              ) : (
                /* PC: 미리보기 중심 레이아웃 */
                <div className="bg-gray-100 rounded-xl p-6">
                  <div className="flex flex-col items-center">
                    <canvas ref={canvasRef} className="rounded-lg shadow-xl" />
                    <div className="mt-6 w-full max-w-md">
                      <Button
                        onClick={handleDownload}
                        className="bg-black hover:bg-gray-800 text-white px-10 py-4 text-sm font-bold rounded-full shadow-lg hover:shadow-xl transition-all w-full"
                      >
                        이미지 다운로드 (PNG)
                      </Button>
                      <p className="text-center text-xs text-gray-500 mt-3">
                        540 x 960px (9:16) • PNG 고화질 • 매일 오후 9시 업데이트
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-100 border-t border-gray-200 py-8">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center text-sm text-gray-600 space-y-1">
            <p className="font-bold text-gray-800">주식회사 데일리뉴스코리아</p>
            <p>대표: 홍길동 | 사업자등록번호: 123-45-67890</p>
            <p>주소: 서울특별시 강남구 테헤란로 123, 데일리빌딩 15층</p>
            <p>고객센터: 02-1234-5678 | 이메일: support@dailynews.kr</p>
            <p className="text-gray-400 pt-3">© 2025 DailyNews Korea. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

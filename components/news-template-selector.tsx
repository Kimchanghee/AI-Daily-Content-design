"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { TEMPLATES, type NewsItem } from "@/components/templates/template-types"
import { renderTemplate, renderMiniPreview } from "@/components/templates/template-renderer"
import {
  Header,
  HeroBanner,
  TopicBadges,
  TemplateSelector,
  TemplatePreview,
  Footer,
} from "@/components/news"
import { FortunePreview } from "@/components/fortune"

const DEFAULT_AVATAR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+PGNpcmNsZSBjeD0iNjAiIGN5PSI2MCIgcj0iNjAiIGZpbGw9IiNlNWU3ZWIiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjQ1IiByPSIyMCIgZmlsbD0iIzliYTFhYiIvPjxwYXRoIGQ9Ik0yNSAxMTBjMC0yNSAxNS00MCAzNS00MHMzNSAxNSAzNSA0MCIgZmlsbD0iIzliYTFhYiIvPjwvc3ZnPg=="

export default function NewsTemplateSelector() {
  const [selectedTemplate, setSelectedTemplate] = useState("city-night")
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("홍길동")
  const [userPhone, setUserPhone] = useState("010-0000-0000")
  const [userBrandPhrase, setUserBrandPhrase] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const miniCanvasRefs = useRef<Map<string, HTMLCanvasElement>>(new Map())
  const [profileImageLoaded, setProfileImageLoaded] = useState<HTMLImageElement | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState<"news" | "fortune">("news")

  const CANVAS_WIDTH = 540
  const CANVAS_HEIGHT = 960

  // 모바일 체크
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // 뉴스 데이터 가져오기
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

  // 인증 체크 및 뉴스 로드
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
      const mobileWidth = Math.min(320, window.innerWidth - 40)
      canvas.style.width = `${mobileWidth}px`
      canvas.style.height = `${mobileWidth * (960 / 540)}px`
    } else {
      canvas.style.width = "405px"
      canvas.style.height = "720px"
    }

    ctx.scale(dpr, dpr)

    renderTemplate(selectedTemplate, ctx, CANVAS_WIDTH, CANVAS_HEIGHT, newsData, {
      name: userName,
      phone: userPhone,
      brandPhrase: userBrandPhrase,
      profileImage: profileImageLoaded,
    })
  }, [selectedTemplate, newsData, userName, userPhone, userBrandPhrase, profileImageLoaded, isMobile])

  // 미니 프리뷰 렌더링
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
        brandPhrase: userBrandPhrase,
        profileImage: profileImageLoaded,
      })
    })
  }, [newsData, userName, userPhone, userBrandPhrase, profileImageLoaded])

  // 다운로드 핸들러
  const handleDownload = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = `daily-news-${new Date().toISOString().split("T")[0]}.png`
    link.href = canvasRef.current.toDataURL("image/png", 1.0)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header isLoggedIn={isLoggedIn} userName={userName} />
      <HeroBanner />
      <TopicBadges />

      {/* 탭 선택 */}
      <section className="py-4 px-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setActiveTab("news")}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                activeTab === "news"
                  ? "bg-black text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              오늘의 뉴스
            </button>
            <button
              onClick={() => setActiveTab("fortune")}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                activeTab === "fortune"
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              띠별운세
            </button>
          </div>
        </div>
      </section>

      {/* 콘텐츠 영역 */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-[1400px] mx-auto">
          {activeTab === "news" ? (
            <div className="flex flex-col lg:flex-row gap-6">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
                miniCanvasRefs={miniCanvasRefs}
                isMobile={isMobile}
              />
              <TemplatePreview
                canvasRef={canvasRef}
                onDownload={handleDownload}
                isMobile={isMobile}
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <FortunePreview isMobile={isMobile} />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

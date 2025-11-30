"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface NewsItem {
  id: string
  category: string
  title: string
  summary: string
  source: string
  timestamp: string
  url?: string
}

interface Template {
  id: string
  name: string
  preview: string
  description: string
}

interface UserInfo {
  name: string
  company: string
  phone: string
  message: string
}

const templates: Template[] = [
  {
    id: "classic",
    name: "클래식",
    preview: "/classic-news-template.jpg",
    description: "깔끔하고 전문적인 기본 템플릿",
  },
  {
    id: "modern",
    name: "모던",
    preview: "/modern-news-template.jpg",
    description: "현대적이고 세련된 디자인",
  },
  {
    id: "premium",
    name: "프리미엄",
    preview: "/premium-business-template.jpg",
    description: "고급스러운 비즈니스 템플릿",
  },
]

export default function NewsTemplateSelector() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("classic")
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    company: "",
    phone: "",
    message: "",
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [savedTemplates, setSavedTemplates] = useState<any[]>([])

  const fetchNews = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      if (result.success) {
        setNewsData(result.data)
        setLastUpdate(new Date())
        console.log("[v0] 뉴스 업데이트 성공:", result.data.length, "개")
      } else {
        console.error("[v0] 뉴스 가져오기 실패:", result.error)
        alert(`뉴스를 가져오는데 실패했습니다: ${result.error}`)
      }
    } catch (error) {
      console.error("[v0] 뉴스 가져오기 오류:", error)
      alert("뉴스를 가져오는데 실패했습니다")
    } finally {
      setLoading(false)
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
          // 저장된 사용자 정보 불러오기
          const savedInfo = localStorage.getItem(`userInfo_${user.id}`)
          if (savedInfo) {
            setUserInfo(JSON.parse(savedInfo))
          }
        }
      } catch (error) {
        console.log("[v0] 인증 체크 실패:", error)
        setIsLoggedIn(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const checkAndUpdate = () => {
      const now = new Date()
      const hour = now.getHours()

      // 오전 9시 ~ 오후 11시 59분 사이에만 작동
      if (hour >= 9 && hour <= 23) {
        console.log("[v0] 자동 업데이트 실행:", now.toLocaleString("ko-KR"))
        fetchNews()
      } else {
        console.log("[v0] 업데이트 시간 아님 (9시~23시만 작동):", now.toLocaleString("ko-KR"))
      }
    }

    // 첫 로드시 즉시 실행
    checkAndUpdate()

    // 1시간(3600000ms)마다 실행
    const interval = setInterval(checkAndUpdate, 3600000)

    return () => clearInterval(interval)
  }, [fetchNews])

  const handleDownload = () => {
    console.log("[v0] 이미지 다운로드:", selectedTemplate)
    alert("이미지가 다운로드됩니다.")
  }

  const handleSaveTemplate = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다")
      window.location.href = "/auth/login"
      return
    }

    if (!userInfo.name || !userInfo.company) {
      alert("이름과 회사명을 입력해주세요")
      return
    }

    const templateData = {
      id: Date.now().toString(),
      templateId: selectedTemplate,
      userInfo,
      newsData,
      createdAt: new Date().toISOString(),
    }

    // localStorage에 저장
    const saved = JSON.parse(localStorage.getItem("savedTemplates") || "[]")
    saved.push(templateData)
    localStorage.setItem("savedTemplates", JSON.stringify(saved))
    setSavedTemplates(saved)

    console.log("[v0] 템플릿 저장 완료:", templateData)
    alert("템플릿이 저장되었습니다!")
  }

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedTemplates") || "[]")
    setSavedTemplates(saved)
  }, [])

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <header className="flex justify-between items-center mb-16 pb-6 border-b border-border/50">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">DM</h1>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (window.location.href = "/dashboard")}
                className="font-medium"
              >
                대시보드
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (window.location.href = "/settings")}
                className="font-medium"
              >
                설정
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (window.location.href = "/auth/login")}
                className="font-medium"
              >
                로그인
              </Button>
              <Button
                size="sm"
                onClick={() => (window.location.href = "/auth/signup")}
                className="bg-foreground text-background hover:bg-foreground/90 font-medium"
              >
                회원가입
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="text-center mb-20">
        <h1 className="section-title mb-6">보험사 데일리 메시지</h1>
        <p className="section-subtitle max-w-2xl mx-auto mb-8">
          매일 최신 뉴스를 자동으로 수집하고,
          <br />
          고급스러운 템플릿으로 고객에게 전달하세요
        </p>
        <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-foreground text-background rounded-sm text-sm font-medium tracking-wide">
          3일 무료 체험
        </div>
      </div>

      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-8 tracking-tight">템플릿 선택</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedTemplate === template.id ? "ring-2 ring-foreground shadow-md" : "premium-card"
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="p-6">
                <img
                  src={template.preview || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-52 object-cover rounded-sm mb-6 grayscale hover:grayscale-0 transition-all duration-500"
                />
                <h3 className="font-bold text-xl mb-2 tracking-tight">{template.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{template.description}</p>
                {selectedTemplate === template.id && (
                  <div className="mt-4 text-sm font-medium">
                    <span className="inline-block px-3 py-1 bg-foreground text-background rounded-sm">선택됨</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 오늘의 뉴스 */}
      <section className="mb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">오늘의 뉴스</h2>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              {loading ? "뉴스를 가져오는 중..." : "실시간 뉴스 수집 완료"}
            </p>
          </div>
          <Button
            onClick={fetchNews}
            disabled={loading}
            className="bg-foreground text-background hover:bg-foreground/90 font-medium"
          >
            {loading ? "로딩 중..." : "뉴스 새로고침"}
          </Button>
        </div>

        {lastUpdate && (
          <div className="text-sm text-muted-foreground mb-4">
            마지막 업데이트: {lastUpdate.toLocaleString("ko-KR")} | 자동 업데이트: 오전 9시 ~ 오후 11:59분 (1시간마다)
          </div>
        )}

        {newsData.length === 0 && !loading && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">뉴스 새로고침 버튼을 눌러 최신 뉴스를 가져오세요</p>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsData.map((news) => (
            <Card key={news.id} className="p-6 premium-card hover:shadow-md transition-all duration-300">
              <div className="mb-3">
                <span className="inline-block px-3 py-1 bg-foreground/5 text-foreground text-xs font-medium rounded-sm tracking-wide">
                  {news.category}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-3 leading-snug tracking-tight">{news.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{news.summary}</p>
              <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
                <span>{news.source}</span>
                <span>{new Date(news.timestamp).toLocaleDateString("ko-KR")}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 미리보기 및 다운로드 */}
      <section className="mb-20">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => setPreviewMode(!previewMode)}
            variant="outline"
            disabled={newsData.length === 0}
            className="font-medium"
          >
            {previewMode ? "편집 모드" : "미리보기"}
          </Button>
          {isLoggedIn && (
            <Button
              size="lg"
              onClick={handleSaveTemplate}
              disabled={newsData.length === 0}
              variant="outline"
              className="font-medium bg-transparent"
            >
              템플릿 저장
            </Button>
          )}
          <Button
            size="lg"
            onClick={handleDownload}
            disabled={newsData.length === 0}
            className="bg-foreground text-background hover:bg-foreground/90 font-medium"
          >
            이미지 다운로드
          </Button>
        </div>

        {previewMode && (
          <Card className="mt-8 p-6">
            <h3 className="text-xl font-bold mb-4">미리보기</h3>
            <div className="bg-muted rounded-lg p-8">
              <div className="mb-6 text-center">
                <p className="text-lg font-bold">{templates.find((t) => t.id === selectedTemplate)?.name} 템플릿</p>
                {isLoggedIn && userInfo.name && (
                  <div className="mt-4 space-y-2 text-sm">
                    <p>
                      <strong>이름:</strong> {userInfo.name}
                    </p>
                    <p>
                      <strong>회사:</strong> {userInfo.company}
                    </p>
                    <p>
                      <strong>연락처:</strong> {userInfo.phone}
                    </p>
                    {userInfo.message && (
                      <p className="mt-4 p-4 bg-background rounded">
                        <strong>메시지:</strong> {userInfo.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="border-t pt-4">
                <p className="font-bold mb-2">포함된 뉴스 ({newsData.length}개)</p>
                <ul className="space-y-1 text-sm">
                  {newsData.slice(0, 5).map((news) => (
                    <li key={news.id} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        [{news.category}] {news.title}
                      </span>
                    </li>
                  ))}
                  {newsData.length > 5 && <li className="text-muted-foreground">... 외 {newsData.length - 5}개</li>}
                </ul>
              </div>
            </div>
          </Card>
        )}
      </section>

      {isLoggedIn && savedTemplates.length > 0 && (
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-4">저장된 템플릿</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedTemplates.map((saved) => (
              <Card key={saved.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">{templates.find((t) => t.id === saved.templateId)?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(saved.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {saved.userInfo.name} | {saved.userInfo.company}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{saved.newsData.length}개 뉴스 포함</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="mb-20 py-20 bg-gradient-to-b from-muted/30 to-background -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">서비스 가격</h2>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            간편한 단일 요금제로 모든 기능을 이용하세요
          </p>

          <Card className="p-10 max-w-md mx-auto premium-card">
            <div className="mb-6">
              <div className="inline-block px-5 py-2 bg-foreground text-background rounded-sm text-sm font-medium tracking-wide mb-6">
                3일 무료 체험
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">프로 플랜</h3>
              <div className="text-5xl font-bold mb-3 tracking-tight">
                ₩49,000<span className="text-2xl text-muted-foreground font-normal">/월</span>
              </div>
            </div>

            <ul className="space-y-4 text-left mb-8">
              <li className="flex items-start gap-3">
                <span className="text-foreground font-bold mt-0.5">✓</span>
                <span className="leading-relaxed">실시간 뉴스 자동 수집 (6개 카테고리)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-foreground font-bold mt-0.5">✓</span>
                <span className="leading-relaxed">3가지 프리미엄 템플릿</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-foreground font-bold mt-0.5">✓</span>
                <span className="leading-relaxed">무제한 템플릿 저장</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-foreground font-bold mt-0.5">✓</span>
                <span className="leading-relaxed">이미지 다운로드</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-foreground font-bold mt-0.5">✓</span>
                <span className="leading-relaxed">고객 정보 관리</span>
              </li>
            </ul>

            <Button
              size="lg"
              className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium"
              onClick={() => (window.location.href = "/auth/signup")}
            >
              3일 무료 체험 시작
            </Button>
          </Card>
        </div>
      </section>

      <footer className="mt-24 pt-12 border-t border-border/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bold mb-4 tracking-tight">제품</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">기능</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">가격</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">템플릿</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 tracking-tight">회사</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">소개</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">블로그</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">채용</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 tracking-tight">법률</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">이용약관</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">개인정보처리방침</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">환불정책</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 tracking-tight">지원</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">고객센터</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">FAQ</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">문의하기</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border/50">
          <p className="tracking-wide">© 2025 보험사 데일리 메시지. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { getTranslation, type Locale } from "@/lib/i18n"

const plans = [
  {
    name: "베이직",
    price: "₩29,000",
    period: "/월",
    description: "개인 사업자와 소규모 셀러에게 적합",
    features: ["월 30개 콘텐츠 생성", "기본 템플릿 제공", "텔레그램 연동", "이메일 지원", "7일 무료 체험"],
    highlighted: false,
  },
  {
    name: "프로",
    price: "₩79,000",
    period: "/월",
    description: "성장하는 비즈니스를 위한 최적의 선택",
    features: [
      "월 100개 콘텐츠 생성",
      "프리미엄 템플릿 무제한",
      "다중 채널 연동",
      "우선 지원",
      "브랜드 맞춤 AI 학습",
      "고급 스케줄링",
      "분석 대시보드",
    ],
    highlighted: true,
  },
  {
    name: "엔터프라이즈",
    price: "문의",
    period: "필요",
    description: "대규모 비즈니스를 위한 맞춤형 솔루션",
    features: [
      "무제한 콘텐츠 생성",
      "커스텀 템플릿 제작",
      "전담 계정 매니저",
      "24/7 전화 지원",
      "API 연동",
      "온프레미스 옵션",
      "맞춤형 AI 모델",
    ],
    highlighted: false,
  },
]

export default function Pricing() {
  const [locale, setLocale] = useState<Locale>("ko")

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale) {
      setLocale(savedLocale)
    }
  }, [])

  const t = (key: keyof typeof import("@/lib/i18n").translations.ko) => getTranslation(locale, key)

  const features = [
    t("unlimitedNews"),
    t("aiImageCreation"),
    t("telegramIntegration"),
    t("customerGroupManagement"),
    t("scheduledSending"),
    t("advancedAnalytics"),
    t("prioritySupport"),
    t("customTemplates"),
  ]

  return (
    <section id="요금제" className="bg-card/30 px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto mb-12 sm:mb-16 max-w-2xl text-center">
          <h2 className="section-title mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {t("pricingTitle")}
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-3 sm:mb-4"></div>
          <p className="section-subtitle text-base sm:text-lg px-4">{t("pricingSubtitle")}</p>
        </div>

        <div className="max-w-lg mx-auto px-2 sm:px-4">
          <Card className="border-2 border-accent bg-background/80 shadow-2xl ring-1 ring-accent/30 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-accent text-accent-foreground px-4 py-2.5 sm:py-3 text-center font-semibold text-sm sm:text-base">
              ⭐ {t("planName")}
            </div>

            <CardHeader className="px-4 sm:px-6 pt-6 sm:pt-8">
              <h3 className="mb-2 text-xl sm:text-2xl font-bold text-foreground">{t("planName")}</h3>
              <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{t("planDescription")}</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">₩19,800</span>
                <span className="text-sm text-muted-foreground">{t("perMonth")}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-4 sm:px-6 pb-6 sm:pb-8">
              <Button className="w-full font-semibold text-base bg-gradient-to-r from-primary to-accent text-accent-foreground hover:opacity-90 transform hover:scale-105 transition-all min-h-[48px]">
                {t("getStarted")} →
              </Button>

              <div className="space-y-3">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <span className="text-accent text-lg sm:text-xl flex-shrink-0 mt-0.5">✓</span>
                    <span className="text-sm sm:text-base text-foreground leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

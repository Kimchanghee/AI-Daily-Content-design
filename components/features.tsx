"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getTranslation, type Locale } from "@/lib/i18n"

const features = [
  {
    icon: "✨",
    title: "AI 뉴스 콘텐츠 자동 생성",
    description: "업계 트렌드와 고객에게 유용한 정보를 AI가 자동으로 분석하고 뉴스 콘텐츠로 생성합니다.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: "🖼️",
    title: "전문적인 이미지 제작",
    description: "생성된 뉴스를 시각적으로 매력적인 이미지로 자동 변환하여 고객의 관심을 끕니다.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: "📤",
    title: "텔레그램 자동 발송",
    description: "제작된 뉴스 이미지를 텔레그램 채널을 통해 고객들에게 자동으로 발송합니다.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: "👥",
    title: "고객 그룹 관리",
    description: "기존 고객과 잠재 고객을 그룹별로 관리하고 맞춤형 콘텐츠를 발송할 수 있습니다.",
    gradient: "from-orange-500 to-red-500",
  },
]

export default function Features() {
  const [locale, setLocale] = useState<Locale>("ko")

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale) {
      setLocale(savedLocale)
    }
  }, [])

  const t = (key: keyof typeof import("@/lib/i18n").translations.ko) => getTranslation(locale, key)

  return (
    <section id="기능" className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 sm:mb-16 max-w-2xl text-center">
          <h2 className="section-title mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {t("featuresTitle")}
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-3 sm:mb-4"></div>
          <p className="section-subtitle text-base sm:text-lg px-4">{t("featuresSubtitle")}</p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-border bg-background/50 backdrop-blur-sm hover:border-accent/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-2"
            >
              <CardContent className="pt-6 sm:pt-8 px-4 sm:px-6">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transform hover:rotate-6 transition-transform text-2xl sm:text-3xl shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="mb-2 sm:mb-3 text-base sm:text-lg font-bold text-foreground leading-snug">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

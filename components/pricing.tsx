"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Check } from "lucide-react"

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
  return (
    <section id="요금제" className="bg-card/30 px-4 py-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="section-title mb-4">합리적인 구독 요금제</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-4"></div>
          <p className="section-subtitle">
            비즈니스 규모에 맞는 요금제를 선택하세요. 모든 플랜은 7일 무료 체험이 가능합니다.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`border-2 transition-all ${
                plan.highlighted
                  ? "border-accent bg-background/80 shadow-2xl ring-1 ring-accent/30 transform scale-105"
                  : "border-border bg-background/50 hover:shadow-lg"
              }`}
            >
              {plan.highlighted && (
                <div className="bg-gradient-to-r from-primary to-accent text-accent-foreground px-4 py-3 text-center font-semibold">
                  ⭐ 가장 인기있는 플랜
                </div>
              )}

              <CardHeader>
                <h3 className="mb-2 text-2xl font-bold text-foreground">{plan.name}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl md:text-6xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button
                  className={`w-full font-semibold ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-primary to-accent text-accent-foreground hover:opacity-90 transform hover:scale-105 transition-all"
                      : "border-border hover:bg-muted/50"
                  }`}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  시작하기 →
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0 text-accent" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

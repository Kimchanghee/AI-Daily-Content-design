"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ImageIcon, Calendar, MessageSquare } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI 콘텐츠 자동 생성",
    description: "브랜드와 상품 정보를 기반으로 매일 새로운 SNS 콘텐츠를 AI가 자동으로 생성합니다.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: ImageIcon,
    title: "이미지 자동 합성",
    description: "템플릿과 이미지 합성 기술로 시각적으로 매력적인 콘텐츠를 자동 제작합니다.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Calendar,
    title: "스케줄 예약 발송",
    description: "원하는 시간에 자동으로 콘텐츠가 발송되도록 스케줄을 설정할 수 있습니다.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: MessageSquare,
    title: "텔레그램 연동",
    description: "텔레그램 채널과 연동하여 생성된 콘텐츠를 즉시 확인하고 공유할 수 있습니다.",
    gradient: "from-orange-500 to-red-500",
  },
]

export default function Features() {
  return (
    <section id="기능" className="py-20 md:py-32 px-4 bg-card/30">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="section-title mb-4">매일 자동으로 만들어지는 콘텐츠</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-4"></div>
          <p className="section-subtitle">
            AI가 브랜드에 맞는 콘텐츠를 자동으로 생성하고, 예약 발송까지 한 번에 해결합니다.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="border-border bg-background/50 backdrop-blur-sm hover:border-accent/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              >
                <CardContent className="pt-8">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 transform hover:rotate-6 transition-transform`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

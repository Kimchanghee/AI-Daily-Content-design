"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background px-4 py-20 md:py-32 pt-32">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">AI 콘텐츠 자동화 플랫폼</span>
          </div>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto text-balance">
            소상공인과 셀러를 위한 생성형 AI 기반 일일 콘텐츠 자동 제작 서비스. 브랜드 정보만 입력하면 매일 SNS용
            콘텐츠가 자동으로 생성되고 예약 발송됩니다.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              size="lg"
              className="px-8 bg-gradient-to-r from-primary to-accent text-accent-foreground hover:opacity-90 transform hover:scale-105 transition-all shadow-lg"
            >
              7일 무료 체험 시작
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 border-border hover:bg-muted/50 bg-transparent">
              데모 영상 보기
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">이미 많은 소상공인이 사용 중입니다</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {["카페 사장님", "쇼핑몰 운영자", "마케팅 담당자", "1인 셀러"].map((user) => (
                <div key={user} className="text-sm font-semibold text-muted-foreground opacity-60">
                  {user}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

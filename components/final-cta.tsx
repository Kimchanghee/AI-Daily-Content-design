"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl animate-pulse" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <h2 className="section-title mb-6">지금 바로 AI 콘텐츠 자동화를 시작하세요</h2>
        <p className="section-subtitle mb-8 text-balance">
          이미 수백 명의 소상공인과 셀러가 AI Daily Content로 매일 수천 시간을 절약하고 있습니다. 지금 7일 무료 체험을
          시작하세요. 신용카드 등록 없이 바로 사용 가능합니다.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="px-8 bg-gradient-to-r from-primary to-accent text-accent-foreground hover:opacity-90 transform hover:scale-105 transition-all shadow-lg"
          >
            7일 무료 체험 시작
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="px-8 border-border hover:bg-muted/50 bg-transparent">
            상담 예약하기
          </Button>
        </div>

        {/* Social Proof */}
        <div className="mt-12 flex flex-col items-center gap-2 text-sm">
          <p className="text-muted-foreground text-balance">
            ✓ 7일 무료 체험 • ✓ 신용카드 등록 불필요 • ✓ 언제든 해지 가능
          </p>
        </div>
      </div>
    </section>
  )
}

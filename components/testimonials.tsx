"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote: "매일 SNS에 올릴 콘텐츠 고민하느라 시간을 너무 많이 썼는데, 이제는 AI가 알아서 만들어줘서 정말 편해요!",
    author: "김민지",
    role: "카페 운영",
    company: "민지네 카페",
    rating: 5,
  },
  {
    quote: "쇼핑몰 운영하면서 매일 상품 홍보 콘텐츠 만드는 게 제일 힘들었는데, 이 서비스 덕분에 매출이 20% 올랐어요.",
    author: "박준호",
    role: "쇼핑몰 대표",
    company: "준호샵",
    rating: 5,
  },
  {
    quote:
      "마케팅 담당자로서 매일 콘텐츠 기획하는 게 부담이었는데, AI가 브랜드 톤에 맞춰 자동으로 만들어줘서 업무 효율이 3배 올랐습니다.",
    author: "이수진",
    role: "마케팅 담당자",
    company: "스타트업 A",
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section id="후기" className="px-4 py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="section-title mb-4">실제 사용자들의 생생한 후기</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-4"></div>
          <p className="section-subtitle">이미 많은 소상공인과 셀러들이 AI Daily Content로 시간을 절약하고 있습니다.</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.author}
              className="border-border bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
            >
              <CardContent className="pt-8">
                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-accent text-accent" />
                  ))}
                </div>

                {/* Quote */}
                <p className="mb-6 text-sm leading-relaxed text-foreground italic">"{testimonial.quote}"</p>

                {/* Author */}
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role} · {testimonial.company}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

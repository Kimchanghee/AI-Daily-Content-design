"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getTranslation, type Locale } from "@/lib/i18n"

const testimonialsData = {
  ko: [
    {
      quote:
        "매일 고객들에게 보낼 유용한 정보를 찾느라 시간을 많이 썼는데, 이제는 AI가 알아서 뉴스를 만들어주고 텔레그램으로 자동 발송해줘서 고객 관리가 훨씬 수월해졌어요.",
      author: "김성호",
      role: "보험 설계사",
      company: "15년 경력",
      rating: 5,
    },
    {
      quote:
        "부동산 시장 동향을 이미지로 만들어서 고객들에게 보내니 반응이 정말 좋습니다. 덕분에 상담 요청이 30% 증가했어요.",
      author: "박지영",
      role: "부동산 중개인",
      company: "강남 지점",
      rating: 5,
    },
    {
      quote:
        "금융 정보를 쉽고 빠르게 전달할 수 있어서 고객 만족도가 크게 올랐습니다. 텔레그램으로 자동 발송되니 업무 효율도 2배 이상 증가했어요.",
      author: "이준혁",
      role: "금융 상담사",
      company: "프라이빗뱅킹팀",
      rating: 5,
    },
    {
      quote:
        "의료 정보와 건강 팁을 정기적으로 환자들에게 전달하면서 신뢰도가 높아졌어요. 예약 취소율도 줄고 재방문율이 증가했습니다.",
      author: "최민수",
      role: "치과 원장",
      company: "서울치과의원",
      rating: 5,
    },
    {
      quote:
        "세무 일정이나 절세 팁을 자동으로 고객들에게 전달하니 고객 관리가 정말 편해졌습니다. 추천으로 신규 고객도 많이 늘었어요.",
      author: "정수연",
      role: "세무사",
      company: "정수연세무회계사무소",
      rating: 5,
    },
    {
      quote:
        "법률 뉴스와 판례를 고객들에게 보내면서 전문성을 인정받게 되었습니다. 상담 신청이 이전보다 40% 이상 늘었습니다.",
      author: "강태현",
      role: "변호사",
      company: "법무법인 정도",
      rating: 5,
    },
  ],
  en: [
    {
      quote:
        "I used to spend a lot of time finding useful information to send to customers daily. Now AI creates news and automatically sends it via Telegram, making customer management much easier.",
      author: "Seongho Kim",
      role: "Insurance Agent",
      company: "15 years experience",
      rating: 5,
    },
    {
      quote:
        "Sending real estate market trends as images to customers has received great responses. Thanks to this, consultation requests increased by 30%.",
      author: "Jiyoung Park",
      role: "Real Estate Agent",
      company: "Gangnam Branch",
      rating: 5,
    },
    {
      quote:
        "Being able to deliver financial information easily and quickly has greatly increased customer satisfaction. Work efficiency has more than doubled with automatic Telegram sending.",
      author: "Junhyuk Lee",
      role: "Financial Advisor",
      company: "Private Banking Team",
      rating: 5,
    },
    {
      quote:
        "Regularly delivering medical information and health tips to patients has increased trust. Appointment cancellations decreased and revisit rates increased.",
      author: "Minsu Choi",
      role: "Dental Clinic Director",
      company: "Seoul Dental Clinic",
      rating: 5,
    },
    {
      quote:
        "Automatically delivering tax schedules and tax-saving tips to clients has made customer management so convenient. We've gained many new clients through referrals.",
      author: "Sooyeon Jung",
      role: "Tax Accountant",
      company: "Jung Tax & Accounting Office",
      rating: 5,
    },
    {
      quote:
        "Sending legal news and case precedents to clients has earned me recognition for professionalism. Consultation requests have increased by over 40%.",
      author: "Taehyun Kang",
      role: "Attorney",
      company: "Jeongdo Law Firm",
      rating: 5,
    },
  ],
  ja: [
    {
      quote:
        "毎日顧客に送る有益な情報を探すのに時間がかかっていましたが、今はAIが自動でニュースを作成し、テレグラムで自動配信してくれるので、顧客管理が非常に楽になりました。",
      author: "金成浩",
      role: "保険プランナー",
      company: "経験15年",
      rating: 5,
    },
    {
      quote:
        "不動産市場の動向を画像にして顧客に送ったところ、反応がとても良いです。おかげで相談依頼が30％増加しました。",
      author: "朴智英",
      role: "不動産仲介人",
      company: "江南支店",
      rating: 5,
    },
    {
      quote:
        "金融情報を簡単かつ迅速に伝えられるようになり、顧客満足度が大幅に向上しました。テレグラムでの自動配信により、業務効率も2倍以上に増加しました。",
      author: "李俊赫",
      role: "金融アドバイザー",
      company: "プライベートバンキングチーム",
      rating: 5,
    },
    {
      quote:
        "医療情報と健康のヒントを定期的に患者に伝えることで、信頼度が高まりました。予約キャンセル率が減少し、再訪問率が増加しました。",
      author: "崔敏秀",
      role: "歯科医院長",
      company: "ソウル歯科医院",
      rating: 5,
    },
    {
      quote:
        "税務スケジュールや節税のヒントを自動的に顧客に伝えることで、顧客管理が本当に便利になりました。紹介で新規顧客も大幅に増えました。",
      author: "鄭秀妍",
      role: "税理士",
      company: "鄭秀妍税務会計事務所",
      rating: 5,
    },
    {
      quote:
        "法律ニュースや判例を顧客に送ることで、専門性が認められるようになりました。相談申し込みが以前より40％以上増えました。",
      author: "姜泰賢",
      role: "弁護士",
      company: "法務法人正道",
      rating: 5,
    },
  ],
}

export default function Testimonials() {
  const [locale, setLocale] = useState<Locale>("ko")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLocale = typeof window !== "undefined" ? localStorage.getItem("locale") : null
    if (savedLocale && (savedLocale === "ko" || savedLocale === "en" || savedLocale === "ja")) {
      setLocale(savedLocale as Locale)
    }

    const handleLocaleChange = () => {
      const newLocale = typeof window !== "undefined" ? localStorage.getItem("locale") : null
      if (newLocale && (newLocale === "ko" || newLocale === "en" || newLocale === "ja")) {
        setLocale(newLocale as Locale)
      }
    }

    window.addEventListener("localeChange", handleLocaleChange)

    return () => {
      window.removeEventListener("localeChange", handleLocaleChange)
    }
  }, [])

  if (!mounted) {
    return null
  }

  const t = (key: keyof typeof import("@/lib/i18n").translations.ko) => getTranslation(locale, key)
  const testimonials = testimonialsData[locale] || testimonialsData.ko

  return (
    <section id="후기" className="px-4 py-20 md:py-32 bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="section-title mb-4">{t("testimonialsTitle")}</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-4"></div>
          <p className="section-subtitle">{t("testimonialsSubtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.author}
              className="border-border bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
            >
              <CardContent className="pt-8">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-accent text-lg">
                      ⭐
                    </span>
                  ))}
                </div>

                <p className="mb-6 text-sm leading-relaxed text-foreground italic">"{testimonial.quote}"</p>

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

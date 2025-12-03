"use client"

import { useState, useEffect } from "react"
import { ZODIAC_ANIMALS, type ZodiacFortune } from "@/components/templates/fortune-types"

// 띠별 배경색 매핑
const zodiacColors: Record<string, string> = {
  rat: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  ox: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
  tiger: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  rabbit: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  dragon: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  snake: "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)",
  horse: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
  sheep: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  monkey: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
  rooster: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  dog: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
  pig: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
}

// 이모지 아이콘 매핑
const zodiacIcons: Record<string, string> = {
  rat: "🐭",
  ox: "🐮",
  tiger: "🐯",
  rabbit: "🐰",
  dragon: "🐲",
  snake: "🐍",
  horse: "🐴",
  sheep: "🐑",
  monkey: "🐵",
  rooster: "🐔",
  dog: "🐶",
  pig: "🐷",
}

// 행운 점수 계산 (운세 내용 기반)
const calculateLuck = (fortune: string): number => {
  const positiveWords = ["행운", "좋은", "성공", "기회", "발전", "상승", "빛나", "최고", "행복"]
  const negativeWords = ["주의", "조심", "삼가", "피하", "어려"]

  let score = 3
  positiveWords.forEach(word => {
    if (fortune.includes(word)) score += 0.5
  })
  negativeWords.forEach(word => {
    if (fortune.includes(word)) score -= 0.3
  })

  return Math.max(1, Math.min(5, Math.round(score)))
}

// 상세 운세 생성 (기본값)
const generateDetail = (luck: number) => ({
  love: "★".repeat(Math.min(5, luck + Math.floor(Math.random() * 2))) + "☆".repeat(Math.max(0, 5 - luck - Math.floor(Math.random() * 2))),
  money: "★".repeat(Math.min(5, luck + Math.floor(Math.random() * 2) - 1)) + "☆".repeat(Math.max(0, 5 - luck)),
  health: "★".repeat(Math.min(5, luck + Math.floor(Math.random() * 2))) + "☆".repeat(Math.max(0, 5 - luck)),
  work: "★".repeat(Math.min(5, luck + Math.floor(Math.random() * 2) - 1)) + "☆".repeat(Math.max(0, 5 - luck)),
  luckyColor: ["파란색", "빨간색", "노란색", "초록색", "보라색", "주황색", "분홍색", "하늘색"][Math.floor(Math.random() * 8)],
  luckyNumber: String(Math.floor(Math.random() * 12) + 1),
})

export default function FortunePage() {
  const [fortunes, setFortunes] = useState<ZodiacFortune[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [dateStr, setDateStr] = useState("")

  useEffect(() => {
    // 오늘 날짜 설정
    const today = new Date()
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }
    setDateStr(today.toLocaleDateString("ko-KR", options))

    // 운세 데이터 가져오기
    const fetchFortune = async () => {
      try {
        const response = await fetch("/api/fortune", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
        const result = await response.json()
        if (result.success && result.data.fortunes) {
          setFortunes(result.data.fortunes)
        } else {
          // 기본 데이터 사용
          setFortunes(ZODIAC_ANIMALS.map(z => ({
            ...z,
            years: [...z.years],
            fortune: "오늘 하루도 좋은 일이 가득하길 바랍니다.",
          })))
        }
      } catch (error) {
        console.error("운세 로드 실패:", error)
        setFortunes(ZODIAC_ANIMALS.map(z => ({
          ...z,
          years: [...z.years],
          fortune: "오늘 하루도 좋은 일이 가득하길 바랍니다.",
        })))
      } finally {
        setLoading(false)
      }
    }

    fetchFortune()
  }, [])

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">운세를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-5">
      <div className="max-w-[480px] mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* 헤더 */}
        <div
          className="py-7 px-5 text-center"
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
        >
          <h1 className="text-white text-2xl font-bold mb-2">🔮 오늘의 띠별 운세</h1>
          <p className="text-white/90 text-sm">{dateStr}</p>
        </div>

        {/* 운세 그리드 */}
        <div className="grid grid-cols-2 gap-3 p-5">
          {fortunes.map((fortune) => {
            const luck = calculateLuck(fortune.fortune)
            const detail = generateDetail(luck)
            const isExpanded = expandedCard === fortune.id
            const yearsDisplay = fortune.years.slice(-4).join(", ")

            return (
              <div
                key={fortune.id}
                className={`bg-white rounded-2xl p-4 border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-transparent ${
                  isExpanded ? "col-span-2" : ""
                }`}
                onClick={() => toggleCard(fortune.id)}
              >
                {/* 카드 헤더 */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: zodiacColors[fortune.id] }}
                  >
                    {zodiacIcons[fortune.id]}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{fortune.name}</h3>
                    <p className="text-xs text-gray-500">{yearsDisplay}</p>
                  </div>
                </div>

                {/* 행운 미터 */}
                <div className="flex gap-1 mb-2.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className="flex-1 h-1.5 rounded-full"
                      style={{
                        background: i <= luck
                          ? "linear-gradient(90deg, #667eea, #764ba2)"
                          : "#e8e8e8"
                      }}
                    />
                  ))}
                </div>

                {/* 운세 텍스트 */}
                <p className="text-sm text-gray-600 leading-relaxed">{fortune.fortune}</p>

                {/* 확장 상세 정보 */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex justify-between py-1.5 text-xs">
                        <span className="text-gray-500">💕 애정운</span>
                        <span className="text-gray-800 font-medium">{detail.love}</span>
                      </div>
                      <div className="flex justify-between py-1.5 text-xs">
                        <span className="text-gray-500">💰 금전운</span>
                        <span className="text-gray-800 font-medium">{detail.money}</span>
                      </div>
                      <div className="flex justify-between py-1.5 text-xs">
                        <span className="text-gray-500">💪 건강운</span>
                        <span className="text-gray-800 font-medium">{detail.health}</span>
                      </div>
                      <div className="flex justify-between py-1.5 text-xs">
                        <span className="text-gray-500">💼 직장운</span>
                        <span className="text-gray-800 font-medium">{detail.work}</span>
                      </div>
                      <div className="flex justify-between py-1.5 text-xs">
                        <span className="text-gray-500">🎨 행운의 색</span>
                        <span className="text-gray-800 font-medium">{detail.luckyColor}</span>
                      </div>
                      <div className="flex justify-between py-1.5 text-xs">
                        <span className="text-gray-500">🔢 행운의 숫자</span>
                        <span className="text-gray-800 font-medium">{detail.luckyNumber}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 푸터 */}
        <div className="text-center py-4 text-gray-400 text-xs border-t border-gray-100">
          매일 자정에 업데이트됩니다 ✨
        </div>
      </div>
    </div>
  )
}

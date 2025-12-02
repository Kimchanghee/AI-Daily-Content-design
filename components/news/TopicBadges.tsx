"use client"

const TOPICS = [
  { day: "월", topic: "IT/과학", color: "bg-blue-500" },
  { day: "화", topic: "경제", color: "bg-green-500" },
  { day: "수", topic: "사회", color: "bg-yellow-500" },
  { day: "목", topic: "생활/문화", color: "bg-purple-500" },
  { day: "금", topic: "연예/스포츠", color: "bg-pink-500" },
]

export default function TopicBadges() {
  return (
    <section className="py-4 bg-gray-50 border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4">
        <p className="text-center text-xs text-gray-500 mb-3">
          매일 오후 9시, 요일별 토픽 뉴스가 자동 업데이트됩니다
        </p>
        <div className="flex justify-center items-center gap-1 md:gap-2 flex-wrap">
          {TOPICS.map((item) => (
            <div
              key={item.day}
              className="flex items-center gap-1 px-2 md:px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm"
            >
              <span
                className={`w-5 h-5 flex items-center justify-center ${item.color} text-white text-xs font-bold rounded-full`}
              >
                {item.day}
              </span>
              <span className="text-gray-800 font-medium text-xs">{item.topic}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

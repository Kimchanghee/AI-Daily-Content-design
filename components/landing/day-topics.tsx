"use client"

import { DAY_TOPICS } from "@/components/templates/template-types"

const days = ["월", "화", "수", "목", "금"]
const dayNumbers = [1, 2, 3, 4, 5]

export default function DayTopics() {
  return (
    <section className="py-8 bg-gray-50 border-y border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4">
        <h3 className="text-center text-sm font-medium text-gray-500 mb-4">
          매일 오후 9시, 요일별 토픽 뉴스가 자동으로 업데이트됩니다
        </h3>
        <div className="flex justify-center items-center gap-2 md:gap-4 flex-wrap">
          {dayNumbers.map((dayNum, idx) => (
            <div
              key={dayNum}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm"
            >
              <span className="w-8 h-8 flex items-center justify-center bg-black text-white text-sm font-bold rounded-full">
                {days[idx]}
              </span>
              <span className="text-sm font-medium text-gray-700">{DAY_TOPICS[dayNum].topic}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

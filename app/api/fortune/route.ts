import { NextResponse } from "next/server"
import { generateFortuneWithGemini, getDefaultFortunes } from "@/lib/gemini-fortune"
import type { ZodiacFortune } from "@/components/templates/fortune-types"
import { sendFortuneToExternalServer } from "@/lib/external-api"

let cachedFortuneData: ZodiacFortune[] = []
let lastUpdateTime: Date | null = null
let lastUpdateDay: number | null = null

// 오후 9시(21시)에 업데이트해야 하는지 확인 (뉴스와 동일한 시간)
const shouldUpdateFortune = (now: Date): boolean => {
  const koreaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
  const currentHour = koreaTime.getHours()
  const currentDay = koreaTime.getDate()

  // 캐시가 없으면 업데이트
  if (cachedFortuneData.length === 0) {
    return true
  }

  // 날짜가 바뀌었으면 업데이트
  if (lastUpdateDay !== null && lastUpdateDay !== currentDay) {
    return true
  }

  // 오후 9시가 아니면 업데이트 안함
  if (currentHour !== 21) {
    return false
  }

  // 마지막 업데이트가 없으면 업데이트
  if (!lastUpdateTime) {
    return true
  }

  const lastKoreaTime = new Date(lastUpdateTime.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))

  // 같은 날 같은 시간에 이미 업데이트했으면 스킵
  if (
    lastKoreaTime.getDate() === koreaTime.getDate() &&
    lastKoreaTime.getMonth() === koreaTime.getMonth() &&
    lastKoreaTime.getFullYear() === koreaTime.getFullYear() &&
    lastKoreaTime.getHours() === currentHour
  ) {
    return false
  }

  return true
}

// 날짜 문자열 생성
const getDateString = () => {
  const today = new Date()
  const koreaTime = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
  return `${koreaTime.getFullYear()}.${String(koreaTime.getMonth() + 1).padStart(2, "0")}.${String(koreaTime.getDate()).padStart(2, "0")}`
}

export async function POST() {
  const now = new Date()
  const dateStr = getDateString()

  // 캐시가 비어있거나 업데이트가 필요한 경우
  if (shouldUpdateFortune(now)) {
    console.log(`[Fortune API] Updating fortunes for: ${dateStr}`)

    try {
      // Gemini API로 운세 생성
      const fortuneData = await generateFortuneWithGemini()
      cachedFortuneData = fortuneData
      lastUpdateTime = now
      lastUpdateDay = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })).getDate()

      // 외부 서버로 전송
      try {
        await sendFortuneToExternalServer(fortuneData)
      } catch (externalError) {
        console.error("[Fortune API] External server send failed:", externalError)
      }

      return NextResponse.json({
        success: true,
        data: {
          date: dateStr,
          fortunes: fortuneData,
        },
        timestamp: now.toISOString(),
        source: "gemini",
        nextUpdate: "매일 오후 9시 (KST)",
        message: `${dateStr} 띠별운세 업데이트 완료 (Gemini API)`,
      })
    } catch (error) {
      console.error("[Fortune API] Gemini generation failed, using default data:", error)

      // Gemini 실패 시 기본 데이터 사용
      const defaultData = getDefaultFortunes()
      cachedFortuneData = defaultData
      lastUpdateTime = now
      lastUpdateDay = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })).getDate()

      // 외부 서버로 전송
      try {
        await sendFortuneToExternalServer(defaultData)
      } catch (externalError) {
        console.error("[Fortune API] External server send failed:", externalError)
      }

      return NextResponse.json({
        success: true,
        data: {
          date: dateStr,
          fortunes: defaultData,
        },
        timestamp: now.toISOString(),
        source: "default",
        nextUpdate: "매일 오후 9시 (KST)",
        message: `${dateStr} 띠별운세 업데이트 완료 (기본 데이터)`,
      })
    }
  }

  // 캐시된 데이터 반환
  return NextResponse.json({
    success: true,
    data: {
      date: dateStr,
      fortunes: cachedFortuneData,
    },
    timestamp: lastUpdateTime?.toISOString() || now.toISOString(),
    source: "cache",
    usedCache: true,
    nextUpdate: "매일 오후 9시 (KST)",
    message: `캐시된 띠별운세입니다. 다음 업데이트: 오후 9시`,
  })
}

// GET 요청 지원 (수동 새로고침용)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const forceRefresh = searchParams.get("refresh") === "true"

  const now = new Date()
  const dateStr = getDateString()

  // 강제 새로고침이거나 캐시가 없는 경우
  if (forceRefresh || cachedFortuneData.length === 0) {
    console.log(`[Fortune API] Force refresh fortunes for: ${dateStr}`)

    try {
      const fortuneData = await generateFortuneWithGemini()
      cachedFortuneData = fortuneData
      lastUpdateTime = now
      lastUpdateDay = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })).getDate()

      return NextResponse.json({
        success: true,
        data: {
          date: dateStr,
          fortunes: fortuneData,
        },
        timestamp: now.toISOString(),
        source: "gemini",
        message: `${dateStr} 띠별운세 새로고침 완료`,
      })
    } catch (error) {
      console.error("[Fortune API] Gemini generation failed:", error)

      const defaultData = getDefaultFortunes()
      if (cachedFortuneData.length === 0) {
        cachedFortuneData = defaultData
        lastUpdateTime = now
        lastUpdateDay = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })).getDate()
      }

      return NextResponse.json({
        success: true,
        data: {
          date: dateStr,
          fortunes: cachedFortuneData.length > 0 ? cachedFortuneData : defaultData,
        },
        timestamp: lastUpdateTime?.toISOString() || now.toISOString(),
        source: cachedFortuneData.length > 0 ? "cache" : "default",
        message: `${dateStr} 띠별운세 (Gemini API 오류로 캐시/기본값 사용)`,
      })
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      date: dateStr,
      fortunes: cachedFortuneData,
    },
    timestamp: lastUpdateTime?.toISOString() || now.toISOString(),
    source: "cache",
    message: `캐시된 ${dateStr} 띠별운세`,
  })
}

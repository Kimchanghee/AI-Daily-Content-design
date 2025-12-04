import { NextResponse } from "next/server"
import { fetchStockData, getDefaultStockData, type StockData } from "@/lib/stock-api"
import { sendStockToExternalServer } from "@/lib/external-api"

let cachedStockData: StockData | null = null
let lastUpdateTime: Date | null = null

// 날짜 문자열 생성
const getDateString = () => {
  const today = new Date()
  const koreaTime = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
  return `${koreaTime.getFullYear()}.${String(koreaTime.getMonth() + 1).padStart(2, "0")}.${String(koreaTime.getDate()).padStart(2, "0")}`
}

export async function POST() {
  const now = new Date()
  const dateStr = getDateString()

  console.log(`[Stock API] Updating stock data for: ${dateStr}`)

  try {
    // 증시/환율 데이터 가져오기
    const stockData = await fetchStockData()
    cachedStockData = stockData
    lastUpdateTime = now

    // 외부 서버로 전송
    try {
      await sendStockToExternalServer(stockData)
    } catch (externalError) {
      console.error("[Stock API] External server send failed:", externalError)
    }

    return NextResponse.json({
      success: true,
      data: stockData,
      timestamp: now.toISOString(),
      source: "live",
      message: `${dateStr} 증시/환율 업데이트 완료`,
    })
  } catch (error) {
    console.error("[Stock API] Fetch failed, using default data:", error)

    // 실패 시 기본 데이터 사용
    const defaultData = getDefaultStockData()
    cachedStockData = defaultData
    lastUpdateTime = now

    // 외부 서버로 전송
    try {
      await sendStockToExternalServer(defaultData)
    } catch (externalError) {
      console.error("[Stock API] External server send failed:", externalError)
    }

    return NextResponse.json({
      success: true,
      data: defaultData,
      timestamp: now.toISOString(),
      source: "default",
      message: `${dateStr} 증시/환율 업데이트 완료 (기본값)`,
    })
  }
}

// GET 요청 지원
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const forceRefresh = searchParams.get("refresh") === "true"

  const now = new Date()
  const dateStr = getDateString()

  // 강제 새로고침이거나 캐시가 없는 경우
  if (forceRefresh || !cachedStockData) {
    console.log(`[Stock API] Refreshing stock data for: ${dateStr}`)

    try {
      const stockData = await fetchStockData()
      cachedStockData = stockData
      lastUpdateTime = now

      // 외부 서버로 전송
      try {
        await sendStockToExternalServer(stockData)
      } catch (externalError) {
        console.error("[Stock API] External server send failed:", externalError)
      }

      return NextResponse.json({
        success: true,
        data: stockData,
        timestamp: now.toISOString(),
        source: "live",
        message: `${dateStr} 증시/환율 새로고침 완료`,
      })
    } catch (error) {
      console.error("[Stock API] Fetch failed:", error)

      const defaultData = getDefaultStockData()
      if (!cachedStockData) {
        cachedStockData = defaultData
        lastUpdateTime = now
      }

      return NextResponse.json({
        success: true,
        data: cachedStockData || defaultData,
        timestamp: lastUpdateTime?.toISOString() || now.toISOString(),
        source: cachedStockData ? "cache" : "default",
        message: `${dateStr} 증시/환율 (캐시/기본값)`,
      })
    }
  }

  // 캐시된 데이터 반환
  return NextResponse.json({
    success: true,
    data: cachedStockData,
    timestamp: lastUpdateTime?.toISOString() || now.toISOString(),
    source: "cache",
    message: `캐시된 ${dateStr} 증시/환율`,
  })
}

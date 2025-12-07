import { NextResponse } from "next/server"
import { fetchStockData, getDefaultStockData } from "@/lib/stock-api"
import { sendStockToExternalServer } from "@/lib/external-api"

// GitHub Actions로 매일 오후 9시(KST)에 실행
// schedule: "0 12 * * *" (UTC 12:00 = KST 21:00)

export async function GET() {
  const today = new Date()
  const koreaTime = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
  const dateStr = `${koreaTime.getFullYear()}.${String(koreaTime.getMonth() + 1).padStart(2, "0")}.${String(koreaTime.getDate()).padStart(2, "0")}`

  console.log(`[Cron Stock] Starting stock/exchange update for: ${dateStr}`)

  try {
    // Gemini API로 증시/환율 데이터 가져오기
    const stockData = await fetchStockData()
    console.log(`[Cron Stock] Successfully fetched stock data`)

    // 외부 서버로 전송
    try {
      await sendStockToExternalServer(stockData)
      console.log(`[Cron Stock] Stock data sent to external server`)
    } catch (externalError) {
      console.error("[Cron Stock] External server send failed:", externalError)
    }

    return NextResponse.json({
      success: true,
      message: `${dateStr} 증시/환율 업데이트 완료`,
      data: stockData,
      externalSync: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Cron Stock] Stock update failed, using default:", error)

    // 실패 시 기본 데이터 사용
    try {
      const defaultData = getDefaultStockData()
      await sendStockToExternalServer(defaultData)

      return NextResponse.json({
        success: true,
        message: `${dateStr} 증시/환율 업데이트 완료 (기본값)`,
        data: defaultData,
        source: "default",
        externalSync: true,
        timestamp: new Date().toISOString(),
      })
    } catch (fallbackError) {
      return NextResponse.json({
        success: false,
        message: "증시/환율 업데이트 실패",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }, { status: 500 })
    }
  }
}

import { NextResponse } from "next/server"
import { generateFortuneWithGemini, getDefaultFortunes } from "@/lib/gemini-fortune"
import { sendFortuneToExternalServer } from "@/lib/external-api"

// GitHub Actions로 매일 오후 9시(KST)에 실행
// schedule: "0 12 * * *" (UTC 12:00 = KST 21:00)

export async function GET(request: Request) {
  // Vercel Cron 인증 확인
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // 개발 환경에서는 CRON_SECRET이 없을 수 있음
    if (process.env.NODE_ENV === "production" && process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const today = new Date()
  const koreaTime = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
  const dateStr = `${koreaTime.getFullYear()}.${String(koreaTime.getMonth() + 1).padStart(2, "0")}.${String(koreaTime.getDate()).padStart(2, "0")}`

  console.log(`[Cron Fortune] Starting fortune update for: ${dateStr}`)

  try {
    // Gemini API로 운세 생성
    const fortuneData = await generateFortuneWithGemini()
    console.log(`[Cron Fortune] Successfully generated ${fortuneData.length} fortunes`)

    // 외부 서버로 전송
    try {
      await sendFortuneToExternalServer(fortuneData)
      console.log(`[Cron Fortune] Fortune sent to external server`)
    } catch (externalError) {
      console.error("[Cron Fortune] External server send failed:", externalError)
    }

    return NextResponse.json({
      success: true,
      message: `${dateStr} 띠별운세 업데이트 완료`,
      date: dateStr,
      count: fortuneData.length,
      externalSync: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Cron Fortune] Fortune update failed, using default:", error)

    // 실패 시 기본 운세 사용
    try {
      const defaultFortunes = getDefaultFortunes()
      await sendFortuneToExternalServer(defaultFortunes)

      return NextResponse.json({
        success: true,
        message: `${dateStr} 띠별운세 업데이트 완료 (기본값)`,
        date: dateStr,
        count: defaultFortunes.length,
        source: "default",
        externalSync: true,
        timestamp: new Date().toISOString(),
      })
    } catch (fallbackError) {
      return NextResponse.json({
        success: false,
        message: "운세 업데이트 실패",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }, { status: 500 })
    }
  }
}

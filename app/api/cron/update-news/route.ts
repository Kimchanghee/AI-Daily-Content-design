import { NextResponse } from "next/server"
import { fetchNewsWithGemini, getTodayTopic } from "@/lib/gemini"
import { saveNewsData } from "@/lib/news-storage"
import { sendNewsToExternalServer } from "@/lib/external-api"

// GitHub Actions로 매일 오후 9시(KST)에 실행
// schedule: "0 12 * * *" (UTC 12:00 = KST 21:00)

export async function GET() {
  const { topic, dayOfWeek } = getTodayTopic()
  console.log(`[Cron] Starting news update for topic: ${topic} (day: ${dayOfWeek})`)

  try {
    // Gemini API로 뉴스 가져오기
    const newsData = await fetchNewsWithGemini()
    console.log(`[Cron] Successfully fetched ${newsData.length} news items`)

    // 로컬 저장
    await saveNewsData(newsData, topic)
    console.log(`[Cron] News saved locally`)

    // 외부 서버로 전송
    try {
      await sendNewsToExternalServer(newsData)
      console.log(`[Cron] News sent to external server`)
    } catch (externalError) {
      console.error("[Cron] External server send failed:", externalError)
    }

    return NextResponse.json({
      success: true,
      message: `${topic} 뉴스 업데이트 완료`,
      topic: topic,
      count: newsData.length,
      externalSync: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Cron] News update failed:", error)

    return NextResponse.json({
      success: false,
      message: "뉴스 업데이트 실패",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

import { DAY_TOPICS } from "@/components/templates/template-types"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

interface NewsItem {
  id: string
  category: string
  title: string
  summary: string
  source: string
  publishedAt: string
  reporter: string
}

// 오늘 요일에 맞는 토픽과 URL 가져오기
export function getTodayTopic(): { topic: string; url: string; dayOfWeek: number } {
  const now = new Date()
  const koreaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
  const dayOfWeek = koreaTime.getDay()
  const topicInfo = DAY_TOPICS[dayOfWeek]
  return { ...topicInfo, dayOfWeek }
}

// Gemini API를 사용하여 네이버 뉴스 페이지에서 뉴스 추출
export async function fetchNewsWithGemini(): Promise<NewsItem[]> {
  if (!GEMINI_API_KEY) {
    console.error("[Gemini] API key not configured")
    throw new Error("GEMINI_API_KEY is not configured")
  }

  const { topic, url } = getTodayTopic()
  const today = new Date()
  const koreaTime = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
  const dateStr = `${koreaTime.getFullYear()}.${String(koreaTime.getMonth() + 1).padStart(2, "0")}.${String(koreaTime.getDate()).padStart(2, "0")}`

  console.log(`[Gemini] Fetching news for topic: ${topic}, URL: ${url}`)

  try {
    // 네이버 뉴스 페이지 HTML 가져오기
    const htmlResponse = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    })

    if (!htmlResponse.ok) {
      throw new Error(`Failed to fetch Naver news: ${htmlResponse.status}`)
    }

    const html = await htmlResponse.text()

    // Gemini API로 뉴스 추출 요청 (gemini-2.0-flash 사용)
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `다음은 네이버 뉴스 "${topic}" 섹션의 HTML입니다. 이 페이지에서 주요 뉴스 기사 15개를 추출해주세요.

각 뉴스 기사에 대해 다음 정보를 JSON 배열 형식으로 반환해주세요:
- id: 순번 (1부터 시작)
- category: "${topic}"
- title: 기사 제목 (30자 이내로 요약)
- summary: 기사 내용 요약 (2-3문장, 80-120자)
- source: 언론사명
- publishedAt: "${dateStr}"
- reporter: 기자명 (없으면 "취재팀")

반드시 아래 JSON 형식으로만 응답해주세요. 다른 텍스트 없이 JSON 배열만 반환하세요:
[{"id": "1", "category": "${topic}", "title": "...", "summary": "...", "source": "...", "publishedAt": "${dateStr}", "reporter": "..."}]

HTML:
${html.substring(0, 50000)}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 8192,
          },
        }),
      }
    )

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error("[Gemini] API error:", errorText)
      throw new Error(`Gemini API error: ${geminiResponse.status}`)
    }

    const geminiData = await geminiResponse.json()
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ""

    console.log("[Gemini] Raw response:", responseText.substring(0, 500))

    // JSON 추출 (마크다운 코드 블록 제거)
    let jsonStr = responseText
    if (responseText.includes("```json")) {
      jsonStr = responseText.split("```json")[1].split("```")[0].trim()
    } else if (responseText.includes("```")) {
      jsonStr = responseText.split("```")[1].split("```")[0].trim()
    }

    const newsData: NewsItem[] = JSON.parse(jsonStr)

    // 데이터 검증 및 정리
    const validatedNews = newsData.slice(0, 15).map((item, index) => ({
      id: String(index + 1),
      category: item.category || topic,
      title: item.title?.substring(0, 50) || "제목 없음",
      summary: item.summary?.substring(0, 200) || "내용 없음",
      source: item.source || "뉴스",
      publishedAt: dateStr,
      reporter: item.reporter || "취재팀",
    }))

    console.log(`[Gemini] Successfully extracted ${validatedNews.length} news items`)
    return validatedNews
  } catch (error) {
    console.error("[Gemini] Error fetching news:", error)
    throw error
  }
}

import { NextResponse } from "next/server"

const mockNewsData = [
  {
    id: "정치-0",
    category: "정치",
    title: "정부, 2025년 경제정책 방향 발표",
    summary: "내년도 경제성장률 목표 2.2%로 설정하고 민생안정에 주력",
    source: "연합뉴스",
    timestamp: new Date().toISOString(),
    url: "https://news.naver.com/section/100",
  },
  {
    id: "경제-0",
    category: "경제",
    title: "코스피 2,500선 회복, 외국인 순매수 지속",
    summary: "반도체 주도로 상승세, 환율 안정화도 긍정적 요인",
    source: "매일경제",
    timestamp: new Date().toISOString(),
    url: "https://news.naver.com/section/101",
  },
  {
    id: "사회-0",
    category: "사회",
    title: "수능 응시생 44만명, 역대 최저 기록",
    summary: "저출산 영향으로 전년 대비 2만명 감소",
    source: "조선일보",
    timestamp: new Date().toISOString(),
    url: "https://news.naver.com/section/102",
  },
  {
    id: "생활/문화-0",
    category: "생활/문화",
    title: "겨울 한파 주의보, 체감온도 영하 15도",
    summary: "전국 대부분 지역 강추위, 건강관리 당부",
    source: "중앙일보",
    timestamp: new Date().toISOString(),
    url: "https://news.naver.com/section/103",
  },
  {
    id: "세계-0",
    category: "세계",
    title: "미국 연준, 기준금리 동결 결정",
    summary: "인플레이션 둔화세 확인 후 인하 검토 예정",
    source: "한국경제",
    timestamp: new Date().toISOString(),
    url: "https://news.naver.com/section/104",
  },
  {
    id: "IT/과학-0",
    category: "IT/과학",
    title: "삼성전자, 차세대 AI 칩 개발 성공",
    summary: "데이터센터용 반도체 시장 공략 본격화",
    source: "전자신문",
    timestamp: new Date().toISOString(),
    url: "https://news.naver.com/section/105",
  },
]

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function POST() {
  try {
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyC36ulrRywaNXnXSA6VVFtRP_elPyzbkaw"

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "서버 설정 오류: Gemini API Key가 설정되지 않았습니다.",
        },
        { status: 500 },
      )
    }

    const newsCategories = [
      { category: "정치", url: "https://news.naver.com/section/100" },
      { category: "경제", url: "https://news.naver.com/section/101" },
      { category: "사회", url: "https://news.naver.com/section/102" },
      { category: "생활/문화", url: "https://news.naver.com/section/103" },
      { category: "세계", url: "https://news.naver.com/section/104" },
      { category: "IT/과학", url: "https://news.naver.com/section/105" },
    ]

    const allNews: any[] = []
    let quotaExceeded = false

    for (const { category, url } of newsCategories) {
      if (quotaExceeded) break

      let retries = 0
      const maxRetries = 2

      while (retries <= maxRetries) {
        try {
          const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey,
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `${url} 페이지에서 최신 헤드라인 뉴스 상위 5개를 추출해주세요. 각 뉴스마다 제목, 요약(50자 이내), 언론사를 JSON 배열 형식으로 반환해주세요. 형식: [{"title": "제목", "summary": "요약", "source": "언론사"}]`,
                      },
                    ],
                  },
                ],
                tools: [
                  {
                    url_context: {},
                  },
                ],
              }),
            },
          )

          if (response.status === 429) {
            console.log(`[v0] ${category} 카테고리: API 할당량 초과`)
            quotaExceeded = true
            break
          }

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const data = await response.json()
          const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text

          if (textContent) {
            const jsonMatch = textContent.match(/\[[\s\S]*\]/)
            if (jsonMatch) {
              const newsItems = JSON.parse(jsonMatch[0])
              newsItems.forEach((item: any, index: number) => {
                allNews.push({
                  id: `${category}-${index}`,
                  category,
                  title: item.title,
                  summary: item.summary,
                  source: item.source,
                  timestamp: new Date().toISOString(),
                  url,
                })
              })
            }
          }
          break // 성공하면 재시도 루프 종료
        } catch (categoryError) {
          retries++
          if (retries > maxRetries) {
            console.error(`[v0] ${category} 카테고리 최종 실패:`, categoryError)
            break
          }
          await sleep(1000 * retries)
        }
      }
    }

    if (quotaExceeded || allNews.length === 0) {
      console.log("[v0] 목 데이터 반환")
      return NextResponse.json({
        success: true,
        data: mockNewsData,
        timestamp: new Date().toISOString(),
        usedMockData: true,
        message: "API 할당량 제한으로 샘플 뉴스를 표시합니다. 잠시 후 다시 시도해주세요.",
      })
    }

    return NextResponse.json({
      success: true,
      data: allNews,
      timestamp: new Date().toISOString(),
      usedMockData: false,
    })
  } catch (error) {
    console.error("[v0] 뉴스 스크랩 오류:", error)
    return NextResponse.json({
      success: true,
      data: mockNewsData,
      timestamp: new Date().toISOString(),
      usedMockData: true,
      message: "일시적인 오류로 샘플 뉴스를 표시합니다.",
    })
  }
}

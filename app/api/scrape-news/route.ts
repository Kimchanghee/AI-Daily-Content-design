import { NextResponse } from "next/server"

export async function GET() {
  try {
    // TODO: 실제 뉴스 사이트에서 크롤링
    const news = [
      {
        id: "1",
        category: "경제",
        title: "한국은행, 기준금리 동결 결정",
        summary: "한국은행이 기준금리를 현행 3.50%로 동결했습니다.",
        source: "연합뉴스",
        timestamp: new Date().toISOString(),
        url: "https://example.com/news/1",
      },
      {
        id: "2",
        category: "스포츠",
        title: "손흥민, EPL 이번 시즌 10호골 달성",
        summary: "토트넘의 손흥민이 시즌 10호골을 기록했습니다.",
        source: "스포츠조선",
        timestamp: new Date().toISOString(),
        url: "https://example.com/news/2",
      },
      {
        id: "3",
        category: "연예",
        title: "영화 '서울의 봄' 천만 관객 돌파",
        summary: "화제의 영화가 개봉 3주 만에 천만 관객을 돌파했습니다.",
        source: "마이데일리",
        timestamp: new Date().toISOString(),
        url: "https://example.com/news/3",
      },
    ]

    return NextResponse.json({ success: true, data: news })
  } catch (error) {
    console.error("[v0] 뉴스 스크랩 오류:", error)
    return NextResponse.json({ success: false, error: "Failed to scrape news" }, { status: 500 })
  }
}

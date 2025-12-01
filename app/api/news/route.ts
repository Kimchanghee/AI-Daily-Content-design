import { NextResponse } from "next/server"
import { fetchNewsWithGemini, getTodayTopic } from "@/lib/gemini"

let cachedNewsData: any[] = []
let lastUpdateTime: Date | null = null
let lastUpdateDay: number | null = null

// 폴백용 Mock 데이터 (Gemini API 실패 시 사용)
const getMockNewsData = (topic: string) => {
  const today = new Date()
  const koreaTime = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
  const dateStr = `${koreaTime.getFullYear()}.${String(koreaTime.getMonth() + 1).padStart(2, "0")}.${String(koreaTime.getDate()).padStart(2, "0")}`

  const mockByTopic: Record<string, any[]> = {
    "정치": [
      { id: "1", category: "정치", title: "여야 예산안 협상 난항", summary: "복지예산 증액을 두고 여야 이견이 좁혀지지 않으며 법정처리 시한이 임박했다. 여당은 재정건전성을, 야당은 취약계층 지원 확대를 주장하며 막판 줄다리기가 이어지고 있다.", source: "KBS", publishedAt: dateStr, reporter: "김정은" },
      { id: "2", category: "정치", title: "대통령실, 새 정책 발표 예고", summary: "대통령실이 다음 주 중요 정책 발표를 예고했다. 경제 활성화와 민생 안정을 위한 종합대책이 포함될 것으로 전망되며, 각 부처별 세부 계획도 함께 공개될 예정이다.", source: "연합뉴스", publishedAt: dateStr, reporter: "박기자" },
    ],
    "경제": [
      { id: "1", category: "경제", title: "몸값 오른 코스피, 당분간은 쉼", summary: "외국인 투자자들이 중소형주로 관심을 돌리며 코스피 상승세가 주춤하고 있다. 전문가들은 단기 조정 국면에 진입했으며, 미국 금리 동결 기대감이 반영되면 다시 상승 흐름을 탈 것으로 전망하고 있다.", source: "한국경제", publishedAt: dateStr, reporter: "김민수" },
      { id: "2", category: "경제", title: "서학개미가 끌어올린 환율", summary: "미국 주식 투자 열풍으로 달러 수요가 급증하며 환율이 1,470원을 돌파했다. 금융당국은 외환시장 안정화 방안을 모색 중이며, 과도한 환율 변동성에 대한 시장 경고 메시지를 내놓고 있다.", source: "머니투데이", publishedAt: dateStr, reporter: "한승우" },
    ],
    "사회": [
      { id: "1", category: "사회", title: "수능 이후 수험생 이동 러시", summary: "대학수학능력시험이 끝나며 여행과 문화 소비가 급증하고 있다. 유통업계는 특수를 기대하며 수험생 할인 이벤트를 진행 중이고, 항공사와 여행사도 수험생 맞춤 상품을 출시하며 마케팅에 나섰다.", source: "MBC", publishedAt: dateStr, reporter: "이수현" },
      { id: "2", category: "사회", title: "전국 기온 '뚝' 6도 안팎 출근길", summary: "중부지방을 중심으로 아침 기온이 영하권까지 떨어지며 본격적인 겨울 추위가 시작됐다. 미세먼지도 '나쁨' 수준을 보여 마스크 착용이 권고되며, 당분간 쌀쌀한 날씨가 이어질 전망이다.", source: "연합뉴스", publishedAt: dateStr, reporter: "박지현" },
    ],
    "생활/문화": [
      { id: "1", category: "생활/문화", title: "BTS 진 솔로 앨범 빌보드 1위", summary: "K-POP 솔로 아티스트 최초로 빌보드 앨범 차트 정상에 올랐다. 전 세계 팬들의 뜨거운 반응 속에 음반 판매량 100만 장을 돌파했으며, 글로벌 투어 일정도 순차적으로 공개될 예정이다.", source: "스포츠조선", publishedAt: dateStr, reporter: "최유리" },
      { id: "2", category: "생활/문화", title: "연말 공연 시장 활기", summary: "연말을 맞아 각종 공연과 전시회가 줄줄이 개막하고 있다. 뮤지컬, 콘서트, 미술전 등 다양한 문화 행사가 관객들을 기다리며, 예매율도 빠르게 상승하는 추세다.", source: "문화일보", publishedAt: dateStr, reporter: "김문화" },
    ],
    "IT/과학": [
      { id: "1", category: "IT/과학", title: "AI 시대 벌써 만 3년", summary: "2022년 11월 30일 챗GPT 출범 이후 산업 전반에 AI 도입이 가속화되고 있다. 국내 기업들도 AI 기반 서비스 개발에 박차를 가하며, 금융·의료·교육 분야에서 획기적인 변화가 일어나고 있다.", source: "전자신문", publishedAt: dateStr, reporter: "정수민" },
      { id: "2", category: "IT/과학", title: "삼성, HBM 시장 역전 성공", summary: "구글용 HBM 납품 비중이 60%를 넘어서며 SK하이닉스를 맹추격하고 있다. 삼성전자는 차세대 HBM4 개발에도 속도를 내며 반도체 시장 주도권 탈환에 총력을 기울이고 있다.", source: "디지털타임스", publishedAt: dateStr, reporter: "강동훈" },
    ],
    "세계": [
      { id: "1", category: "세계", title: "美-우크라 종전협의 진행", summary: "루비오 국무장관은 '생산적이었지만 할 일이 많다'고 밝혔다. 러시아와의 직접 대화 가능성도 열어두며 외교적 해결을 모색 중이나, 양측 입장 차이가 커 협상 타결까지는 시간이 걸릴 전망이다.", source: "중앙일보", publishedAt: dateStr, reporter: "박세준" },
      { id: "2", category: "세계", title: "중동 정세 긴장 고조", summary: "이스라엘과 하마스 간 휴전 협상이 난항을 겪고 있다. 국제사회의 중재 노력에도 불구하고 양측 입장차가 좁혀지지 않아 인도주의적 위기가 심화되고 있다는 우려가 커지고 있다.", source: "조선일보", publishedAt: dateStr, reporter: "이세계" },
    ],
  }

  // 해당 토픽의 Mock 데이터 반환 (없으면 경제 기본값)
  const topicNews = mockByTopic[topic] || mockByTopic["경제"]

  // 15개로 확장
  const expandedNews = []
  for (let i = 0; i < 15; i++) {
    const baseItem = topicNews[i % topicNews.length]
    expandedNews.push({
      ...baseItem,
      id: String(i + 1),
    })
  }

  return expandedNews
}

// 오후 9시(21시)에 업데이트해야 하는지 확인
const shouldUpdateNews = (now: Date): boolean => {
  const koreaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
  const currentHour = koreaTime.getHours()
  const currentDay = koreaTime.getDay()

  // 캐시가 없으면 업데이트
  if (cachedNewsData.length === 0) {
    return true
  }

  // 요일이 바뀌었으면 업데이트 (새로운 토픽)
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

export async function POST() {
  const now = new Date()
  const { topic, dayOfWeek } = getTodayTopic()

  // 캐시가 비어있거나 업데이트가 필요한 경우
  if (shouldUpdateNews(now)) {
    console.log(`[News API] Updating news for topic: ${topic} (day: ${dayOfWeek})`)

    try {
      // Gemini API로 실제 뉴스 가져오기 시도
      const newsData = await fetchNewsWithGemini()
      cachedNewsData = newsData
      lastUpdateTime = now
      lastUpdateDay = dayOfWeek

      return NextResponse.json({
        success: true,
        data: newsData,
        topic: topic,
        timestamp: now.toISOString(),
        source: "gemini",
        nextUpdate: "매일 오후 9시 (KST)",
        message: `${topic} 뉴스 업데이트 완료 (Gemini API)`,
      })
    } catch (error) {
      console.error("[News API] Gemini fetch failed, using mock data:", error)

      // Gemini 실패 시 Mock 데이터 사용
      const mockData = getMockNewsData(topic)
      cachedNewsData = mockData
      lastUpdateTime = now
      lastUpdateDay = dayOfWeek

      return NextResponse.json({
        success: true,
        data: mockData,
        topic: topic,
        timestamp: now.toISOString(),
        source: "mock",
        nextUpdate: "매일 오후 9시 (KST)",
        message: `${topic} 뉴스 업데이트 완료 (샘플 데이터)`,
      })
    }
  }

  // 캐시된 데이터 반환
  return NextResponse.json({
    success: true,
    data: cachedNewsData,
    topic: topic,
    timestamp: lastUpdateTime?.toISOString() || now.toISOString(),
    source: "cache",
    usedCache: true,
    nextUpdate: "매일 오후 9시 (KST)",
    message: `캐시된 ${topic} 뉴스입니다. 다음 업데이트: 오후 9시`,
  })
}

// GET 요청도 지원 (수동 새로고침용)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const forceRefresh = searchParams.get("refresh") === "true"

  const now = new Date()
  const { topic, dayOfWeek } = getTodayTopic()

  // 강제 새로고침이거나 캐시가 없는 경우
  if (forceRefresh || cachedNewsData.length === 0) {
    console.log(`[News API] Force refresh for topic: ${topic}`)

    try {
      const newsData = await fetchNewsWithGemini()
      cachedNewsData = newsData
      lastUpdateTime = now
      lastUpdateDay = dayOfWeek

      return NextResponse.json({
        success: true,
        data: newsData,
        topic: topic,
        timestamp: now.toISOString(),
        source: "gemini",
        message: `${topic} 뉴스 새로고침 완료`,
      })
    } catch (error) {
      console.error("[News API] Gemini fetch failed:", error)

      const mockData = getMockNewsData(topic)
      if (cachedNewsData.length === 0) {
        cachedNewsData = mockData
        lastUpdateTime = now
        lastUpdateDay = dayOfWeek
      }

      return NextResponse.json({
        success: true,
        data: cachedNewsData.length > 0 ? cachedNewsData : mockData,
        topic: topic,
        timestamp: lastUpdateTime?.toISOString() || now.toISOString(),
        source: cachedNewsData.length > 0 ? "cache" : "mock",
        message: `${topic} 뉴스 (Gemini API 오류로 캐시/샘플 사용)`,
      })
    }
  }

  return NextResponse.json({
    success: true,
    data: cachedNewsData,
    topic: topic,
    timestamp: lastUpdateTime?.toISOString() || now.toISOString(),
    source: "cache",
    message: `캐시된 ${topic} 뉴스`,
  })
}

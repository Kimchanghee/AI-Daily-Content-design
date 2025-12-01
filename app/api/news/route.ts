import { NextResponse } from "next/server"

let cachedNewsData: any[] = []
let lastUpdateTime: Date | null = null

const getMockNewsData = () => {
  const today = new Date()
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`

  return [
    {
      id: "1",
      category: "경제",
      title: "몸값 오른 코스피, 당분간은 쉼",
      summary: "외국인 투자자들이 중소형주로 관심을 돌리며 코스피 상승세 주춤",
      source: "한국경제",
      publishedAt: dateStr,
      reporter: "김민수",
    },
    {
      id: "2",
      category: "부동산",
      title: "서울 아파트 계약 해제율 7.4%",
      summary: "2020년 이후 최대치 기록, 금리 인상 여파로 매수세 위축",
      source: "매일경제",
      publishedAt: dateStr,
      reporter: "이정희",
    },
    {
      id: "3",
      category: "생활",
      title: "전국 기온 '뚝' 6도 안팎 출근길",
      summary: "미세먼지 '나쁨' 수준, 마스크 착용 권고",
      source: "연합뉴스",
      publishedAt: dateStr,
      reporter: "박지현",
    },
    {
      id: "4",
      category: "IT",
      title: "AI 시대 벌써 만 3년",
      summary: "2022년 11월 30일 챗GPT 출범 이후 산업 전반 AI 도입 가속화",
      source: "전자신문",
      publishedAt: dateStr,
      reporter: "정수민",
    },
    {
      id: "5",
      category: "경제",
      title: "주가 상승에 웃은 운용업계",
      summary: "3분기 영업이익 154.9% 증가, 증시 호황 수혜",
      source: "조선비즈",
      publishedAt: dateStr,
      reporter: "최영진",
    },
    {
      id: "6",
      category: "IT",
      title: "삼성, 역전 성공했다",
      summary: "구글용 HBM 60% 이상 납품, SK하이닉스 추격",
      source: "디지털타임스",
      publishedAt: dateStr,
      reporter: "강동훈",
    },
    {
      id: "7",
      category: "경제",
      title: "가온그룹 28살 CEO 경영권 안정",
      summary: "창업주 작고 뒤 젊은 리더십으로 그룹 재정비 착수",
      source: "서울경제",
      publishedAt: dateStr,
      reporter: "윤서연",
    },
    {
      id: "8",
      category: "금융",
      title: "서학개미가 끌어올린 환율",
      summary: "금융당국 외환 관리 시험대, 1,470원 돌파",
      source: "머니투데이",
      publishedAt: dateStr,
      reporter: "한승우",
    },
    {
      id: "9",
      category: "경제",
      title: "한화, 美에 1.1조 투자 승부수",
      summary: "마스크 방산 드라이브 포석, 미국 시장 공략 본격화",
      source: "한국경제",
      publishedAt: dateStr,
      reporter: "김태현",
    },
    {
      id: "10",
      category: "부동산",
      title: "내년 봄 전세난 또 오나",
      summary: "서울 전세 매물 부족 심화, 전세가율 상승 우려",
      source: "조선일보",
      publishedAt: dateStr,
      reporter: "이미래",
    },
    {
      id: "11",
      category: "세계",
      title: "美-우크라 종전협의 진행",
      summary: "루비오 국무장관 '생산적이었지만 할 일 많아'",
      source: "중앙일보",
      publishedAt: dateStr,
      reporter: "박세준",
    },
    {
      id: "12",
      category: "정치",
      title: "여야 예산안 협상 난항",
      summary: "복지예산 증액 두고 이견, 법정처리 시한 임박",
      source: "KBS",
      publishedAt: dateStr,
      reporter: "김정은",
    },
    {
      id: "13",
      category: "사회",
      title: "수능 이후 수험생 이동 러시",
      summary: "여행·문화 소비 급증, 유통업계 특수 기대",
      source: "MBC",
      publishedAt: dateStr,
      reporter: "이수현",
    },
    {
      id: "14",
      category: "문화",
      title: "BTS 진 솔로 앨범 빌보드 1위",
      summary: "K-POP 솔로 아티스트 최초 기록 달성",
      source: "스포츠조선",
      publishedAt: dateStr,
      reporter: "최유리",
    },
    {
      id: "15",
      category: "과학",
      title: "국산 달 탐사선 다누리 1주년",
      summary: "성공적인 임무 수행, 추가 탐사 계획 발표 예정",
      source: "YTN사이언스",
      publishedAt: dateStr,
      reporter: "홍과학",
    },
  ]
}

const shouldUpdateNews = (now: Date): boolean => {
  const koreaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
  const currentHour = koreaTime.getHours()

  if (currentHour !== 21) {
    return false
  }

  if (!lastUpdateTime) {
    return true
  }

  const lastKoreaTime = new Date(lastUpdateTime.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))

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

  if (cachedNewsData.length === 0) {
    cachedNewsData = getMockNewsData()
    lastUpdateTime = now
  }

  if (!shouldUpdateNews(now)) {
    return NextResponse.json({
      success: true,
      data: cachedNewsData,
      timestamp: lastUpdateTime?.toISOString() || new Date().toISOString(),
      usedCache: true,
      nextUpdate: "매일 오후 9시 (KST)",
      message: "캐시된 뉴스입니다. 다음 업데이트: 매일 오후 9시",
    })
  }

  try {
    const newsData = getMockNewsData()
    cachedNewsData = newsData
    lastUpdateTime = now

    return NextResponse.json({
      success: true,
      data: newsData,
      timestamp: now.toISOString(),
      nextUpdate: "매일 오후 9시 (KST)",
      message: "뉴스 업데이트 완료 (오후 9시)",
    })
  } catch {
    return NextResponse.json({
      success: true,
      data: cachedNewsData,
      timestamp: lastUpdateTime?.toISOString() || new Date().toISOString(),
      usedCache: true,
      message: "이전 뉴스 데이터를 반환합니다",
    })
  }
}

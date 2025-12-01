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
      summary: "외국인 투자자들이 중소형주로 관심을 돌리며 코스피 상승세가 주춤하고 있다. 전문가들은 단기 조정 국면에 진입했으며, 미국 금리 동결 기대감이 반영되면 다시 상승 흐름을 탈 것으로 전망하고 있다.",
      source: "한국경제",
      publishedAt: dateStr,
      reporter: "김민수",
    },
    {
      id: "2",
      category: "부동산",
      title: "서울 아파트 계약 해제율 7.4%",
      summary: "2020년 이후 최대치를 기록하며 부동산 시장에 경고등이 켜졌다. 금리 인상 여파로 매수세가 크게 위축되었고, 특히 강남권 재건축 아파트를 중심으로 계약 해제가 급증하는 추세다.",
      source: "매일경제",
      publishedAt: dateStr,
      reporter: "이정희",
    },
    {
      id: "3",
      category: "생활",
      title: "전국 기온 '뚝' 6도 안팎 출근길",
      summary: "중부지방을 중심으로 아침 기온이 영하권까지 떨어지며 본격적인 겨울 추위가 시작됐다. 미세먼지도 '나쁨' 수준을 보여 마스크 착용이 권고되며, 당분간 쌀쌀한 날씨가 이어질 전망이다.",
      source: "연합뉴스",
      publishedAt: dateStr,
      reporter: "박지현",
    },
    {
      id: "4",
      category: "IT",
      title: "AI 시대 벌써 만 3년",
      summary: "2022년 11월 30일 챗GPT 출범 이후 산업 전반에 AI 도입이 가속화되고 있다. 국내 기업들도 AI 기반 서비스 개발에 박차를 가하며, 금융·의료·교육 분야에서 획기적인 변화가 일어나고 있다.",
      source: "전자신문",
      publishedAt: dateStr,
      reporter: "정수민",
    },
    {
      id: "5",
      category: "경제",
      title: "주가 상승에 웃은 운용업계",
      summary: "3분기 영업이익이 전년 대비 154.9% 증가하며 증시 호황의 수혜를 톡톡히 누렸다. 특히 ETF 운용사들의 실적이 두드러졌으며, 개인 투자자들의 적극적인 참여가 성장을 이끌었다는 분석이다.",
      source: "조선비즈",
      publishedAt: dateStr,
      reporter: "최영진",
    },
    {
      id: "6",
      category: "IT",
      title: "삼성, 역전 성공했다",
      summary: "구글용 HBM 납품 비중이 60%를 넘어서며 SK하이닉스를 맹추격하고 있다. 삼성전자는 차세대 HBM4 개발에도 속도를 내며 반도체 시장 주도권 탈환에 총력을 기울이고 있다.",
      source: "디지털타임스",
      publishedAt: dateStr,
      reporter: "강동훈",
    },
    {
      id: "7",
      category: "경제",
      title: "가온그룹 28살 CEO 경영권 안정",
      summary: "창업주 작고 이후 젊은 리더십으로 그룹 재정비에 착수했다. 이사회 과반 지지를 확보하며 경영권을 안정시켰고, 신사업 진출과 조직 쇄신을 통해 새로운 성장 동력을 확보할 계획이다.",
      source: "서울경제",
      publishedAt: dateStr,
      reporter: "윤서연",
    },
    {
      id: "8",
      category: "금융",
      title: "서학개미가 끌어올린 환율",
      summary: "미국 주식 투자 열풍으로 달러 수요가 급증하며 환율이 1,470원을 돌파했다. 금융당국은 외환시장 안정화 방안을 모색 중이며, 과도한 환율 변동성에 대한 시장 경고 메시지를 내놓고 있다.",
      source: "머니투데이",
      publishedAt: dateStr,
      reporter: "한승우",
    },
    {
      id: "9",
      category: "경제",
      title: "한화, 美에 1.1조 투자 승부수",
      summary: "마스크 방산 드라이브에 대응해 미국 시장 공략을 본격화하고 있다. 텍사스에 방산 생산시설을 확대하고 현지 기업 인수도 검토 중이며, 미국 정부 조달 시장 진출을 위한 교두보를 마련한다는 전략이다.",
      source: "한국경제",
      publishedAt: dateStr,
      reporter: "김태현",
    },
    {
      id: "10",
      category: "부동산",
      title: "내년 봄 전세난 또 오나",
      summary: "서울 전세 매물 부족이 심화되며 전세가율 상승 우려가 커지고 있다. 신규 입주 물량 감소와 전세대출 규제 완화가 맞물리며 수요가 급증했고, 전문가들은 내년 상반기 전세난 재현을 경고하고 있다.",
      source: "조선일보",
      publishedAt: dateStr,
      reporter: "이미래",
    },
    {
      id: "11",
      category: "세계",
      title: "美-우크라 종전협의 진행",
      summary: "루비오 국무장관은 '생산적이었지만 할 일이 많다'고 밝혔다. 러시아와의 직접 대화 가능성도 열어두며 외교적 해결을 모색 중이나, 양측 입장 차이가 커 협상 타결까지는 시간이 걸릴 전망이다.",
      source: "중앙일보",
      publishedAt: dateStr,
      reporter: "박세준",
    },
    {
      id: "12",
      category: "정치",
      title: "여야 예산안 협상 난항",
      summary: "복지예산 증액을 두고 여야 이견이 좁혀지지 않으며 법정처리 시한이 임박했다. 여당은 재정건전성을, 야당은 취약계층 지원 확대를 주장하며 막판 줄다리기가 이어지고 있다.",
      source: "KBS",
      publishedAt: dateStr,
      reporter: "김정은",
    },
    {
      id: "13",
      category: "사회",
      title: "수능 이후 수험생 이동 러시",
      summary: "대학수학능력시험이 끝나며 여행과 문화 소비가 급증하고 있다. 유통업계는 특수를 기대하며 수험생 할인 이벤트를 진행 중이고, 항공사와 여행사도 수험생 맞춤 상품을 출시하며 마케팅에 나섰다.",
      source: "MBC",
      publishedAt: dateStr,
      reporter: "이수현",
    },
    {
      id: "14",
      category: "문화",
      title: "BTS 진 솔로 앨범 빌보드 1위",
      summary: "K-POP 솔로 아티스트 최초로 빌보드 앨범 차트 정상에 올랐다. 전 세계 팬들의 뜨거운 반응 속에 음반 판매량 100만 장을 돌파했으며, 글로벌 투어 일정도 순차적으로 공개될 예정이다.",
      source: "스포츠조선",
      publishedAt: dateStr,
      reporter: "최유리",
    },
    {
      id: "15",
      category: "과학",
      title: "국산 달 탐사선 다누리 1주년",
      summary: "대한민국 최초의 달 궤도선이 성공적인 임무 수행 1주년을 맞이했다. 고해상도 달 표면 영상과 과학 데이터를 지속적으로 전송 중이며, 한국항공우주연구원은 추가 탐사 계획 발표를 앞두고 있다.",
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

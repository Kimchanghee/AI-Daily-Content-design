// 템플릿 관련 타입 정의
export interface NewsItem {
  id: string
  category: string
  title: string
  summary: string // 뉴스 요약 필드 추가
  source: string
  publishedAt: string
  reporter: string
}

export interface UserInfo {
  name: string
  phone: string
  profileImage: HTMLImageElement | null
}

export interface TemplateConfig {
  id: string
  name: string
  description: string
  previewBg: string // 미리보기 배경 추가
  accentColor: string // 강조 색상 추가
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: "city-night",
    name: "시티 나이트",
    description: "도시 야경과 함께하는 프로페셔널 스타일",
    previewBg: "linear-gradient(180deg, #2d3561 0%, #0f1525 100%)",
    accentColor: "#fff",
  },
  {
    id: "luxury-gold",
    name: "럭셔리 골드",
    description: "격조 높은 골드 테마로 신뢰감 전달",
    previewBg: "linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%)",
    accentColor: "#d4af37",
  },
  {
    id: "ocean-blue",
    name: "오션 블루",
    description: "청량한 블루로 신선한 아침을 전달",
    previewBg: "linear-gradient(180deg, #87ceeb 0%, #0a3d62 100%)",
    accentColor: "#fff",
  },
  {
    id: "forest-green",
    name: "포레스트 그린",
    description: "자연 친화적 미니멀 디자인",
    previewBg: "linear-gradient(180deg, #a8e6cf 0%, #1b4332 100%)",
    accentColor: "#fff",
  },
  {
    id: "sunset-warm",
    name: "선셋 웜",
    description: "따뜻한 노을빛으로 친근함 전달",
    previewBg: "linear-gradient(135deg, #ffecd2 0%, #bf360c 100%)",
    accentColor: "#fff",
  },
]

// 요일별 토픽 설정
export const DAY_TOPICS: Record<number, { topic: string; url: string }> = {
  1: { topic: "정치", url: "https://news.naver.com/section/100" },
  2: { topic: "경제", url: "https://news.naver.com/section/101" },
  3: { topic: "사회", url: "https://news.naver.com/section/102" },
  4: { topic: "생활/문화", url: "https://news.naver.com/section/103" },
  5: { topic: "IT/과학", url: "https://news.naver.com/section/105" },
  0: { topic: "세계", url: "https://news.naver.com/section/104" },
  6: { topic: "세계", url: "https://news.naver.com/section/104" },
}

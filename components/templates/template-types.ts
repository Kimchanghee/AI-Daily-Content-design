// 템플릿 관련 타입 정의
export interface NewsItem {
  id: string
  category: string
  title: string
  summary: string
  source: string
  publishedAt: string
  reporter: string
}

export interface UserInfo {
  name: string
  phone: string
  brandPhrase?: string
  profileImage: HTMLImageElement | null
}

export interface TemplateConfig {
  id: string
  name: string
  description: string
  previewBg: string
  accentColor: string
}

// 10개의 새로운 템플릿
export const TEMPLATES: TemplateConfig[] = [
  {
    id: "soft-blue",
    name: "소프트 블루",
    description: "부드러운 블루 뉴스레터",
    previewBg: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    accentColor: "#1e40af",
  },
  {
    id: "elegant-school",
    name: "엘레강스 스쿨",
    description: "우아한 학교 뉴스",
    previewBg: "linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)",
    accentColor: "#1e40af",
  },
  {
    id: "pastel-vintage",
    name: "파스텔 빈티지",
    description: "부드러운 파스텔 핑크",
    previewBg: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
    accentColor: "#be185d",
  },
  {
    id: "cream-modern",
    name: "크림 모던",
    description: "따뜻한 크림 톤",
    previewBg: "linear-gradient(135deg, #fefcf3 0%, #f5f1e8 100%)",
    accentColor: "#8b4513",
  },
  {
    id: "sage-green",
    name: "세이지 그린",
    description: "평온한 세이지 그린",
    previewBg: "linear-gradient(135deg, #f0f4f0 0%, #e8f5e8 100%)",
    accentColor: "#2d5a32",
  },
  {
    id: "elegant-beige",
    name: "엘레강스 베이지",
    description: "우아한 베이지 톤",
    previewBg: "linear-gradient(135deg, #faf7f2 0%, #f4f1ea 100%)",
    accentColor: "#654321",
  },
  {
    id: "soft-lavender",
    name: "소프트 라벤더",
    description: "부드러운 라벤더",
    previewBg: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
    accentColor: "#7c3aed",
  },
  {
    id: "classic-mono",
    name: "클래식 모노",
    description: "클래식 화이트 그레이",
    previewBg: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    accentColor: "#1f2937",
  },
  {
    id: "warm-peach",
    name: "웜 피치",
    description: "따뜻한 피치 톤",
    previewBg: "linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)",
    accentColor: "#ea580c",
  },
  {
    id: "mint-green",
    name: "민트 그린",
    description: "자연스러운 민트 그린",
    previewBg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    accentColor: "#16a34a",
  },
]

// 요일별 토픽 설정
export const DAY_TOPICS: Record<number, { topic: string; url: string }> = {
  1: { topic: "IT/과학", url: "https://news.naver.com/section/105" },
  2: { topic: "경제", url: "https://news.naver.com/section/101" },
  3: { topic: "사회", url: "https://news.naver.com/section/102" },
  4: { topic: "생활/문화", url: "https://news.naver.com/section/103" },
  5: { topic: "연예/스포츠", url: "https://entertain.naver.com/home" },
  0: { topic: "세계", url: "https://news.naver.com/section/104" },
  6: { topic: "세계", url: "https://news.naver.com/section/104" },
}

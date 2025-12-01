export interface NewsItem {
  id: string
  category: string
  title: string
  summary: string
  source: string
  timestamp: string
  url?: string
}

export interface UserInfo {
  name: string
  title: string // 직책 추가
  company: string
  phone: string
  instagram?: string
  profileImage?: string
}

export interface WeatherInfo {
  seoul: number
  busan: number
}

export interface StockInfo {
  kospi: { value: string; change: string; isUp: boolean }
  kosdaq: { value: string; change: string; isUp: boolean }
  exchange: { value: string; change: string; isUp: boolean }
}

export interface TemplateData {
  userInfo: UserInfo
  news: NewsItem[]
  weather: WeatherInfo
  stocks: StockInfo
  date: string
  timestamp: Date
}

export function formatNewsForTemplate(newsData: NewsItem[], maxItems = 11, randomize = true): NewsItem[] {
  let selectedNews = [...newsData]

  if (randomize && newsData.length > maxItems) {
    selectedNews = []
    const usedIndexes = new Set<number>()
    const categories = [...new Set(newsData.map((n) => n.category))]

    categories.forEach((category) => {
      const categoryNews = newsData.filter((n) => n.category === category)
      if (categoryNews.length > 0) {
        const randomIndex = Math.floor(Math.random() * categoryNews.length)
        selectedNews.push(categoryNews[randomIndex])
      }
    })

    while (selectedNews.length < maxItems && selectedNews.length < newsData.length) {
      const randomIndex = Math.floor(Math.random() * newsData.length)
      if (!usedIndexes.has(randomIndex)) {
        usedIndexes.add(randomIndex)
        selectedNews.push(newsData[randomIndex])
      }
    }
  } else {
    selectedNews = newsData.slice(0, maxItems)
  }

  return selectedNews
}

export function shortenTitle(title: string, maxLength = 40): string {
  if (title.length <= maxLength) return title
  return title.substring(0, maxLength - 3) + "..."
}

export function getWeatherInfo(): WeatherInfo {
  return {
    seoul: Math.floor(Math.random() * 15) - 5,
    busan: Math.floor(Math.random() * 15) + 5,
  }
}

export function getStockInfo(): StockInfo {
  const generateStock = (base: number) => {
    const value = (base + (Math.random() - 0.5) * 100).toFixed(2)
    const change = ((Math.random() - 0.5) * 100).toFixed(2)
    return {
      value: value.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      change: Math.abs(Number.parseFloat(change)).toFixed(2),
      isUp: Number.parseFloat(change) > 0,
    }
  }

  return {
    kospi: generateStock(3900),
    kosdaq: generateStock(900),
    exchange: generateStock(1470),
  }
}

export function generateTemplateData(
  userInfo: UserInfo,
  newsData: NewsItem[],
  options: { maxNewsItems?: number; randomizeNews?: boolean } = {},
): TemplateData {
  const { maxNewsItems = 11, randomizeNews = true } = options

  return {
    userInfo,
    news: formatNewsForTemplate(newsData, maxNewsItems, randomizeNews),
    weather: getWeatherInfo(),
    stocks: getStockInfo(),
    date: new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      weekday: "short",
    }),
    timestamp: new Date(),
  }
}

export const templateStyles = {
  // 블루/퍼플 그라데이션 - 도시 야경
  city: {
    id: "city" as const,
    name: "시티 나이트",
    description: "도시 야경 배경의 세련된 템플릿",
    gradient: ["#2a3f5f", "#4a5568", "#6b7280"],
    headerBg: "rgba(42, 63, 95, 0.9)",
    cardBg: "rgba(255, 255, 255, 0.95)",
    textColor: "#1a1a1a",
    headerTextColor: "#ffffff",
    accentColors: ["#e53e3e", "#dd6b20", "#1a1a1a"], // 빨강, 주황, 검정
    stockBoxBg: "rgba(255, 255, 255, 0.9)",
  },
  // 골드/베이지 - 고급스러운
  luxury: {
    id: "luxury" as const,
    name: "럭셔리 골드",
    description: "고급스러운 골드 톤 템플릿",
    gradient: ["#1a1a2e", "#16213e", "#0f3460"],
    headerBg: "rgba(26, 26, 46, 0.95)",
    cardBg: "rgba(255, 250, 240, 0.95)",
    textColor: "#1a1a1a",
    headerTextColor: "#d4af37",
    accentColors: ["#d4af37", "#b8860b", "#1a1a1a"],
    stockBoxBg: "rgba(255, 250, 240, 0.9)",
  },
  // 그린/민트 - 상쾌한
  fresh: {
    id: "fresh" as const,
    name: "프레시 민트",
    description: "상쾌한 민트 컬러 템플릿",
    gradient: ["#134e5e", "#2c3e50", "#1a1a2e"],
    headerBg: "rgba(19, 78, 94, 0.9)",
    cardBg: "rgba(255, 255, 255, 0.95)",
    textColor: "#1a1a1a",
    headerTextColor: "#ffffff",
    accentColors: ["#10b981", "#059669", "#1a1a1a"],
    stockBoxBg: "rgba(255, 255, 255, 0.9)",
  },
}

export type TemplateStyleId = keyof typeof templateStyles

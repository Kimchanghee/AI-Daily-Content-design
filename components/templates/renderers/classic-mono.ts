import type { NewsItem, UserInfo } from "../template-types"
import { getDateString, drawProfile, drawNewsItem } from "./common"

// 템플릿 8: 클래식 모노 - 클래식 화이트 그레이 스타일
export const renderClassicMono = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo
) => {
  // 흰색 배경
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, width, height)

  // 상단 프로필 카드
  ctx.fillStyle = "#f9fafb"
  ctx.beginPath()
  ctx.roundRect(20, 20, width - 40, 90, 12)
  ctx.fill()
  ctx.strokeStyle = "#e5e7eb"
  ctx.lineWidth = 1
  ctx.stroke()

  // 프로필 이미지
  drawProfile(ctx, 60, 65, 28, user.profileImage, "#9ca3af")

  // 이름과 전화번호
  ctx.fillStyle = "#1f2937"
  ctx.font = "bold 18px 'Noto Sans KR', sans-serif"
  ctx.fillText(user.name, 100, 58)

  ctx.fillStyle = "#6b7280"
  ctx.font = "13px sans-serif"
  ctx.fillText(user.phone, 100, 78)

  // 브랜드 문장
  if (user.brandPhrase) {
    ctx.fillStyle = "#4b5563"
    ctx.font = "10px sans-serif"
    ctx.fillText(user.brandPhrase, 100, 95)
  }

  // 날짜
  ctx.textAlign = "right"
  ctx.fillStyle = "#6b7280"
  ctx.font = "12px sans-serif"
  ctx.fillText(getDateString(), width - 35, 65)
  ctx.textAlign = "left"

  // 날씨 영역
  ctx.fillStyle = "#f9fafb"
  ctx.beginPath()
  ctx.roundRect(20, 125, width - 40, 45, 8)
  ctx.fill()
  ctx.strokeStyle = "#e5e7eb"
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.textAlign = "center"
  ctx.fillStyle = "#374151"
  ctx.font = "bold 14px sans-serif"
  ctx.fillText("Weather: 5°C  ☀️", width / 2, 153)
  ctx.textAlign = "left"

  // 뉴스 섹션 제목
  ctx.fillStyle = "#111827"
  ctx.font = "bold 20px 'Noto Sans KR', sans-serif"
  ctx.fillText("Today's News", 30, 210)

  // 구분선
  ctx.strokeStyle = "#d1d5db"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(30, 222)
  ctx.lineTo(165, 222)
  ctx.stroke()

  // 뉴스 콘텐츠 영역
  ctx.fillStyle = "#f9fafb"
  ctx.beginPath()
  ctx.roundRect(20, 240, width - 40, height - 350, 8)
  ctx.fill()
  ctx.strokeStyle = "#9ca3af"
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(20, 240)
  ctx.lineTo(20, height - 110)
  ctx.stroke()

  // 뉴스 아이템
  let y = 268
  const maxNewsY = height - 130
  const colors = { title: "#1f2937", meta: "#6b7280", summary: "#4b5563", highlight: "#dc2626" }
  news.slice(0, 10).forEach((item, i) => {
    if (y + 50 > maxNewsY) return
    const lineH = drawNewsItem(ctx, item, 40, y, width - 80, colors, i < 2)
    y += lineH + 5
  })

  // 주식 정보 카드들
  const stockY = height - 95
  const stockW = (width - 60) / 3
  const stocks = [
    { label: "KOSPI", value: "3,926.59", change: "60.32", up: false },
    { label: "KOSDAQ", value: "912.67", change: "32.61", up: true },
    { label: "USD/KRW", value: "1,470.20", change: "7.20", up: true },
  ]

  stocks.forEach((s, i) => {
    const bx = 20 + i * (stockW + 10)
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.roundRect(bx, stockY, stockW, 75, 6)
    ctx.fill()
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.textAlign = "center"
    ctx.fillStyle = "#374151"
    ctx.font = "bold 11px sans-serif"
    ctx.fillText(s.label, bx + stockW / 2, stockY + 20)
    ctx.font = "bold 14px sans-serif"
    ctx.fillText(s.value, bx + stockW / 2, stockY + 42)
    ctx.fillStyle = s.up ? "#dc2626" : "#2563eb"
    ctx.font = "10px sans-serif"
    ctx.fillText((s.up ? "▲ " : "▼ ") + s.change, bx + stockW / 2, stockY + 60)
  })
  ctx.textAlign = "left"
}

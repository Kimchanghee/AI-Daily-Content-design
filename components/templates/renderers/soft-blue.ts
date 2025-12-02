import type { NewsItem, UserInfo } from "../template-types"
import { getDateString, drawProfile, drawNewsItem, drawStockInfo } from "./common"

// 템플릿 1: 소프트 블루 - 부드러운 블루 뉴스레터 스타일
export const renderSoftBlue = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo
) => {
  // 배경 그라데이션
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, "#f8fafc")
  bgGrad.addColorStop(1, "#e2e8f0")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 상단 프로필 카드
  ctx.fillStyle = "rgba(255,255,255,0.95)"
  ctx.beginPath()
  ctx.roundRect(20, 20, width - 40, 85, 16)
  ctx.fill()
  ctx.shadowColor = "rgba(0,0,0,0.08)"
  ctx.shadowBlur = 10
  ctx.shadowOffsetY = 5

  // 프로필 이미지
  drawProfile(ctx, 60, 62, 28, user.profileImage, "#3b82f6")

  // 이름과 전화번호
  ctx.shadowColor = "transparent"
  ctx.fillStyle = "#1e40af"
  ctx.font = "bold 18px 'Noto Sans KR', sans-serif"
  ctx.fillText(user.name, 100, 55)

  ctx.fillStyle = "#64748b"
  ctx.font = "13px sans-serif"
  ctx.fillText(user.phone, 100, 75)

  // 브랜드 문장
  if (user.brandPhrase) {
    ctx.fillStyle = "#3b82f6"
    ctx.font = "10px sans-serif"
    ctx.fillText(user.brandPhrase, 100, 92)
  }

  // 날짜
  ctx.textAlign = "right"
  ctx.fillStyle = "#64748b"
  ctx.font = "12px sans-serif"
  ctx.fillText(getDateString(), width - 35, 62)
  ctx.textAlign = "left"

  // 날씨 영역
  ctx.fillStyle = "rgba(59, 130, 246, 0.1)"
  ctx.beginPath()
  ctx.roundRect(20, 120, width - 40, 45, 12)
  ctx.fill()
  ctx.strokeStyle = "rgba(59, 130, 246, 0.2)"
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.textAlign = "center"
  ctx.fillStyle = "#1e40af"
  ctx.font = "bold 14px sans-serif"
  ctx.fillText("Weather: 5°C  ☀️  맑음", width / 2, 148)
  ctx.textAlign = "left"

  // 뉴스 섹션
  ctx.fillStyle = "rgba(255,255,255,0.95)"
  ctx.beginPath()
  ctx.roundRect(20, 180, width - 40, height - 290, 16)
  ctx.fill()

  // 섹션 제목
  ctx.fillStyle = "#1e293b"
  ctx.font = "bold 20px 'Noto Sans KR', sans-serif"
  ctx.fillText("Today's News", 45, 218)

  // 구분선
  ctx.strokeStyle = "#3b82f6"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(45, 230)
  ctx.lineTo(180, 230)
  ctx.stroke()

  // 뉴스 아이템
  let y = 255
  const maxNewsY = height - 130
  const colors = { title: "#1e293b", meta: "#64748b", summary: "#475569", highlight: "#dc2626" }
  news.slice(0, 10).forEach((item, i) => {
    if (y + 50 > maxNewsY) return
    const lineH = drawNewsItem(ctx, item, 45, y, width - 90, colors, i < 2)
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
    ctx.fillStyle = "rgba(255,255,255,0.95)"
    ctx.beginPath()
    ctx.roundRect(bx, stockY, stockW, 75, 10)
    ctx.fill()
    ctx.shadowColor = "rgba(0,0,0,0.04)"
    ctx.shadowBlur = 4
    ctx.shadowOffsetY = 2

    ctx.shadowColor = "transparent"
    ctx.textAlign = "center"
    ctx.fillStyle = "#374151"
    ctx.font = "bold 12px sans-serif"
    ctx.fillText(s.label, bx + stockW / 2, stockY + 22)
    ctx.font = "bold 16px sans-serif"
    ctx.fillText(s.value, bx + stockW / 2, stockY + 44)
    ctx.fillStyle = s.up ? "#dc2626" : "#2563eb"
    ctx.font = "11px sans-serif"
    ctx.fillText((s.up ? "▲ " : "▼ ") + s.change, bx + stockW / 2, stockY + 62)
  })
  ctx.textAlign = "left"
}

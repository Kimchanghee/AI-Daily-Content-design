import type { NewsItem, UserInfo } from "../template-types.js"
import { getDateString, drawProfile, drawNewsItem } from "./common.js"

// 템플릿 2: 엘레강스 스쿨 - 우아한 학교 뉴스 스타일
export const renderElegantSchool = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo
) => {
  // 배경 그라데이션
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, "#f8faff")
  bgGrad.addColorStop(1, "#eef2ff")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 상단 장식선
  ctx.strokeStyle = "#3b82f6"
  ctx.lineWidth = 2
  const lineGrad = ctx.createLinearGradient(width / 2 - 40, 0, width / 2 + 40, 0)
  lineGrad.addColorStop(0, "#3b82f6")
  lineGrad.addColorStop(1, "#1d4ed8")
  ctx.strokeStyle = lineGrad
  ctx.beginPath()
  ctx.moveTo(width / 2 - 40, 15)
  ctx.lineTo(width / 2 + 40, 15)
  ctx.stroke()

  // 프로필 카드
  ctx.fillStyle = "rgba(255,255,255,0.95)"
  ctx.beginPath()
  ctx.roundRect(20, 25, width - 40, 90, 18)
  ctx.fill()
  ctx.strokeStyle = "rgba(147, 197, 253, 0.3)"
  ctx.lineWidth = 1
  ctx.stroke()

  // 프로필 이미지
  drawProfile(ctx, 60, 70, 28, user.profileImage, "#3b82f6")

  // 이름과 전화번호
  ctx.fillStyle = "#1e40af"
  ctx.font = "400 20px 'Georgia', serif"
  ctx.fillText(user.name, 100, 62)

  ctx.fillStyle = "#6b7280"
  ctx.font = "italic 13px 'Georgia', serif"
  ctx.fillText(user.phone, 100, 82)

  // 브랜드 문장
  if (user.brandPhrase) {
    ctx.fillStyle = "#3b82f6"
    ctx.font = "10px sans-serif"
    ctx.fillText(user.brandPhrase, 100, 100)
  }

  // 날짜
  ctx.textAlign = "right"
  ctx.fillStyle = "#6b7280"
  ctx.font = "italic 12px 'Georgia', serif"
  ctx.fillText(getDateString(), width - 35, 70)
  ctx.textAlign = "left"

  // 날씨 영역
  ctx.fillStyle = "rgba(147, 197, 253, 0.15)"
  ctx.beginPath()
  ctx.roundRect(20, 130, width - 40, 48, 14)
  ctx.fill()
  ctx.strokeStyle = "rgba(147, 197, 253, 0.25)"
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.textAlign = "center"
  ctx.fillStyle = "#1e40af"
  ctx.font = "bold 15px 'Noto Sans KR', sans-serif"
  ctx.fillText("Weather: 5°C  ☀️", width / 2, 160)
  ctx.textAlign = "left"

  // 뉴스 섹션 제목
  ctx.textAlign = "center"
  ctx.fillStyle = "#1e3a8a"
  ctx.font = "500 22px 'Georgia', serif"
  ctx.fillText("Today's News", width / 2, 215)

  // 제목 아래 장식선
  ctx.strokeStyle = "#3b82f6"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(width / 2 - 25, 225)
  ctx.lineTo(width / 2 + 25, 225)
  ctx.stroke()
  ctx.textAlign = "left"

  // 뉴스 콘텐츠 카드
  ctx.fillStyle = "rgba(255,255,255,0.7)"
  ctx.beginPath()
  ctx.roundRect(20, 240, width - 40, height - 345, 12)
  ctx.fill()
  ctx.strokeStyle = "#3b82f6"
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(20, 240)
  ctx.lineTo(20, height - 105)
  ctx.stroke()

  // 뉴스 아이템
  let y = 265
  const maxNewsY = height - 125
  const colors = { title: "#1e293b", meta: "#64748b", summary: "#4b5563", highlight: "#dc2626" }
  news.slice(0, 10).forEach((item, i) => {
    if (y + 50 > maxNewsY) return
    const lineH = drawNewsItem(ctx, item, 40, y, width - 80, colors, i < 2)
    y += lineH + 5
  })

  // 주식 정보 카드들
  const stockY = height - 90
  const stockW = (width - 60) / 3
  const stocks = [
    { label: "KOSPI", value: "3,926.59", change: "60.32", up: false },
    { label: "KOSDAQ", value: "912.67", change: "32.61", up: true },
    { label: "USD/KRW", value: "1,470.20", change: "7.20", up: true },
  ]

  stocks.forEach((s, i) => {
    const bx = 20 + i * (stockW + 10)
    ctx.fillStyle = "rgba(255,255,255,0.8)"
    ctx.beginPath()
    ctx.roundRect(bx, stockY, stockW, 70, 10)
    ctx.fill()
    ctx.strokeStyle = "rgba(147, 197, 253, 0.2)"
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.textAlign = "center"
    ctx.fillStyle = "#1e40af"
    ctx.font = "bold 11px sans-serif"
    ctx.fillText(s.label, bx + stockW / 2, stockY + 20)
    ctx.font = "bold 14px sans-serif"
    ctx.fillText(s.value, bx + stockW / 2, stockY + 40)
    ctx.fillStyle = s.up ? "#dc2626" : "#1d4ed8"
    ctx.font = "10px sans-serif"
    ctx.fillText((s.up ? "▲ " : "▼ ") + s.change, bx + stockW / 2, stockY + 56)
  })
  ctx.textAlign = "left"
}

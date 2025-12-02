import type { NewsItem, UserInfo } from "../template-types"
import { getDateString, drawProfile, drawNewsItem } from "./common"

// 템플릿 10: 민트 그린 - 자연스러운 민트 그린 스타일
export const renderMintGreen = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo
) => {
  // 배경 그라데이션
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, "#f0fdf4")
  bgGrad.addColorStop(1, "#dcfce7")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 프로필 카드
  ctx.fillStyle = "rgba(255,255,255,0.9)"
  ctx.beginPath()
  ctx.roundRect(20, 20, width - 40, 95, 20)
  ctx.fill()
  ctx.strokeStyle = "rgba(134, 239, 172, 0.3)"
  ctx.lineWidth = 2
  ctx.stroke()

  // 프로필 이미지
  drawProfile(ctx, 65, 67, 30, user.profileImage, "#22c55e")

  // 이름과 전화번호
  ctx.fillStyle = "#16a34a"
  ctx.font = "bold 20px 'Noto Sans KR', sans-serif"
  ctx.fillText(user.name, 110, 60)

  ctx.fillStyle = "#22c55e"
  ctx.font = "13px sans-serif"
  ctx.fillText(user.phone, 110, 80)

  // 브랜드 문장
  if (user.brandPhrase) {
    ctx.fillStyle = "#16a34a"
    ctx.font = "10px sans-serif"
    ctx.fillText(user.brandPhrase, 110, 100)
  }

  // 날짜
  ctx.textAlign = "right"
  ctx.fillStyle = "#22c55e"
  ctx.font = "12px sans-serif"
  ctx.fillText(getDateString(), width - 35, 67)
  ctx.textAlign = "left"

  // 날씨 영역
  ctx.fillStyle = "rgba(134, 239, 172, 0.2)"
  ctx.beginPath()
  ctx.roundRect(20, 130, width - 40, 50, 16)
  ctx.fill()
  ctx.strokeStyle = "rgba(134, 239, 172, 0.4)"
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.textAlign = "center"
  ctx.fillStyle = "#16a34a"
  ctx.font = "bold 16px 'Noto Sans KR', sans-serif"
  ctx.fillText("Weather: 5°C  ☀️", width / 2, 161)
  ctx.textAlign = "left"

  // 뉴스 섹션 제목 (나뭇잎 이모지 장식)
  ctx.textAlign = "center"
  ctx.fillStyle = "#15803d"
  ctx.font = "bold 24px 'Noto Sans KR', sans-serif"
  ctx.fillText("Today's News", width / 2, 220)

  // 나뭇잎 장식
  ctx.font = "20px sans-serif"
  ctx.fillText("🌿", width / 2 - 110, 220)
  ctx.fillText("🌿", width / 2 + 95, 220)
  ctx.textAlign = "left"

  // 뉴스 콘텐츠 카드
  ctx.fillStyle = "rgba(255,255,255,0.8)"
  ctx.beginPath()
  ctx.roundRect(20, 245, width - 40, height - 355, 15)
  ctx.fill()
  ctx.strokeStyle = "rgba(134, 239, 172, 0.3)"
  ctx.lineWidth = 1
  ctx.stroke()

  // 뉴스 아이템
  let y = 275
  const maxNewsY = height - 130
  const colors = { title: "#15803d", meta: "#22c55e", summary: "#15803d", highlight: "#dc2626" }
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
    ctx.fillStyle = "rgba(255,255,255,0.9)"
    ctx.beginPath()
    ctx.roundRect(bx, stockY, stockW, 75, 12)
    ctx.fill()
    ctx.strokeStyle = "#22c55e"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(bx, stockY)
    ctx.lineTo(bx, stockY + 75)
    ctx.stroke()

    ctx.textAlign = "center"
    ctx.fillStyle = "#16a34a"
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

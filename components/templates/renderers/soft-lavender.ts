import type { NewsItem, UserInfo } from "../template-types.js"
import { getDateString, drawProfile, drawNewsItem } from "./common.js"

// 템플릿 7: 소프트 라벤더 - 부드러운 라벤더 스타일
export const renderSoftLavender = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo
) => {
  // 배경 그라데이션
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, "#faf5ff")
  bgGrad.addColorStop(1, "#f3e8ff")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 프로필 카드
  ctx.fillStyle = "rgba(255,255,255,0.9)"
  ctx.beginPath()
  ctx.roundRect(20, 20, width - 40, 100, 24)
  ctx.fill()
  ctx.strokeStyle = "rgba(196, 181, 253, 0.3)"
  ctx.lineWidth = 2
  ctx.stroke()

  // 프로필 이미지
  drawProfile(ctx, 70, 70, 34, user.profileImage, "#c4b5fd")

  // 이름과 전화번호
  ctx.fillStyle = "#7c3aed"
  ctx.font = "300 24px 'Noto Sans KR', sans-serif"
  ctx.fillText(user.name, 120, 62)

  ctx.fillStyle = "#8b5cf6"
  ctx.font = "14px sans-serif"
  ctx.fillText(user.phone, 120, 84)

  // 브랜드 문장
  if (user.brandPhrase) {
    ctx.fillStyle = "#7c3aed"
    ctx.font = "11px sans-serif"
    ctx.fillText(user.brandPhrase, 120, 105)
  }

  // 날짜
  ctx.textAlign = "right"
  ctx.fillStyle = "#8b5cf6"
  ctx.font = "13px sans-serif"
  ctx.fillText(getDateString(), width - 35, 70)
  ctx.textAlign = "left"

  // 날씨 영역
  ctx.fillStyle = "rgba(196, 181, 253, 0.2)"
  ctx.beginPath()
  ctx.roundRect(20, 135, width - 40, 55, 20)
  ctx.fill()
  ctx.strokeStyle = "rgba(196, 181, 253, 0.4)"
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.textAlign = "center"
  ctx.fillStyle = "#7c3aed"
  ctx.font = "bold 18px 'Noto Sans KR', sans-serif"
  ctx.fillText("Weather: 5°C  ☀️", width / 2, 170)
  ctx.textAlign = "left"

  // 뉴스 섹션 제목
  ctx.textAlign = "center"
  ctx.fillStyle = "#6d28d9"
  ctx.font = "300 28px 'Noto Sans KR', sans-serif"
  ctx.fillText("Today's News", width / 2, 235)

  // 좌우 장식선
  ctx.strokeStyle = "rgba(196, 181, 253, 0.5)"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(width / 2 - 130, 235)
  ctx.lineTo(width / 2 - 90, 235)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(width / 2 + 90, 235)
  ctx.lineTo(width / 2 + 130, 235)
  ctx.stroke()
  ctx.textAlign = "left"

  // 뉴스 콘텐츠 카드
  ctx.fillStyle = "rgba(255,255,255,0.8)"
  ctx.beginPath()
  ctx.roundRect(20, 260, width - 40, height - 375, 18)
  ctx.fill()
  ctx.strokeStyle = "rgba(196, 181, 253, 0.3)"
  ctx.lineWidth = 1
  ctx.stroke()

  // 뉴스 아이템
  let y = 290
  const maxNewsY = height - 130
  const colors = { title: "#6d28d9", meta: "#8b5cf6", summary: "#6d28d9", highlight: "#dc2626" }
  news.slice(0, 10).forEach((item, i) => {
    if (y + 50 > maxNewsY) return
    const lineH = drawNewsItem(ctx, item, 40, y, width - 80, colors, i < 2)
    y += lineH + 5
  })

  // 주식 정보 카드들
  const stockY = height - 100
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
    ctx.roundRect(bx, stockY, stockW, 80, 16)
    ctx.fill()
    ctx.strokeStyle = "rgba(196, 181, 253, 0.3)"
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.textAlign = "center"
    ctx.fillStyle = "#7c3aed"
    ctx.font = "bold 12px sans-serif"
    ctx.fillText(s.label, bx + stockW / 2, stockY + 24)
    ctx.font = "bold 15px sans-serif"
    ctx.fillText(s.value, bx + stockW / 2, stockY + 48)
    ctx.fillStyle = s.up ? "#dc2626" : "#2563eb"
    ctx.font = "11px sans-serif"
    ctx.fillText((s.up ? "▲ " : "▼ ") + s.change, bx + stockW / 2, stockY + 66)
  })
  ctx.textAlign = "left"
}

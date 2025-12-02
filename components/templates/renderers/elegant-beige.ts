import type { NewsItem, UserInfo } from "../template-types.js"
import { getDateString, drawProfile, drawNewsItem } from "./common.js"

// 템플릿 6: 엘레강스 베이지 - 우아한 베이지 톤 스타일
export const renderElegantBeige = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo
) => {
  // 배경 그라데이션
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, "#faf7f2")
  bgGrad.addColorStop(1, "#f4f1ea")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 프로필 카드
  ctx.fillStyle = "rgba(255,255,255,0.9)"
  ctx.beginPath()
  ctx.roundRect(20, 20, width - 40, 100, 22)
  ctx.fill()
  ctx.strokeStyle = "rgba(196, 181, 164, 0.3)"
  ctx.lineWidth = 1
  ctx.stroke()

  // 프로필 이미지
  drawProfile(ctx, 68, 70, 32, user.profileImage, "#c4b5a4")

  // 이름과 전화번호
  ctx.fillStyle = "#654321"
  ctx.font = "400 22px 'Georgia', serif"
  ctx.fillText(user.name, 115, 62)

  ctx.fillStyle = "#8b6f47"
  ctx.font = "italic 14px 'Georgia', serif"
  ctx.fillText(user.phone, 115, 82)

  // 브랜드 문장
  if (user.brandPhrase) {
    ctx.fillStyle = "#654321"
    ctx.font = "11px sans-serif"
    ctx.fillText(user.brandPhrase, 115, 102)
  }

  // 날짜
  ctx.textAlign = "right"
  ctx.fillStyle = "#8b6f47"
  ctx.font = "italic 12px 'Georgia', serif"
  ctx.fillText(getDateString(), width - 35, 70)
  ctx.textAlign = "left"

  // 날씨 영역
  ctx.fillStyle = "rgba(196, 181, 164, 0.2)"
  ctx.beginPath()
  ctx.roundRect(20, 135, width - 40, 52, 18)
  ctx.fill()
  ctx.strokeStyle = "rgba(196, 181, 164, 0.3)"
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.textAlign = "center"
  ctx.fillStyle = "#654321"
  ctx.font = "bold 17px 'Noto Sans KR', sans-serif"
  ctx.fillText("Weather: 5°C  ☀️", width / 2, 168)
  ctx.textAlign = "left"

  // 뉴스 섹션 제목
  ctx.textAlign = "center"
  ctx.fillStyle = "#5d4e37"
  ctx.font = "400 26px 'Georgia', serif"
  ctx.fillText("Today's News", width / 2, 230)

  // 장식선
  const lineGrad = ctx.createLinearGradient(width / 2 - 35, 0, width / 2 + 35, 0)
  lineGrad.addColorStop(0, "#c4b5a4")
  lineGrad.addColorStop(1, "#8b6f47")
  ctx.strokeStyle = lineGrad
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(width / 2 - 35, 242)
  ctx.lineTo(width / 2 + 35, 242)
  ctx.stroke()
  ctx.textAlign = "left"

  // 뉴스 콘텐츠 카드
  ctx.fillStyle = "rgba(255, 252, 248, 0.8)"
  ctx.beginPath()
  ctx.roundRect(20, 260, width - 40, height - 375, 16)
  ctx.fill()
  ctx.strokeStyle = "rgba(196, 181, 164, 0.25)"
  ctx.lineWidth = 1
  ctx.stroke()

  // 뉴스 아이템
  let y = 290
  const maxNewsY = height - 130
  const colors = { title: "#654321", meta: "#8b6f47", summary: "#654321", highlight: "#dc2626" }
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
    ctx.fillStyle = "rgba(255, 252, 248, 0.9)"
    ctx.beginPath()
    ctx.roundRect(bx, stockY, stockW, 80, 14)
    ctx.fill()
    ctx.strokeStyle = "#c4b5a4"
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(bx, stockY)
    ctx.lineTo(bx, stockY + 80)
    ctx.stroke()

    ctx.textAlign = "center"
    ctx.fillStyle = "#654321"
    ctx.font = "bold 12px sans-serif"
    ctx.fillText(s.label, bx + stockW / 2, stockY + 24)
    ctx.font = "bold 15px sans-serif"
    ctx.fillText(s.value, bx + stockW / 2, stockY + 48)
    ctx.fillStyle = s.up ? "#dc2626" : "#1d4ed8"
    ctx.font = "11px sans-serif"
    ctx.fillText((s.up ? "▲ " : "▼ ") + s.change, bx + stockW / 2, stockY + 66)
  })
  ctx.textAlign = "left"
}

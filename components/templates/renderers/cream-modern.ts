import type { NewsItem, UserInfo } from "../template-types"
import { getDateString, drawProfile, drawNewsItem } from "./common"

// 템플릿 4: 크림 모던 - 따뜻한 크림 톤 모던 스타일
export const renderCreamModern = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo
) => {
  // 배경 그라데이션
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, "#fefcf3")
  bgGrad.addColorStop(1, "#f5f1e8")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 프로필 카드
  ctx.fillStyle = "rgba(255,255,255,0.85)"
  ctx.beginPath()
  ctx.roundRect(20, 20, width - 40, 95, 20)
  ctx.fill()
  ctx.strokeStyle = "rgba(222, 184, 135, 0.3)"
  ctx.lineWidth = 1
  ctx.stroke()

  // 프로필 이미지
  drawProfile(ctx, 65, 67, 30, user.profileImage, "#deb887")

  // 이름과 전화번호
  ctx.fillStyle = "#8b4513"
  ctx.font = "400 20px 'Georgia', serif"
  ctx.fillText(user.name, 110, 60)

  ctx.fillStyle = "#a0522d"
  ctx.font = "italic 13px 'Georgia', serif"
  ctx.fillText(user.phone, 110, 80)

  // 브랜드 문장
  if (user.brandPhrase) {
    ctx.fillStyle = "#8b4513"
    ctx.font = "10px sans-serif"
    ctx.fillText(user.brandPhrase, 110, 100)
  }

  // 날짜
  ctx.textAlign = "right"
  ctx.fillStyle = "#a0522d"
  ctx.font = "italic 12px 'Georgia', serif"
  ctx.fillText(getDateString(), width - 35, 67)
  ctx.textAlign = "left"

  // 날씨 영역
  ctx.fillStyle = "rgba(210, 180, 140, 0.2)"
  ctx.beginPath()
  ctx.roundRect(20, 130, width - 40, 50, 16)
  ctx.fill()
  ctx.strokeStyle = "rgba(210, 180, 140, 0.4)"
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.textAlign = "center"
  ctx.fillStyle = "#8b4513"
  ctx.font = "bold 16px 'Noto Sans KR', sans-serif"
  ctx.fillText("Weather: 5°C  ☀️", width / 2, 161)
  ctx.textAlign = "left"

  // 뉴스 섹션 제목
  ctx.textAlign = "center"
  ctx.fillStyle = "#654321"
  ctx.font = "400 24px 'Georgia', serif"
  ctx.fillText("Today's News", width / 2, 220)

  // 장식선
  ctx.strokeStyle = "#deb887"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(width / 2 - 30, 230)
  ctx.lineTo(width / 2 + 30, 230)
  ctx.stroke()
  ctx.textAlign = "left"

  // 뉴스 콘텐츠 카드
  ctx.fillStyle = "rgba(255, 248, 220, 0.6)"
  ctx.beginPath()
  ctx.roundRect(20, 250, width - 40, height - 360, 15)
  ctx.fill()
  ctx.strokeStyle = "#deb887"
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(20, 250)
  ctx.lineTo(20, height - 110)
  ctx.stroke()

  // 뉴스 아이템
  let y = 280
  const maxNewsY = height - 130
  const colors = { title: "#8b4513", meta: "#a0522d", summary: "#8b4513", highlight: "#dc2626" }
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
    ctx.fillStyle = "rgba(255, 248, 220, 0.8)"
    ctx.beginPath()
    ctx.roundRect(bx, stockY, stockW, 75, 12)
    ctx.fill()
    ctx.strokeStyle = "#deb887"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(bx, stockY)
    ctx.lineTo(bx, stockY + 75)
    ctx.stroke()

    ctx.textAlign = "center"
    ctx.fillStyle = "#8b4513"
    ctx.font = "bold 11px sans-serif"
    ctx.fillText(s.label, bx + stockW / 2, stockY + 22)
    ctx.font = "bold 14px sans-serif"
    ctx.fillText(s.value, bx + stockW / 2, stockY + 44)
    ctx.fillStyle = s.up ? "#dc2626" : "#1d4ed8"
    ctx.font = "10px sans-serif"
    ctx.fillText((s.up ? "▲ " : "▼ ") + s.change, bx + stockW / 2, stockY + 62)
  })
  ctx.textAlign = "left"
}

import type { NewsItem, UserInfo } from "../template-types.js"
import { getDateString, drawProfile, drawNewsItem } from "./common.js"

// 템플릿 9: 웜 피치 - 따뜻한 피치 톤 스타일
export const renderWarmPeach = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo
) => {
  // 배경 그라데이션
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, "#fff7ed")
  bgGrad.addColorStop(1, "#fed7aa")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 프로필 카드
  ctx.fillStyle = "rgba(255,255,255,0.9)"
  ctx.beginPath()
  ctx.roundRect(20, 20, width - 40, 95, 20)
  ctx.fill()
  ctx.strokeStyle = "rgba(253, 186, 116, 0.3)"
  ctx.lineWidth = 2
  ctx.stroke()

  // 프로필 이미지
  drawProfile(ctx, 65, 67, 30, user.profileImage, "#fb923c")

  // 이름과 전화번호
  ctx.fillStyle = "#ea580c"
  ctx.font = "500 20px 'Noto Sans KR', sans-serif"
  ctx.fillText(user.name, 110, 60)

  ctx.fillStyle = "#fb923c"
  ctx.font = "13px sans-serif"
  ctx.fillText(user.phone, 110, 80)

  // 브랜드 문장
  if (user.brandPhrase) {
    ctx.fillStyle = "#ea580c"
    ctx.font = "10px sans-serif"
    ctx.fillText(user.brandPhrase, 110, 100)
  }

  // 날짜
  ctx.textAlign = "right"
  ctx.fillStyle = "#fb923c"
  ctx.font = "12px sans-serif"
  ctx.fillText(getDateString(), width - 35, 67)
  ctx.textAlign = "left"

  // 날씨 영역
  ctx.fillStyle = "rgba(253, 186, 116, 0.25)"
  ctx.beginPath()
  ctx.roundRect(20, 130, width - 40, 50, 16)
  ctx.fill()
  ctx.strokeStyle = "rgba(253, 186, 116, 0.4)"
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.textAlign = "center"
  ctx.fillStyle = "#ea580c"
  ctx.font = "bold 16px 'Noto Sans KR', sans-serif"
  ctx.fillText("Weather: 5°C  ☀️", width / 2, 161)
  ctx.textAlign = "left"

  // 뉴스 섹션 제목
  ctx.textAlign = "center"
  ctx.fillStyle = "#c2410c"
  ctx.font = "500 24px 'Noto Sans KR', sans-serif"
  ctx.fillText("Today's News", width / 2, 220)

  // 장식선
  const lineGrad = ctx.createLinearGradient(width / 2 - 40, 0, width / 2 + 40, 0)
  lineGrad.addColorStop(0, "#fb923c")
  lineGrad.addColorStop(1, "#f97316")
  ctx.strokeStyle = lineGrad
  ctx.lineWidth = 3
  ctx.lineCap = "round"
  ctx.beginPath()
  ctx.moveTo(width / 2 - 40, 232)
  ctx.lineTo(width / 2 + 40, 232)
  ctx.stroke()
  ctx.textAlign = "left"

  // 뉴스 콘텐츠 카드
  ctx.fillStyle = "rgba(255,255,255,0.8)"
  ctx.beginPath()
  ctx.roundRect(20, 250, width - 40, height - 360, 15)
  ctx.fill()
  ctx.strokeStyle = "rgba(253, 186, 116, 0.3)"
  ctx.lineWidth = 1
  ctx.stroke()

  // 뉴스 아이템
  let y = 280
  const maxNewsY = height - 130
  const colors = { title: "#c2410c", meta: "#ea580c", summary: "#c2410c", highlight: "#dc2626" }
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
    ctx.strokeStyle = "#fb923c"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(bx, stockY)
    ctx.lineTo(bx, stockY + 75)
    ctx.stroke()

    ctx.textAlign = "center"
    ctx.fillStyle = "#ea580c"
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

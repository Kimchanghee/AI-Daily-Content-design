import type { NewsItem, UserInfo } from "../template-types.js"
import { getDateString, drawProfile, drawNewsItem } from "./common.js"

// 템플릿 3: 파스텔 빈티지 - 부드러운 파스텔 핑크 스타일
export const renderPastelVintage = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo
) => {
  // 배경 그라데이션
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, "#fdf2f8")
  bgGrad.addColorStop(1, "#fce7f3")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 테두리 효과
  ctx.strokeStyle = "rgba(251, 207, 232, 0.4)"
  ctx.lineWidth = 3
  ctx.strokeRect(10, 10, width - 20, height - 20)

  // 프로필 카드
  ctx.fillStyle = "rgba(255,255,255,0.6)"
  ctx.beginPath()
  ctx.roundRect(25, 25, width - 50, 95, 20)
  ctx.fill()
  ctx.strokeStyle = "rgba(251, 207, 232, 0.5)"
  ctx.lineWidth = 2
  ctx.stroke()

  // 프로필 이미지
  drawProfile(ctx, 70, 72, 30, user.profileImage, "#ec4899")

  // 이름과 전화번호
  ctx.fillStyle = "#be185d"
  ctx.font = "400 20px 'Georgia', serif"
  ctx.fillText(user.name, 115, 65)

  ctx.fillStyle = "#a21caf"
  ctx.font = "italic 13px 'Georgia', serif"
  ctx.fillText(user.phone, 115, 85)

  // 브랜드 문장
  if (user.brandPhrase) {
    ctx.fillStyle = "#be185d"
    ctx.font = "10px sans-serif"
    ctx.fillText(user.brandPhrase, 115, 105)
  }

  // 날짜
  ctx.textAlign = "right"
  ctx.fillStyle = "#a21caf"
  ctx.font = "italic 12px 'Georgia', serif"
  ctx.fillText(getDateString(), width - 40, 72)
  ctx.textAlign = "left"

  // 날씨 영역
  ctx.fillStyle = "rgba(251, 207, 232, 0.3)"
  ctx.beginPath()
  ctx.roundRect(25, 135, width - 50, 50, 16)
  ctx.fill()
  ctx.strokeStyle = "rgba(251, 207, 232, 0.5)"
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.textAlign = "center"
  ctx.fillStyle = "#be185d"
  ctx.font = "bold 16px 'Noto Sans KR', sans-serif"
  ctx.fillText("Weather: 5°C  ☀️", width / 2, 166)
  ctx.textAlign = "left"

  // 뉴스 섹션 제목 (별 장식)
  ctx.textAlign = "center"
  ctx.fillStyle = "#9d174d"
  ctx.font = "400 24px 'Georgia', serif"
  ctx.fillText("Today's News", width / 2, 225)

  // 별 장식
  ctx.fillStyle = "#f472b6"
  ctx.font = "16px sans-serif"
  ctx.fillText("✦", width / 2 - 100, 225)
  ctx.fillText("✦", width / 2 + 100, 225)
  ctx.textAlign = "left"

  // 뉴스 콘텐츠 카드
  ctx.fillStyle = "rgba(255,255,255,0.6)"
  ctx.beginPath()
  ctx.roundRect(25, 245, width - 50, height - 355, 15)
  ctx.fill()
  ctx.strokeStyle = "rgba(251, 207, 232, 0.3)"
  ctx.lineWidth = 1
  ctx.stroke()

  // 뉴스 아이템
  let y = 275
  const maxNewsY = height - 125
  const colors = { title: "#831843", meta: "#9d174d", summary: "#831843", highlight: "#dc2626" }
  news.slice(0, 10).forEach((item, i) => {
    if (y + 50 > maxNewsY) return
    const lineH = drawNewsItem(ctx, item, 45, y, width - 90, colors, i < 2)
    y += lineH + 5
  })

  // 주식 정보 카드들
  const stockY = height - 95
  const stockW = (width - 70) / 3
  const stocks = [
    { label: "KOSPI", value: "3,926.59", change: "60.32", up: false },
    { label: "KOSDAQ", value: "912.67", change: "32.61", up: true },
    { label: "USD/KRW", value: "1,470.20", change: "7.20", up: true },
  ]

  stocks.forEach((s, i) => {
    const bx = 25 + i * (stockW + 10)
    ctx.fillStyle = "rgba(255,255,255,0.8)"
    ctx.beginPath()
    ctx.roundRect(bx, stockY, stockW, 75, 12)
    ctx.fill()
    ctx.strokeStyle = "rgba(251, 207, 232, 0.4)"
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.textAlign = "center"
    ctx.fillStyle = "#be185d"
    ctx.font = "bold 11px sans-serif"
    ctx.fillText(s.label, bx + stockW / 2, stockY + 22)
    ctx.font = "bold 14px sans-serif"
    ctx.fillText(s.value, bx + stockW / 2, stockY + 44)
    ctx.fillStyle = s.up ? "#dc2626" : "#7c3aed"
    ctx.font = "10px sans-serif"
    ctx.fillText((s.up ? "▲ " : "▼ ") + s.change, bx + stockW / 2, stockY + 62)
  })
  ctx.textAlign = "left"
}

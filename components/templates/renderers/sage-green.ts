import type { NewsItem, UserInfo } from "../template-types"
import { getDateString, drawProfile, drawNewsItem } from "./common"

// 템플릿 5: 세이지 그린 - 평온한 세이지 그린 스타일
export const renderSageGreen = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo
) => {
  // 배경 그라데이션
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, "#f0f4f0")
  bgGrad.addColorStop(1, "#e8f5e8")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 프로필 카드
  ctx.fillStyle = "rgba(255,255,255,0.9)"
  ctx.beginPath()
  ctx.roundRect(20, 20, width - 40, 90, 18)
  ctx.fill()
  ctx.strokeStyle = "rgba(159, 194, 166, 0.3)"
  ctx.lineWidth = 1
  ctx.stroke()

  // 프로필 이미지
  drawProfile(ctx, 60, 65, 28, user.profileImage, "#9fc2a6")

  // 이름과 전화번호
  ctx.fillStyle = "#2d5a32"
  ctx.font = "bold 18px 'Noto Sans KR', sans-serif"
  ctx.fillText(user.name, 100, 58)

  ctx.fillStyle = "#6a9771"
  ctx.font = "13px sans-serif"
  ctx.fillText(user.phone, 100, 78)

  // 브랜드 문장
  if (user.brandPhrase) {
    ctx.fillStyle = "#2d5a32"
    ctx.font = "10px sans-serif"
    ctx.fillText(user.brandPhrase, 100, 95)
  }

  // 날짜
  ctx.textAlign = "right"
  ctx.fillStyle = "#6a9771"
  ctx.font = "12px sans-serif"
  ctx.fillText(getDateString(), width - 35, 65)
  ctx.textAlign = "left"

  // 날씨 영역
  ctx.fillStyle = "rgba(159, 194, 166, 0.15)"
  ctx.beginPath()
  ctx.roundRect(20, 125, width - 40, 48, 14)
  ctx.fill()
  ctx.strokeStyle = "rgba(159, 194, 166, 0.25)"
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.textAlign = "center"
  ctx.fillStyle = "#2d5a32"
  ctx.font = "bold 15px 'Noto Sans KR', sans-serif"
  ctx.fillText("Weather: 5°C  ☀️", width / 2, 155)
  ctx.textAlign = "left"

  // 뉴스 섹션 제목 (왼쪽 세로선 장식)
  ctx.fillStyle = "#9fc2a6"
  ctx.fillRect(20, 195, 4, 30)
  ctx.fillStyle = "#1a3d1f"
  ctx.font = "bold 22px 'Noto Sans KR', sans-serif"
  ctx.fillText("Today's News", 35, 218)

  // 뉴스 콘텐츠 카드
  ctx.fillStyle = "rgba(255,255,255,0.7)"
  ctx.beginPath()
  ctx.roundRect(20, 240, width - 40, height - 350, 12)
  ctx.fill()
  ctx.strokeStyle = "rgba(159, 194, 166, 0.2)"
  ctx.lineWidth = 1
  ctx.stroke()

  // 뉴스 아이템
  let y = 268
  const maxNewsY = height - 130
  const colors = { title: "#2d5a32", meta: "#6a9771", summary: "#2d5a32", highlight: "#dc2626" }
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
    ctx.roundRect(bx, stockY, stockW, 75, 10)
    ctx.fill()
    ctx.strokeStyle = "rgba(159, 194, 166, 0.2)"
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.textAlign = "center"
    ctx.fillStyle = "#2d5a32"
    ctx.font = "bold 11px sans-serif"
    ctx.fillText(s.label, bx + stockW / 2, stockY + 22)
    ctx.font = "bold 14px sans-serif"
    ctx.fillText(s.value, bx + stockW / 2, stockY + 44)
    ctx.fillStyle = s.up ? "#dc2626" : "#1e40af"
    ctx.font = "10px sans-serif"
    ctx.fillText((s.up ? "▲ " : "▼ ") + s.change, bx + stockW / 2, stockY + 62)
  })
  ctx.textAlign = "left"
}

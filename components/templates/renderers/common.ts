import type { NewsItem, UserInfo } from "../template-types"

export const getDateString = () => {
  const today = new Date()
  const days = ["일", "월", "화", "수", "목", "금", "토"]
  return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}. (${days[today.getDay()]})`
}

export const truncateText = (text: string, maxLen: number) => {
  return text.length > maxLen ? text.substring(0, maxLen) + "..." : text
}

export const drawProfile = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  img: HTMLImageElement | null,
  bgColor: string
) => {
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = bgColor
  ctx.fill()
  if (img) {
    ctx.clip()
    ctx.drawImage(img, x - r, y - r, r * 2, r * 2)
  }
  ctx.restore()
}

export const drawNewsItem = (
  ctx: CanvasRenderingContext2D,
  news: NewsItem,
  x: number,
  y: number,
  maxWidth: number,
  colors: { title: string; meta: string; summary: string; highlight: string },
  isHighlight = false
) => {
  // 제목
  ctx.fillStyle = isHighlight ? colors.highlight : colors.title
  ctx.font = isHighlight ? "bold 14px 'Noto Sans KR', sans-serif" : "bold 13px 'Noto Sans KR', sans-serif"
  const title = truncateText(news.title, 32)
  ctx.fillText("• " + title, x, y)

  // 메타 정보
  ctx.fillStyle = colors.meta
  ctx.font = "10px sans-serif"
  const meta = `${news.source} | ${news.publishedAt}`
  ctx.fillText(meta, x + 12, y + 16)

  // 요약
  if (news.summary) {
    ctx.fillStyle = colors.summary
    ctx.font = "11px sans-serif"
    const summary = truncateText(news.summary, 45)
    ctx.fillText(summary, x + 12, y + 32)
    return 50
  }

  return 35
}

export const drawStockInfo = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  textColor: string
) => {
  ctx.textAlign = "center"
  ctx.fillStyle = textColor
  ctx.font = "bold 11px sans-serif"
  ctx.fillText("KOSPI 3,926 ▼60  |  KOSDAQ 912 ▲32  |  환율 1,470 ▲7", x + width / 2, y)
  ctx.textAlign = "left"
}

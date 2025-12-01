import type { NewsItem, UserInfo } from "./template-types"

const getDateString = () => {
  const today = new Date()
  const days = ["일", "월", "화", "수", "목", "금", "토"]
  return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}. (${days[today.getDay()]})`
}

const truncateText = (text: string, maxLen: number) => {
  return text.length > maxLen ? text.substring(0, maxLen) + "..." : text
}

const drawProfile = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  img: HTMLImageElement | null,
  bgColor: string,
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

const drawFullNewsItem = (
  ctx: CanvasRenderingContext2D,
  news: NewsItem,
  x: number,
  y: number,
  maxWidth: number,
  isHighlight = false,
) => {
  // 제목 (굵게)
  ctx.fillStyle = isHighlight ? "#c53030" : "#1a202c"
  ctx.font = isHighlight ? "bold 14px 'Noto Sans KR', sans-serif" : "bold 13px 'Noto Sans KR', sans-serif"
  const title = truncateText(news.title, 32)
  ctx.fillText("• " + title, x, y)

  // 메타 정보: 언론사 | 발행일
  ctx.fillStyle = "#718096"
  ctx.font = "10px sans-serif"
  const meta = `${news.source} | ${news.publishedAt}`
  ctx.fillText(meta, x + 12, y + 16)

  // 내용 요약 (1줄로 축소)
  if (news.summary) {
    ctx.fillStyle = "#4a5568"
    ctx.font = "11px sans-serif"
    const summary = truncateText(news.summary, 45)
    ctx.fillText(summary, x + 12, y + 32)
    return 50
  }

  return 35
}

// 템플릿 1: 시티 나이트
export const renderCityNight = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo,
) => {
  // 배경 그라데이션
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height)
  bgGrad.addColorStop(0, "#2d3561")
  bgGrad.addColorStop(0.5, "#1e2243")
  bgGrad.addColorStop(1, "#0f1525")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 도시 스카이라인
  ctx.fillStyle = "rgba(15, 21, 37, 0.9)"
  const buildings = [
    { x: 0, w: 50, h: 200 },
    { x: 55, w: 40, h: 280 },
    { x: 100, w: 60, h: 220 },
    { x: 165, w: 35, h: 340 },
    { x: 205, w: 55, h: 240 },
    { x: 265, w: 45, h: 310 },
    { x: 315, w: 50, h: 260 },
    { x: 370, w: 40, h: 360 },
    { x: 415, w: 55, h: 280 },
    { x: 475, w: 45, h: 320 },
    { x: 525, w: 35, h: 250 },
  ]
  buildings.forEach((b) => {
    ctx.fillRect(b.x, height - b.h, b.w, b.h)
    ctx.fillStyle = "rgba(255, 220, 100, 0.7)"
    for (let row = 0; row < Math.floor(b.h / 22); row++) {
      for (let col = 0; col < Math.floor(b.w / 14); col++) {
        if (Math.random() > 0.4) {
          ctx.fillRect(b.x + 4 + col * 14, height - b.h + 10 + row * 22, 6, 12)
        }
      }
    }
    ctx.fillStyle = "rgba(15, 21, 37, 0.9)"
  })

  // 프로필 영역 - 간격 개선
  const pX = 55,
    pY = 50,
    pR = 32
  ctx.beginPath()
  ctx.arc(pX, pY, pR + 2, 0, Math.PI * 2)
  ctx.strokeStyle = "rgba(255,255,255,0.4)"
  ctx.lineWidth = 2
  ctx.stroke()
  drawProfile(ctx, pX, pY, pR, user.profileImage, "#4a5568")

  // 이름과 전화번호를 세로로 배치
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 18px 'Noto Sans KR', sans-serif"
  ctx.fillText(user.name, 100, 42)

  ctx.fillStyle = "#48bb78"
  ctx.font = "13px sans-serif"
  ctx.fillText("📞 " + user.phone, 100, 62)

  // 뉴스 카드
  const cardX = 20,
    cardY = 105,
    cardW = width - 40,
    cardH = height - 240
  ctx.fillStyle = "rgba(255,255,255,0.98)"
  ctx.beginPath()
  ctx.roundRect(cardX, cardY, cardW, cardH, 20)
  ctx.fill()

  ctx.fillStyle = "#1a202c"
  ctx.font = "bold 22px 'Georgia', serif"
  ctx.fillText("Today's News", cardX + 25, cardY + 38)
  ctx.textAlign = "right"
  ctx.font = "12px sans-serif"
  ctx.fillStyle = "#718096"
  ctx.fillText(getDateString(), cardX + cardW - 25, cardY + 38)
  ctx.textAlign = "left"

  ctx.strokeStyle = "#e2e8f0"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cardX + 25, cardY + 52)
  ctx.lineTo(cardX + cardW - 25, cardY + 52)
  ctx.stroke()

  let y = cardY + 70
  const maxNewsY = cardY + cardH - 20
  news.slice(0, 10).forEach((item, i) => {
    if (y + 50 > maxNewsY) return
    const lineH = drawFullNewsItem(ctx, item, cardX + 25, y, cardW - 50, i < 2)
    y += lineH + 5
  })

  // 주식 정보
  const stockY = height - 115
  const stockW = (width - 60) / 3
  const stocks = [
    { label: "KOSPI", value: "3,926.59", change: "60.32", up: false },
    { label: "KOSDAQ", value: "912.67", change: "32.61", up: true },
    { label: "환율", value: "1,470.20", change: "7.20", up: true },
  ]

  stocks.forEach((s, i) => {
    const bx = 20 + i * (stockW + 10)
    ctx.fillStyle = "rgba(255,255,255,0.95)"
    ctx.beginPath()
    ctx.roundRect(bx, stockY, stockW, 80, 12)
    ctx.fill()

    ctx.textAlign = "center"
    ctx.fillStyle = "#1a202c"
    ctx.font = "bold 13px sans-serif"
    ctx.fillText(s.label, bx + stockW / 2, stockY + 24)
    ctx.font = "bold 20px sans-serif"
    ctx.fillText(s.value, bx + stockW / 2, stockY + 50)
    ctx.fillStyle = s.up ? "#e53e3e" : "#3182ce"
    ctx.font = "12px sans-serif"
    ctx.fillText((s.up ? "▲ " : "▼ ") + s.change, bx + stockW / 2, stockY + 68)
  })
  ctx.textAlign = "left"
}

// 템플릿 2: 럭셔리 골드
export const renderLuxuryGold = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo,
) => {
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height)
  bgGrad.addColorStop(0, "#1a1a2e")
  bgGrad.addColorStop(1, "#0d0d1a")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 골드 테두리
  ctx.strokeStyle = "#d4af37"
  ctx.lineWidth = 4
  ctx.strokeRect(15, 15, width - 30, height - 30)
  ctx.lineWidth = 1
  ctx.strokeRect(25, 25, width - 50, height - 50)

  // 코너 장식
  const corners = [
    { x: 15, y: 15 },
    { x: width - 35, y: 15 },
    { x: 15, y: height - 35 },
    { x: width - 35, y: height - 35 },
  ]
  corners.forEach((c) => {
    ctx.fillStyle = "#d4af37"
    ctx.fillRect(c.x, c.y, 20, 4)
    ctx.fillRect(c.x, c.y, 4, 20)
  })

  // 중앙 프로필 - 크기 축소 및 간격 개선
  const pX = width / 2,
    pY = 70,
    pR = 32
  ctx.beginPath()
  ctx.arc(pX, pY, pR + 3, 0, Math.PI * 2)
  ctx.strokeStyle = "#d4af37"
  ctx.lineWidth = 2
  ctx.stroke()
  drawProfile(ctx, pX, pY, pR, user.profileImage, "#2d2d44")

  ctx.textAlign = "center"
  ctx.fillStyle = "#d4af37"
  ctx.font = "bold 18px 'Georgia', serif"
  ctx.fillText(user.name, width / 2, pY + 55)
  ctx.fillStyle = "#888"
  ctx.font = "12px sans-serif"
  ctx.fillText(user.phone, width / 2, pY + 72)
  ctx.textAlign = "left"

  // 뉴스 카드
  const cardX = 40,
    cardY = 165,
    cardW = width - 80,
    cardH = height - 280
  ctx.fillStyle = "rgba(255,255,255,0.97)"
  ctx.beginPath()
  ctx.roundRect(cardX, cardY, cardW, cardH, 15)
  ctx.fill()
  ctx.strokeStyle = "#d4af37"
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.textAlign = "center"
  ctx.fillStyle = "#1a1a2e"
  ctx.font = "bold 18px 'Georgia', serif"
  ctx.fillText("✦ Today's News ✦", width / 2, cardY + 32)
  ctx.font = "11px sans-serif"
  ctx.fillStyle = "#888"
  ctx.fillText(getDateString(), width / 2, cardY + 50)
  ctx.textAlign = "left"

  let y = cardY + 70
  const maxNewsY = cardY + cardH - 20
  news.slice(0, 10).forEach((item, i) => {
    if (y + 50 > maxNewsY) return
    const lineH = drawFullNewsItem(ctx, item, cardX + 20, y, cardW - 40, i < 2)
    y += lineH + 5
  })

  // 하단 주식
  const stockY = height - 75
  ctx.fillStyle = "rgba(255,255,255,0.95)"
  ctx.beginPath()
  ctx.roundRect(40, stockY - 10, width - 80, 45, 12)
  ctx.fill()
  ctx.textAlign = "center"
  ctx.fillStyle = "#1a1a2e"
  ctx.font = "bold 12px sans-serif"
  ctx.fillText("KOSPI 3,926 ▼60  |  KOSDAQ 912 ▲32  |  환율 1,470 ▲7", width / 2, stockY + 15)
  ctx.textAlign = "left"
}

// 템플릿 3: 오션 블루
export const renderOceanBlue = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo,
) => {
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height)
  bgGrad.addColorStop(0, "#87ceeb")
  bgGrad.addColorStop(0.4, "#4a90a4")
  bgGrad.addColorStop(0.8, "#1e6091")
  bgGrad.addColorStop(1, "#0a3d62")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 물결 패턴
  ctx.fillStyle = "rgba(255,255,255,0.06)"
  for (let wave = 0; wave < 10; wave++) {
    ctx.beginPath()
    ctx.moveTo(0, 60 + wave * 100)
    for (let x = 0; x <= width; x += 10) {
      ctx.lineTo(x, 60 + wave * 100 + Math.sin(x / 25 + wave) * 18)
    }
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.fill()
  }

  // 상단 프로필 카드
  ctx.fillStyle = "rgba(255,255,255,0.97)"
  ctx.beginPath()
  ctx.roundRect(15, 15, width - 30, 80, 18)
  ctx.fill()

  drawProfile(ctx, 55, 55, 30, user.profileImage, "#4a90a4")

  ctx.fillStyle = "#0a3d62"
  ctx.font = "bold 18px sans-serif"
  ctx.fillText(user.name, 100, 48)
  ctx.font = "12px sans-serif"
  ctx.fillStyle = "#1e6091"
  ctx.fillText(user.phone, 100, 68)

  // 날짜
  ctx.textAlign = "right"
  ctx.font = "11px sans-serif"
  ctx.fillStyle = "#0a3d62"
  ctx.fillText(getDateString(), width - 28, 55)
  ctx.textAlign = "left"

  // 뉴스 카드
  ctx.fillStyle = "rgba(255,255,255,0.97)"
  ctx.beginPath()
  ctx.roundRect(15, 110, width - 30, height - 185, 18)
  ctx.fill()

  ctx.fillStyle = "#0a3d62"
  ctx.font = "bold 18px sans-serif"
  ctx.fillText("📰 Today's News", 35, 145)

  let y = 170
  const maxNewsY = height - 90
  news.slice(0, 10).forEach((item, i) => {
    if (y + 50 > maxNewsY) return
    const lineH = drawFullNewsItem(ctx, item, 35, y, width - 70, i < 2)
    y += lineH + 5
  })

  // 주식
  ctx.fillStyle = "rgba(255,255,255,0.97)"
  ctx.beginPath()
  ctx.roundRect(15, height - 60, width - 30, 45, 16)
  ctx.fill()

  ctx.textAlign = "center"
  ctx.fillStyle = "#0a3d62"
  ctx.font = "bold 12px sans-serif"
  ctx.fillText("KOSPI 3,926 ▼60  |  KOSDAQ 912 ▲32  |  환율 1,470 ▲7", width / 2, height - 32)
  ctx.textAlign = "left"
}

// 템플릿 4: 포레스트 그린
export const renderForestGreen = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo,
) => {
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height)
  bgGrad.addColorStop(0, "#a8e6cf")
  bgGrad.addColorStop(0.5, "#56ab91")
  bgGrad.addColorStop(1, "#1b4332")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 나뭇잎 패턴
  ctx.fillStyle = "rgba(255,255,255,0.05)"
  for (let i = 0; i < 30; i++) {
    ctx.beginPath()
    ctx.ellipse(
      Math.random() * width,
      Math.random() * height,
      15 + Math.random() * 30,
      8 + Math.random() * 15,
      Math.random() * Math.PI,
      0,
      Math.PI * 2,
    )
    ctx.fill()
  }

  // 상단 바
  ctx.fillStyle = "rgba(255,255,255,0.97)"
  ctx.fillRect(0, 0, width, 75)

  drawProfile(ctx, 45, 38, 28, user.profileImage, "#56ab91")

  ctx.fillStyle = "#1b4332"
  ctx.font = "bold 17px sans-serif"
  ctx.fillText(user.name, 85, 32)
  ctx.font = "12px sans-serif"
  ctx.fillStyle = "#56ab91"
  ctx.fillText(user.phone, 85, 52)

  ctx.textAlign = "right"
  ctx.font = "11px sans-serif"
  ctx.fillStyle = "#1b4332"
  ctx.fillText("🌿 " + getDateString(), width - 18, 42)
  ctx.textAlign = "left"

  // 메인 뉴스 카드
  ctx.fillStyle = "rgba(255,255,255,0.95)"
  ctx.beginPath()
  ctx.roundRect(18, 90, width - 36, height - 160, 20)
  ctx.fill()

  // 세로 장식
  ctx.fillStyle = "#56ab91"
  ctx.fillRect(40, 110, 4, height - 200)

  ctx.fillStyle = "#1b4332"
  ctx.font = "bold 18px sans-serif"
  ctx.fillText("Today's News", 58, 135)

  let y = 160
  const maxNewsY = height - 80
  news.slice(0, 10).forEach((item, i) => {
    if (y + 50 > maxNewsY) return
    const lineH = drawFullNewsItem(ctx, item, 58, y, width - 100, i < 2)
    y += lineH + 5
  })

  // 하단 주식
  ctx.fillStyle = "rgba(255,255,255,0.95)"
  ctx.beginPath()
  ctx.roundRect(18, height - 55, width - 36, 40, 14)
  ctx.fill()

  ctx.textAlign = "center"
  ctx.fillStyle = "#1b4332"
  ctx.font = "11px sans-serif"
  ctx.fillText("KOSPI 3,926 ▼60  |  KOSDAQ 912 ▲32  |  환율 1,470 ▲7", width / 2, height - 30)
  ctx.textAlign = "left"
}

// 템플릿 5: 선셋 웜
export const renderSunsetWarm = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo,
) => {
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, "#ffecd2")
  bgGrad.addColorStop(0.3, "#fcb69f")
  bgGrad.addColorStop(0.6, "#ff8a65")
  bgGrad.addColorStop(1, "#bf360c")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 태양 장식 (우측 상단, 프로필 카드와 겹치지 않게)
  ctx.beginPath()
  ctx.arc(width - 40, 50, 40, 0, Math.PI * 2)
  ctx.fillStyle = "rgba(255,255,200,0.3)"
  ctx.fill()
  ctx.beginPath()
  ctx.arc(width - 40, 50, 25, 0, Math.PI * 2)
  ctx.fillStyle = "rgba(255,255,220,0.45)"
  ctx.fill()

  // 프로필 카드
  ctx.fillStyle = "rgba(255,255,255,0.97)"
  ctx.beginPath()
  ctx.roundRect(15, 15, width - 100, 75, 18)
  ctx.fill()

  drawProfile(ctx, 55, 52, 28, user.profileImage, "#ff8a65")

  ctx.fillStyle = "#bf360c"
  ctx.font = "bold 18px sans-serif"
  ctx.fillText(user.name, 95, 45)
  ctx.font = "12px sans-serif"
  ctx.fillStyle = "#ff7043"
  ctx.fillText(user.phone, 95, 65)

  // 뉴스 카드
  ctx.fillStyle = "rgba(255,255,255,0.97)"
  ctx.beginPath()
  ctx.roundRect(15, 105, width - 30, height - 175, 20)
  ctx.fill()

  ctx.fillStyle = "#bf360c"
  ctx.font = "bold 18px sans-serif"
  ctx.fillText("🌅 Today's News", 38, 138)
  ctx.textAlign = "right"
  ctx.font = "11px sans-serif"
  ctx.fillStyle = "#888"
  ctx.fillText(getDateString(), width - 38, 138)
  ctx.textAlign = "left"

  // 구분선
  ctx.strokeStyle = "#ffccbc"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(38, 152)
  ctx.lineTo(width - 38, 152)
  ctx.stroke()

  let y = 170
  const maxNewsY = height - 80
  news.slice(0, 10).forEach((item, i) => {
    if (y + 50 > maxNewsY) return
    const lineH = drawFullNewsItem(ctx, item, 38, y, width - 76, i < 2)
    y += lineH + 5
  })

  // 주식
  ctx.fillStyle = "rgba(255,255,255,0.97)"
  ctx.beginPath()
  ctx.roundRect(15, height - 55, width - 30, 40, 14)
  ctx.fill()

  ctx.textAlign = "center"
  ctx.fillStyle = "#bf360c"
  ctx.font = "bold 11px sans-serif"
  ctx.fillText("KOSPI 3,926 ▼60  |  KOSDAQ 912 ▲32  |  환율 1,470 ▲7", width / 2, height - 30)
  ctx.textAlign = "left"
}

// 템플릿 6: 미니멀 모노
export const renderMinimalMono = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo,
) => {
  // 흰색 배경
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, width, height)

  // 상단 검정 바
  ctx.fillStyle = "#000000"
  ctx.fillRect(0, 0, width, 90)

  drawProfile(ctx, 50, 45, 32, user.profileImage, "#333")

  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 20px sans-serif"
  ctx.fillText(user.name, 95, 40)
  ctx.font = "12px sans-serif"
  ctx.fillStyle = "#aaa"
  ctx.fillText(user.phone, 95, 60)

  ctx.textAlign = "right"
  ctx.fillStyle = "#fff"
  ctx.font = "11px sans-serif"
  ctx.fillText(getDateString(), width - 22, 50)
  ctx.textAlign = "left"

  // 뉴스 영역
  ctx.fillStyle = "#f8f8f8"
  ctx.fillRect(0, 90, width, height - 150)

  ctx.fillStyle = "#000"
  ctx.font = "bold 18px sans-serif"
  ctx.fillText("TODAY'S NEWS", 28, 125)

  // 구분선
  ctx.strokeStyle = "#000"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(28, 135)
  ctx.lineTo(170, 135)
  ctx.stroke()

  let y = 155
  const maxNewsY = height - 80
  news.slice(0, 10).forEach((item, i) => {
    if (y + 50 > maxNewsY) return
    const lineH = drawFullNewsItem(ctx, item, 28, y, width - 56, i < 2)
    y += lineH + 5
  })

  // 하단 검정 바
  ctx.fillStyle = "#000000"
  ctx.fillRect(0, height - 60, width, 60)

  ctx.textAlign = "center"
  ctx.fillStyle = "#fff"
  ctx.font = "bold 11px sans-serif"
  ctx.fillText("KOSPI 3,926 ▼60  |  KOSDAQ 912 ▲32  |  환율 1,470 ▲7", width / 2, height - 30)
  ctx.textAlign = "left"
}

export const renderMiniPreview = (
  templateId: string,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo,
) => {
  const scaleX = width / 540
  const scaleY = height / 960

  ctx.save()
  ctx.scale(scaleX, scaleY)

  switch (templateId) {
    case "city-night":
      renderCityNight(ctx, 540, 960, news, user)
      break
    case "luxury-gold":
      renderLuxuryGold(ctx, 540, 960, news, user)
      break
    case "ocean-blue":
      renderOceanBlue(ctx, 540, 960, news, user)
      break
    case "forest-green":
      renderForestGreen(ctx, 540, 960, news, user)
      break
    case "sunset-warm":
      renderSunsetWarm(ctx, 540, 960, news, user)
      break
    case "minimal-mono":
      renderMinimalMono(ctx, 540, 960, news, user)
      break
    default:
      renderCityNight(ctx, 540, 960, news, user)
  }

  ctx.restore()
}

export const renderTemplate = (
  templateId: string,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo,
) => {
  switch (templateId) {
    case "city-night":
      renderCityNight(ctx, width, height, news, user)
      break
    case "luxury-gold":
      renderLuxuryGold(ctx, width, height, news, user)
      break
    case "ocean-blue":
      renderOceanBlue(ctx, width, height, news, user)
      break
    case "forest-green":
      renderForestGreen(ctx, width, height, news, user)
      break
    case "sunset-warm":
      renderSunsetWarm(ctx, width, height, news, user)
      break
    case "minimal-mono":
      renderMinimalMono(ctx, width, height, news, user)
      break
    default:
      renderCityNight(ctx, width, height, news, user)
  }
}

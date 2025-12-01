import type { NewsItem, UserInfo } from "./template-types"

const getDateString = () => {
  const today = new Date()
  const days = ["일", "월", "화", "수", "목", "금", "토"]
  return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}. (${days[today.getDay()]})`
}

const truncateTitle = (title: string, maxLen: number) => {
  return title.length > maxLen ? title.substring(0, maxLen) + "..." : title
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

// 템플릿 1: 시티 나이트
export const renderCityNight = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo,
) => {
  // 배경
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

  // 프로필 영역
  const pX = 70,
    pY = 65,
    pR = 48
  ctx.beginPath()
  ctx.arc(pX, pY, pR + 3, 0, Math.PI * 2)
  ctx.strokeStyle = "rgba(255,255,255,0.4)"
  ctx.lineWidth = 2
  ctx.stroke()
  drawProfile(ctx, pX, pY, pR, user.profileImage, "#4a5568")

  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 22px 'Noto Sans KR', sans-serif"
  ctx.fillText(user.name, 135, 48)
  ctx.font = "14px sans-serif"
  ctx.fillStyle = "#a0aec0"
  ctx.fillText("사업단장", 135 + ctx.measureText(user.name).width + 10, 48)

  ctx.fillStyle = "#48bb78"
  ctx.font = "15px sans-serif"
  ctx.fillText("📞 " + user.phone, 135, 75)
  ctx.fillStyle = "#a0aec0"
  ctx.fillText("📷 @instagram", 135, 97)

  // 날씨
  ctx.textAlign = "center"
  ctx.font = "28px sans-serif"
  ctx.fillText("☀️", width - 100, 45)
  ctx.fillText("🌤️", width - 45, 45)
  ctx.font = "12px sans-serif"
  ctx.fillStyle = "#ffffff"
  ctx.fillText("서울 8°", width - 100, 70)
  ctx.fillText("부산 16°", width - 45, 70)
  ctx.textAlign = "left"

  // 뉴스 카드
  const cardX = 20,
    cardY = 125,
    cardW = width - 40,
    cardH = height - 290
  ctx.fillStyle = "rgba(255,255,255,0.98)"
  ctx.beginPath()
  ctx.roundRect(cardX, cardY, cardW, cardH, 20)
  ctx.fill()

  ctx.fillStyle = "#1a202c"
  ctx.font = "bold 24px 'Georgia', serif"
  ctx.fillText("Today's News", cardX + 25, cardY + 42)
  ctx.textAlign = "right"
  ctx.font = "13px sans-serif"
  ctx.fillStyle = "#718096"
  ctx.fillText(getDateString(), cardX + cardW - 25, cardY + 42)
  ctx.textAlign = "left"

  ctx.strokeStyle = "#e2e8f0"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cardX + 25, cardY + 58)
  ctx.lineTo(cardX + cardW - 25, cardY + 58)
  ctx.stroke()

  let y = cardY + 90
  const lineHeight = 38
  news.slice(0, 12).forEach((item, i) => {
    if (y > cardY + cardH - 25) return

    if (i === 0) {
      ctx.fillStyle = "#e53e3e"
      ctx.font = "bold 15px 'Noto Sans KR', sans-serif"
    } else if (i === 1) {
      ctx.fillStyle = "#3182ce"
      ctx.font = "bold 15px 'Noto Sans KR', sans-serif"
    } else if (i === 2) {
      ctx.fillStyle = "#1a202c"
      ctx.font = "bold 15px 'Noto Sans KR', sans-serif"
    } else {
      ctx.fillStyle = "#4a5568"
      ctx.font = "14px 'Noto Sans KR', sans-serif"
    }

    const title = truncateTitle(item.title, 32)
    ctx.fillText("• " + title, cardX + 25, y)
    y += lineHeight
  })

  // 주식 정보
  const stockY = height - 135
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
    ctx.roundRect(bx, stockY, stockW, 90, 12)
    ctx.fill()

    ctx.textAlign = "center"
    ctx.fillStyle = "#1a202c"
    ctx.font = "bold 14px sans-serif"
    ctx.fillText(s.label, bx + stockW / 2, stockY + 28)
    ctx.font = "bold 22px sans-serif"
    ctx.fillText(s.value, bx + stockW / 2, stockY + 58)
    ctx.fillStyle = s.up ? "#e53e3e" : "#3182ce"
    ctx.font = "13px sans-serif"
    ctx.fillText((s.up ? "▲ " : "▼ ") + s.change, bx + stockW / 2, stockY + 78)
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

  // 골드 장식
  ctx.strokeStyle = "#d4af37"
  ctx.lineWidth = 4
  ctx.strokeRect(15, 15, width - 30, height - 30)
  ctx.lineWidth = 1
  ctx.strokeRect(25, 25, width - 50, height - 50)

  // 상단 골드 라인
  ctx.fillStyle = "#d4af37"
  ctx.fillRect(40, 40, width - 80, 2)

  // 코너 장식
  const cornerSize = 20
  ctx.fillStyle = "#d4af37"
  ctx.fillRect(15, 15, cornerSize, 4)
  ctx.fillRect(15, 15, 4, cornerSize)
  ctx.fillRect(width - 15 - cornerSize, 15, cornerSize, 4)
  ctx.fillRect(width - 19, 15, 4, cornerSize)
  ctx.fillRect(15, height - 19, cornerSize, 4)
  ctx.fillRect(15, height - 15 - cornerSize, 4, cornerSize)
  ctx.fillRect(width - 15 - cornerSize, height - 19, cornerSize, 4)
  ctx.fillRect(width - 19, height - 15 - cornerSize, 4, cornerSize)

  // 날씨
  ctx.font = "18px sans-serif"
  ctx.fillStyle = "#fff"
  ctx.fillText("☀️ 8°", 50, 70)
  ctx.textAlign = "right"
  ctx.fillText("🌙 16°", width - 50, 70)
  ctx.textAlign = "left"

  // 중앙 프로필
  const pX = width / 2,
    pY = 140,
    pR = 55
  ctx.beginPath()
  ctx.arc(pX, pY, pR + 5, 0, Math.PI * 2)
  ctx.strokeStyle = "#d4af37"
  ctx.lineWidth = 3
  ctx.stroke()
  drawProfile(ctx, pX, pY, pR, user.profileImage, "#2d2d44")

  ctx.textAlign = "center"
  ctx.fillStyle = "#d4af37"
  ctx.font = "bold 28px 'Georgia', serif"
  ctx.fillText(user.name, width / 2, pY + 85)
  ctx.fillStyle = "#888"
  ctx.font = "14px sans-serif"
  ctx.fillText(user.phone, width / 2, pY + 110)
  ctx.textAlign = "left"

  // 뉴스 카드
  const cardX = 40,
    cardY = 280,
    cardW = width - 80,
    cardH = height - 400
  ctx.fillStyle = "rgba(255,255,255,0.97)"
  ctx.beginPath()
  ctx.roundRect(cardX, cardY, cardW, cardH, 15)
  ctx.fill()
  ctx.strokeStyle = "#d4af37"
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.textAlign = "center"
  ctx.fillStyle = "#1a1a2e"
  ctx.font = "bold 22px 'Georgia', serif"
  ctx.fillText("✦ Today's News ✦", width / 2, cardY + 40)
  ctx.font = "12px sans-serif"
  ctx.fillStyle = "#888"
  ctx.fillText(getDateString(), width / 2, cardY + 62)
  ctx.textAlign = "left"

  let y = cardY + 95
  news.slice(0, 11).forEach((item, i) => {
    if (y > cardY + cardH - 25) return
    ctx.fillStyle = i < 2 ? "#b8860b" : "#333"
    ctx.font = i < 2 ? "bold 14px sans-serif" : "13px sans-serif"
    ctx.fillText("◆ " + truncateTitle(item.title, 30), cardX + 25, y)
    y += 36
  })

  // 하단 주식
  const stockY = height - 100
  ctx.textAlign = "center"
  ctx.fillStyle = "#d4af37"
  ctx.font = "bold 14px sans-serif"
  ctx.fillText("KOSPI 3,926 ▼60", width / 4, stockY)
  ctx.fillText("KOSDAQ 912 ▲32", width / 2, stockY)
  ctx.fillText("환율 1,470 ▲7", (width / 4) * 3, stockY)

  ctx.fillStyle = "#d4af37"
  ctx.fillRect(40, height - 55, width - 80, 2)
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
  ctx.fillStyle = "rgba(255,255,255,0.08)"
  for (let wave = 0; wave < 8; wave++) {
    ctx.beginPath()
    ctx.moveTo(0, 80 + wave * 120)
    for (let x = 0; x <= width; x += 12) {
      ctx.lineTo(x, 80 + wave * 120 + Math.sin(x / 30 + wave) * 20)
    }
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.fill()
  }

  // 상단 프로필 카드
  ctx.fillStyle = "rgba(255,255,255,0.97)"
  ctx.beginPath()
  ctx.roundRect(15, 15, width - 30, 100, 18)
  ctx.fill()

  drawProfile(ctx, 70, 65, 38, user.profileImage, "#4a90a4")

  ctx.fillStyle = "#0a3d62"
  ctx.font = "bold 22px sans-serif"
  ctx.fillText(user.name, 125, 55)
  ctx.font = "14px sans-serif"
  ctx.fillStyle = "#1e6091"
  ctx.fillText(user.phone, 125, 80)

  // 날씨
  ctx.fillStyle = "rgba(255,255,255,0.9)"
  ctx.beginPath()
  ctx.roundRect(width - 145, 28, 58, 58, 12)
  ctx.fill()
  ctx.beginPath()
  ctx.roundRect(width - 78, 28, 58, 58, 12)
  ctx.fill()
  ctx.textAlign = "center"
  ctx.font = "24px sans-serif"
  ctx.fillText("☀️", width - 116, 60)
  ctx.fillText("⛅", width - 49, 60)
  ctx.font = "10px sans-serif"
  ctx.fillStyle = "#333"
  ctx.fillText("서울 8°", width - 116, 78)
  ctx.fillText("부산 16°", width - 49, 78)
  ctx.textAlign = "left"

  // 뉴스 카드 1
  ctx.fillStyle = "rgba(255,255,255,0.97)"
  ctx.beginPath()
  ctx.roundRect(15, 130, width - 30, 260, 18)
  ctx.fill()

  ctx.fillStyle = "#0a3d62"
  ctx.font = "bold 18px sans-serif"
  ctx.fillText("📰 주요 뉴스", 38, 165)

  let y = 200
  news.slice(0, 6).forEach((item, i) => {
    ctx.fillStyle = i === 0 ? "#dc2626" : "#333"
    ctx.font = i === 0 ? "bold 14px sans-serif" : "13px sans-serif"
    ctx.fillText("• " + truncateTitle(item.title, 30), 38, y)
    y += 35
  })

  // 뉴스 카드 2
  ctx.fillStyle = "rgba(255,255,255,0.97)"
  ctx.beginPath()
  ctx.roundRect(15, 405, width - 30, 260, 18)
  ctx.fill()

  ctx.fillStyle = "#0a3d62"
  ctx.font = "bold 18px sans-serif"
  ctx.fillText("📋 추가 뉴스", 38, 440)

  y = 475
  news.slice(6, 12).forEach((item) => {
    ctx.fillStyle = "#333"
    ctx.font = "13px sans-serif"
    ctx.fillText("• " + truncateTitle(item.title, 30), 38, y)
    y += 35
  })

  // 주식
  ctx.fillStyle = "rgba(255,255,255,0.97)"
  ctx.beginPath()
  ctx.roundRect(15, height - 110, width - 30, 85, 18)
  ctx.fill()

  const stockW = (width - 60) / 3
  const stocks = [
    { label: "KOSPI", val: "3,926", chg: "▼60", color: "#3182ce" },
    { label: "KOSDAQ", val: "912", chg: "▲32", color: "#e53e3e" },
    { label: "환율", val: "1,470", chg: "▲7", color: "#e53e3e" },
  ]
  stocks.forEach((s, i) => {
    const x = 30 + i * stockW
    ctx.textAlign = "center"
    ctx.fillStyle = "#0a3d62"
    ctx.font = "bold 13px sans-serif"
    ctx.fillText(s.label, x + stockW / 2, height - 78)
    ctx.font = "bold 20px sans-serif"
    ctx.fillText(s.val, x + stockW / 2, height - 52)
    ctx.fillStyle = s.color
    ctx.font = "12px sans-serif"
    ctx.fillText(s.chg, x + stockW / 2, height - 32)
  })
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
  ctx.fillStyle = "rgba(255,255,255,0.07)"
  for (let i = 0; i < 25; i++) {
    ctx.beginPath()
    ctx.ellipse(
      Math.random() * width,
      Math.random() * height,
      20 + Math.random() * 35,
      10 + Math.random() * 18,
      Math.random() * Math.PI,
      0,
      Math.PI * 2,
    )
    ctx.fill()
  }

  // 상단 바
  ctx.fillStyle = "rgba(255,255,255,0.97)"
  ctx.fillRect(0, 0, width, 85)

  drawProfile(ctx, 50, 42, 32, user.profileImage, "#56ab91")

  ctx.fillStyle = "#1b4332"
  ctx.font = "bold 20px sans-serif"
  ctx.fillText(user.name, 95, 38)
  ctx.font = "13px sans-serif"
  ctx.fillStyle = "#56ab91"
  ctx.fillText(user.phone, 95, 58)

  ctx.textAlign = "right"
  ctx.font = "14px sans-serif"
  ctx.fillStyle = "#1b4332"
  ctx.fillText("🌿 " + getDateString(), width - 20, 48)
  ctx.textAlign = "left"

  // 메인 뉴스 카드
  ctx.fillStyle = "rgba(255,255,255,0.95)"
  ctx.beginPath()
  ctx.roundRect(20, 105, width - 40, height - 200, 22)
  ctx.fill()

  // 세로 장식
  ctx.fillStyle = "#56ab91"
  ctx.fillRect(45, 130, 4, height - 260)

  ctx.fillStyle = "#1b4332"
  ctx.font = "bold 22px sans-serif"
  ctx.fillText("Today's News", 65, 165)
  ctx.font = "12px sans-serif"
  ctx.fillStyle = "#666"
  ctx.fillText("매일 오후 9시 업데이트", 65, 188)

  let y = 225
  news.slice(0, 13).forEach((item, i) => {
    if (y > height - 230) return
    ctx.fillStyle = i < 3 ? "#2d6a4f" : "#444"
    ctx.font = i < 3 ? "bold 14px sans-serif" : "13px sans-serif"
    ctx.fillText(truncateTitle(item.title, 30), 65, y)
    y += 34
  })

  // 하단 주식
  ctx.fillStyle = "rgba(255,255,255,0.95)"
  ctx.beginPath()
  ctx.roundRect(20, height - 80, width - 40, 60, 16)
  ctx.fill()

  ctx.textAlign = "center"
  ctx.fillStyle = "#1b4332"
  ctx.font = "13px sans-serif"
  ctx.fillText("KOSPI 3,926 ▼60  │  KOSDAQ 912 ▲32  │  환율 1,470 ▲7", width / 2, height - 42)
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

  // 태양 장식
  ctx.beginPath()
  ctx.arc(width - 80, 110, 80, 0, Math.PI * 2)
  ctx.fillStyle = "rgba(255,255,200,0.35)"
  ctx.fill()
  ctx.beginPath()
  ctx.arc(width - 80, 110, 50, 0, Math.PI * 2)
  ctx.fillStyle = "rgba(255,255,220,0.5)"
  ctx.fill()

  // 프로필 카드
  ctx.fillStyle = "rgba(255,255,255,0.97)"
  ctx.beginPath()
  ctx.roundRect(15, 15, width - 30, 95, 18)
  ctx.fill()

  drawProfile(ctx, 65, 62, 35, user.profileImage, "#ff8a65")

  ctx.fillStyle = "#bf360c"
  ctx.font = "bold 22px sans-serif"
  ctx.fillText(user.name, 115, 52)
  ctx.font = "14px sans-serif"
  ctx.fillStyle = "#ff7043"
  ctx.fillText(user.phone, 115, 78)

  ctx.textAlign = "right"
  ctx.fillStyle = "#bf360c"
  ctx.font = "14px sans-serif"
  ctx.fillText("☀️ 서울 8° | 부산 16°", width - 30, 60)
  ctx.textAlign = "left"

  // 뉴스 카드
  ctx.fillStyle = "rgba(255,255,255,0.97)"
  ctx.beginPath()
  ctx.roundRect(15, 125, width - 30, height - 225, 22)
  ctx.fill()

  ctx.fillStyle = "#bf360c"
  ctx.font = "bold 22px sans-serif"
  ctx.fillText("🌅 Today's News", 40, 165)
  ctx.textAlign = "right"
  ctx.font = "12px sans-serif"
  ctx.fillStyle = "#888"
  ctx.fillText(getDateString(), width - 40, 165)
  ctx.textAlign = "left"

  // 구분선
  ctx.strokeStyle = "#ffccbc"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(40, 182)
  ctx.lineTo(width - 40, 182)
  ctx.stroke()

  let y = 215
  news.slice(0, 12).forEach((item, i) => {
    if (y > height - 250) return
    ctx.fillStyle = i < 2 ? "#c73e1d" : "#444"
    ctx.font = i < 2 ? "bold 14px sans-serif" : "13px sans-serif"
    ctx.fillText("• " + truncateTitle(item.title, 32), 40, y)
    y += 36
  })

  // 주식
  ctx.fillStyle = "rgba(255,255,255,0.97)"
  ctx.beginPath()
  ctx.roundRect(15, height - 85, width - 30, 65, 16)
  ctx.fill()

  ctx.textAlign = "center"
  ctx.fillStyle = "#bf360c"
  ctx.font = "bold 14px sans-serif"
  ctx.fillText("KOSPI 3,926 ▼60", width / 4, height - 45)
  ctx.fillText("KOSDAQ 912 ▲32", width / 2, height - 45)
  ctx.fillText("환율 1,470 ▲7", (width / 4) * 3, height - 45)
  ctx.textAlign = "left"
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
    default:
      renderCityNight(ctx, width, height, news, user)
  }
}

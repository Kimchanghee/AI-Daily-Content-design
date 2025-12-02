import type { ZodiacFortune } from "./fortune-types"
import type { UserInfo } from "./template-types"

const getDateString = () => {
  const today = new Date()
  const days = ["일", "월", "화", "수", "목", "금", "토"]
  return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}. (${days[today.getDay()]})`
}

// 텍스트 줄바꿈 처리
const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const words = text.split("")
  const lines: string[] = []
  let currentLine = ""

  for (const char of words) {
    const testLine = currentLine + char
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = char
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) {
    lines.push(currentLine)
  }
  return lines
}

// 프로필 그리기
const drawProfile = (
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

// 띠별 동물 아이콘 그리기
const drawZodiacIcon = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  zodiacId: string
) => {
  // 각 띠별 동물 한자/이모지 스타일 아이콘
  const zodiacSymbols: Record<string, { char: string; color: string }> = {
    rat: { char: "子", color: "#4b5563" },
    ox: { char: "丑", color: "#78350f" },
    tiger: { char: "寅", color: "#ea580c" },
    rabbit: { char: "卯", color: "#ec4899" },
    dragon: { char: "辰", color: "#2563eb" },
    snake: { char: "巳", color: "#059669" },
    horse: { char: "午", color: "#dc2626" },
    sheep: { char: "未", color: "#8b5cf6" },
    monkey: { char: "申", color: "#d97706" },
    rooster: { char: "酉", color: "#be123c" },
    dog: { char: "戌", color: "#854d0e" },
    pig: { char: "亥", color: "#db2777" },
  }

  const symbol = zodiacSymbols[zodiacId] || { char: "?", color: "#6b7280" }

  ctx.save()
  ctx.font = "bold 22px 'Noto Sans KR', serif"
  ctx.fillStyle = symbol.color
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(symbol.char, x, y)
  ctx.restore()
}

// 띠별운세 캔버스 렌더링
export const renderFortuneTemplate = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fortunes: ZodiacFortune[],
  user: UserInfo
) => {
  // 배경 그라데이션 (따뜻한 느낌)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height)
  bgGrad.addColorStop(0, "#fef7ed")
  bgGrad.addColorStop(0.5, "#fef3e2")
  bgGrad.addColorStop(1, "#fde8d0")
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 상단 프로필 영역
  ctx.fillStyle = "rgba(255,255,255,0.95)"
  ctx.beginPath()
  ctx.roundRect(15, 12, width - 30, 65, 14)
  ctx.fill()
  ctx.strokeStyle = "#f97316"
  ctx.lineWidth = 2
  ctx.stroke()

  // 프로필 이미지
  drawProfile(ctx, 50, 44, 22, user.profileImage, "#f97316")

  // 이름과 전화번호
  ctx.fillStyle = "#c2410c"
  ctx.font = "bold 16px 'Noto Sans KR', sans-serif"
  ctx.fillText(user.name, 82, 38)
  ctx.font = "11px sans-serif"
  ctx.fillStyle = "#ea580c"
  ctx.fillText(user.phone, 82, 54)

  // 브랜드 문장
  if (user.brandPhrase) {
    ctx.fillStyle = "#9a3412"
    ctx.font = "9px sans-serif"
    ctx.fillText(user.brandPhrase, 82, 68)
  }

  // 날짜
  ctx.textAlign = "right"
  ctx.font = "10px sans-serif"
  ctx.fillStyle = "#c2410c"
  ctx.fillText(getDateString(), width - 22, 44)
  ctx.textAlign = "left"

  // 제목 영역
  ctx.fillStyle = "#c2410c"
  ctx.font = "bold 18px 'Noto Sans KR', sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("오늘의 띠별운세", width / 2, 100)
  ctx.textAlign = "left"

  // 운세 카드 그리드 (2열 6행) - 간격 최적화
  const cardWidth = (width - 45) / 2
  const cardHeight = 125
  const startY = 115
  const gapX = 8
  const gapY = 6

  fortunes.forEach((fortune, index) => {
    const col = index % 2
    const row = Math.floor(index / 2)
    const x = 15 + col * (cardWidth + gapX)
    const y = startY + row * (cardHeight + gapY)

    // 카드 배경
    ctx.fillStyle = "rgba(255,255,255,0.95)"
    ctx.beginPath()
    ctx.roundRect(x, y, cardWidth, cardHeight, 10)
    ctx.fill()

    // 카드 테두리
    ctx.strokeStyle = "#fed7aa"
    ctx.lineWidth = 1
    ctx.stroke()

    // 띠 아이콘 배경 원
    const iconX = x + 24
    const iconY = y + 26
    ctx.beginPath()
    ctx.arc(iconX, iconY, 18, 0, Math.PI * 2)
    ctx.fillStyle = "#fff7ed"
    ctx.fill()
    ctx.strokeStyle = "#fdba74"
    ctx.lineWidth = 1.5
    ctx.stroke()

    // 띠 동물 아이콘 그리기
    drawZodiacIcon(ctx, iconX, iconY, fortune.id)

    // 띠 이름
    ctx.fillStyle = "#1f2937"
    ctx.font = "bold 12px 'Noto Sans KR', sans-serif"
    ctx.fillText(fortune.name, x + 48, y + 20)

    // 출생년도 표시
    ctx.font = "8px sans-serif"
    ctx.fillStyle = "#6b7280"
    const yearsStr = fortune.years.slice(-4).map((yr) => String(yr).slice(-2)).join(", ") + "년생"
    ctx.fillText(yearsStr, x + 48, y + 33)

    // 운세 내용 (줄바꿈 처리) - 3줄로 제한
    ctx.font = "10px 'Noto Sans KR', sans-serif"
    ctx.fillStyle = "#374151"
    const maxTextWidth = cardWidth - 16
    const lines = wrapText(ctx, fortune.fortune, maxTextWidth)

    lines.slice(0, 5).forEach((line, lineIndex) => {
      ctx.fillText(line, x + 8, y + 52 + lineIndex * 14)
    })
  })

  // 하단 정보
  ctx.fillStyle = "rgba(255,255,255,0.9)"
  ctx.beginPath()
  ctx.roundRect(15, height - 42, width - 30, 30, 10)
  ctx.fill()

  ctx.textAlign = "center"
  ctx.fillStyle = "#9a3412"
  ctx.font = "10px sans-serif"
  ctx.fillText("운세 정보는 참고용이며, 자세한 정보는 포춘82에서 확인하세요.", width / 2, height - 22)
  ctx.textAlign = "left"
}

// 미니 프리뷰 렌더링
export const renderFortuneMiniPreview = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fortunes: ZodiacFortune[],
  user: UserInfo
) => {
  const scaleX = width / 540
  const scaleY = height / 960

  ctx.save()
  ctx.scale(scaleX, scaleY)
  renderFortuneTemplate(ctx, 540, 960, fortunes, user)
  ctx.restore()
}

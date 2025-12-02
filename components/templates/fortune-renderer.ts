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
  ctx.roundRect(15, 15, width - 30, 75, 16)
  ctx.fill()
  ctx.strokeStyle = "#f97316"
  ctx.lineWidth = 2
  ctx.stroke()

  // 프로필 이미지
  drawProfile(ctx, 55, 52, 28, user.profileImage, "#f97316")

  // 이름과 전화번호
  ctx.fillStyle = "#c2410c"
  ctx.font = "bold 18px 'Noto Sans KR', sans-serif"
  ctx.fillText(user.name, 95, 45)
  ctx.font = "12px sans-serif"
  ctx.fillStyle = "#ea580c"
  ctx.fillText(user.phone, 95, 65)

  // 브랜드 문장
  if (user.brandPhrase) {
    ctx.fillStyle = "#c2410c"
    ctx.font = "10px sans-serif"
    ctx.fillText(user.brandPhrase, 95, 80)
  }

  // 날짜
  ctx.textAlign = "right"
  ctx.font = "11px sans-serif"
  ctx.fillStyle = "#c2410c"
  ctx.fillText(getDateString(), width - 28, 52)
  ctx.textAlign = "left"

  // 제목 영역
  ctx.fillStyle = "#c2410c"
  ctx.font = "bold 20px 'Noto Sans KR', sans-serif"
  ctx.textAlign = "center"
  ctx.fillText("오늘의 띠별운세", width / 2, 120)
  ctx.textAlign = "left"

  // 운세 카드 그리드 (2열 6행)
  const cardWidth = (width - 50) / 2
  const cardHeight = 120
  const startY = 140
  const gap = 10

  fortunes.forEach((fortune, index) => {
    const col = index % 2
    const row = Math.floor(index / 2)
    const x = 15 + col * (cardWidth + gap)
    const y = startY + row * (cardHeight + gap)

    // 카드 배경
    ctx.fillStyle = "rgba(255,255,255,0.95)"
    ctx.beginPath()
    ctx.roundRect(x, y, cardWidth, cardHeight, 12)
    ctx.fill()

    // 카드 테두리
    ctx.strokeStyle = "#fed7aa"
    ctx.lineWidth = 1
    ctx.stroke()

    // 띠 아이콘 배경 원
    ctx.beginPath()
    ctx.arc(x + 28, y + 28, 20, 0, Math.PI * 2)
    ctx.fillStyle = "#fff7ed"
    ctx.fill()
    ctx.strokeStyle = "#fdba74"
    ctx.lineWidth = 2
    ctx.stroke()

    // 띠 이름과 출생년도
    ctx.fillStyle = "#1f2937"
    ctx.font = "bold 13px 'Noto Sans KR', sans-serif"
    ctx.fillText(fortune.name, x + 55, y + 22)

    // 출생년도 표시
    ctx.font = "9px sans-serif"
    ctx.fillStyle = "#6b7280"
    const yearsStr = fortune.years.slice(-4).map((y) => String(y).slice(-2)).join(", ") + "년생"
    ctx.fillText(yearsStr, x + 55, y + 36)

    // 운세 내용 (줄바꿈 처리)
    ctx.font = "11px 'Noto Sans KR', sans-serif"
    ctx.fillStyle = "#374151"
    const maxTextWidth = cardWidth - 20
    const lines = wrapText(ctx, fortune.fortune, maxTextWidth)

    lines.slice(0, 4).forEach((line, lineIndex) => {
      ctx.fillText(line, x + 10, y + 58 + lineIndex * 15)
    })
  })

  // 하단 정보
  ctx.fillStyle = "rgba(255,255,255,0.9)"
  ctx.beginPath()
  ctx.roundRect(15, height - 50, width - 30, 35, 12)
  ctx.fill()

  ctx.textAlign = "center"
  ctx.fillStyle = "#9a3412"
  ctx.font = "11px sans-serif"
  ctx.fillText("운세 정보는 참고용이며, 자세한 정보는 포춘82에서 확인하세요.", width / 2, height - 27)
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

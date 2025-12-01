"use client"

import { useRef, useEffect, useState } from "react"
import { type TemplateData, templateStyles, type TemplateStyleId, shortenTitle } from "@/lib/template-formatter"

interface TemplatePreviewProps {
  data: TemplateData
  styleId: TemplateStyleId
  width?: number
  height?: number
  onDownload?: () => void
}

export default function TemplatePreview({ data, styleId, width = 540, height = 960 }: TemplatePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRendered, setIsRendered] = useState(false)
  const style = templateStyles[styleId]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 배경 그라데이션
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    style.gradient.forEach((color, i) => {
      gradient.addColorStop(i / (style.gradient.length - 1), color)
    })
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // 도시 배경 이미지 효과 (반투명 오버레이)
    drawCityBackground(ctx, width, height)

    // 헤더 (프로필 + 날씨)
    drawHeader(ctx, data, style, width)

    // 뉴스 카드
    drawNewsCard(ctx, data, style, width, height)

    // 주식 정보
    drawStockInfo(ctx, data, style, width, height)

    // 하단 프로필
    drawFooter(ctx, data, style, width, height)

    setIsRendered(true)
  }, [data, style, width, height])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `daily-news-${styleId}-${Date.now()}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full max-w-[400px] h-auto border border-gray-300 rounded-xl shadow-2xl"
      />
      {isRendered && (
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          이미지 다운로드
        </button>
      )}
    </div>
  )
}

function drawCityBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // 하단 도시 스카이라인 실루엣
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)"

  // 빌딩들
  const buildings = [
    { x: 0, w: 40, h: 200 },
    { x: 45, w: 35, h: 280 },
    { x: 85, w: 50, h: 220 },
    { x: 140, w: 30, h: 350 },
    { x: 175, w: 45, h: 260 },
    { x: 225, w: 55, h: 320 },
    { x: 285, w: 40, h: 240 },
    { x: 330, w: 50, h: 380 },
    { x: 385, w: 35, h: 290 },
    { x: 425, w: 45, h: 250 },
    { x: 475, w: 40, h: 310 },
    { x: 520, w: 30, h: 270 },
  ]

  buildings.forEach((b) => {
    ctx.fillRect(b.x, height - b.h, b.w, b.h)
  })
}

function drawHeader(
  ctx: CanvasRenderingContext2D,
  data: TemplateData,
  style: (typeof templateStyles)[TemplateStyleId],
  width: number,
) {
  const headerY = 20
  const padding = 20

  // 프로필 원 (왼쪽)
  const profileSize = 70
  const profileX = padding + profileSize / 2
  const profileY = headerY + profileSize / 2 + 10

  // 프로필 원 배경
  ctx.fillStyle = "#cccccc"
  ctx.beginPath()
  ctx.arc(profileX, profileY, profileSize / 2, 0, Math.PI * 2)
  ctx.fill()

  // 프로필 테두리
  ctx.strokeStyle = style.headerTextColor
  ctx.lineWidth = 2
  ctx.stroke()

  // 프로필 아이콘 (사람 모양)
  ctx.fillStyle = "#888888"
  ctx.beginPath()
  ctx.arc(profileX, profileY - 10, 15, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(profileX, profileY + 25, 25, Math.PI, 0)
  ctx.fill()

  // 사용자 정보 (프로필 오른쪽)
  const infoX = padding + profileSize + 20

  ctx.fillStyle = style.headerTextColor
  ctx.font = "bold 18px 'Noto Sans KR', sans-serif"
  ctx.fillText(`${data.userInfo.name} ${data.userInfo.title || "사업단장"}`, infoX, headerY + 35)

  ctx.font = "14px 'Noto Sans KR', sans-serif"
  ctx.fillStyle = "#4ade80"
  ctx.fillText("📞", infoX, headerY + 58)
  ctx.fillStyle = style.headerTextColor
  ctx.fillText(` ${data.userInfo.phone || "010-0000-0000"}`, infoX + 18, headerY + 58)

  if (data.userInfo.instagram) {
    ctx.fillStyle = style.headerTextColor
    ctx.fillText(`📷 ${data.userInfo.instagram}`, infoX, headerY + 80)
  }

  // 날씨 정보 (오른쪽)
  const weatherX = width - 140

  // 서울 날씨
  ctx.fillStyle = style.headerTextColor
  ctx.font = "12px sans-serif"
  ctx.textAlign = "center"

  // 날씨 아이콘 (해)
  ctx.font = "24px sans-serif"
  ctx.fillText("☀️", weatherX, headerY + 40)
  ctx.font = "12px sans-serif"
  ctx.fillText(`서울 ${data.weather.seoul}°`, weatherX, headerY + 60)

  // 부산 날씨
  ctx.font = "24px sans-serif"
  ctx.fillText("⛅", weatherX + 70, headerY + 40)
  ctx.font = "12px sans-serif"
  ctx.fillText(`부산 ${data.weather.busan}°`, weatherX + 70, headerY + 60)

  ctx.textAlign = "left"
}

function drawNewsCard(
  ctx: CanvasRenderingContext2D,
  data: TemplateData,
  style: (typeof templateStyles)[TemplateStyleId],
  width: number,
  height: number,
) {
  const cardX = 20
  const cardY = 110
  const cardWidth = width - 40
  const cardHeight = height - 320
  const cardPadding = 20
  const cornerRadius = 15

  // 둥근 모서리 카드 배경
  ctx.fillStyle = style.cardBg
  ctx.beginPath()
  ctx.roundRect(cardX, cardY, cardWidth, cardHeight, cornerRadius)
  ctx.fill()

  // 카드 그림자
  ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
  ctx.shadowBlur = 10
  ctx.shadowOffsetY = 5

  // 제목 "Today's News"
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0
  ctx.fillStyle = style.textColor
  ctx.font = "bold 22px 'Times New Roman', serif"
  ctx.fillText("Today's News", cardX + cardPadding, cardY + 40)

  // 날짜
  ctx.font = "14px sans-serif"
  ctx.fillStyle = "#666666"
  ctx.textAlign = "right"
  ctx.fillText(data.date, cardX + cardWidth - cardPadding, cardY + 40)
  ctx.textAlign = "left"

  // 구분선
  ctx.strokeStyle = "#e0e0e0"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cardX + cardPadding, cardY + 55)
  ctx.lineTo(cardX + cardWidth - cardPadding, cardY + 55)
  ctx.stroke()

  // 뉴스 목록
  let newsY = cardY + 85
  const lineHeight = 42
  const maxNewsWidth = cardWidth - cardPadding * 2 - 15

  data.news.slice(0, 11).forEach((news, index) => {
    if (newsY > cardY + cardHeight - 30) return

    // 첫 3개는 하이라이트 색상
    if (index < 3) {
      ctx.fillStyle = style.accentColors[index] || style.textColor
      ctx.font = "bold 14px 'Noto Sans KR', sans-serif"
    } else {
      ctx.fillStyle = style.textColor
      ctx.font = "14px 'Noto Sans KR', sans-serif"
    }

    const shortTitle = shortenTitle(news.title, 38)

    // 불릿 포인트
    ctx.fillText("•", cardX + cardPadding, newsY)

    // 뉴스 제목 (줄바꿈 처리)
    const words = shortTitle.split(" ")
    let line = ""
    let currentY = newsY

    words.forEach((word, i) => {
      const testLine = line + word + " "
      const metrics = ctx.measureText(testLine)

      if (metrics.width > maxNewsWidth && line !== "") {
        ctx.fillText(line.trim(), cardX + cardPadding + 15, currentY)
        line = word + " "
        currentY += 18
      } else {
        line = testLine
      }
    })
    ctx.fillText(line.trim(), cardX + cardPadding + 15, currentY)

    newsY += lineHeight
  })
}

function drawStockInfo(
  ctx: CanvasRenderingContext2D,
  data: TemplateData,
  style: (typeof templateStyles)[TemplateStyleId],
  width: number,
  height: number,
) {
  const stockY = height - 190
  const stockHeight = 90
  const padding = 20
  const boxWidth = (width - padding * 2 - 20) / 3
  const cornerRadius = 10

  const stocks = [
    { label: "KOSPI", ...data.stocks.kospi },
    { label: "KOSDAQ", ...data.stocks.kosdaq },
    { label: "환율", ...data.stocks.exchange },
  ]

  stocks.forEach((stock, index) => {
    const boxX = padding + index * (boxWidth + 10)

    // 박스 배경
    ctx.fillStyle = style.stockBoxBg
    ctx.beginPath()
    ctx.roundRect(boxX, stockY, boxWidth, stockHeight, cornerRadius)
    ctx.fill()

    // 라벨
    ctx.fillStyle = "#333333"
    ctx.font = "bold 14px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(stock.label, boxX + boxWidth / 2, stockY + 25)

    // 값
    ctx.font = "bold 20px sans-serif"
    ctx.fillStyle = "#000000"
    ctx.fillText(stock.value, boxX + boxWidth / 2, stockY + 55)

    // 변동
    ctx.font = "14px sans-serif"
    ctx.fillStyle = stock.isUp ? "#ef4444" : "#3b82f6"
    ctx.fillText(`${stock.isUp ? "▲" : "▼"} ${stock.change}`, boxX + boxWidth / 2, stockY + 78)
  })

  ctx.textAlign = "left"
}

function drawFooter(
  ctx: CanvasRenderingContext2D,
  data: TemplateData,
  style: (typeof templateStyles)[TemplateStyleId],
  width: number,
  height: number,
) {
  const footerY = height - 80
  const padding = 20

  // 프로필 작은 원
  const smallProfileSize = 50
  ctx.fillStyle = "#cccccc"
  ctx.beginPath()
  ctx.arc(padding + smallProfileSize / 2, footerY + 10, smallProfileSize / 2, 0, Math.PI * 2)
  ctx.fill()

  // 프로필 아이콘
  ctx.fillStyle = "#888888"
  ctx.beginPath()
  ctx.arc(padding + smallProfileSize / 2, footerY + 2, 10, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(padding + smallProfileSize / 2, footerY + 25, 18, Math.PI, 0)
  ctx.fill()

  // 이름과 시간
  ctx.fillStyle = style.headerTextColor
  ctx.font = "bold 14px sans-serif"
  ctx.fillText(data.userInfo.name || "담당자", padding + smallProfileSize + 15, footerY + 8)

  ctx.font = "12px sans-serif"
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
  ctx.fillText("방금 전", padding + smallProfileSize + 15, footerY + 28)

  // 하단 메시지 입력창 스타일
  const inputY = footerY + 45
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
  ctx.beginPath()
  ctx.roundRect(padding, inputY, width - padding * 2 - 50, 30, 15)
  ctx.fill()

  ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
  ctx.font = "12px sans-serif"
  ctx.fillText("1:1 채팅방으로 메시지 보내기", padding + 15, inputY + 20)

  // 하트 아이콘
  ctx.font = "20px sans-serif"
  ctx.fillText("♡", width - padding - 30, inputY + 22)
}

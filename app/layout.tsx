import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Daily Content - 영업직군을 위한 AI 이미지 뉴스 제작 서비스",
  description:
    "영업 전문가를 위한 AI 기반 이미지형 뉴스 자동 제작 및 텔레그램 발송 서비스. 매일 고객에게 가치있는 콘텐츠를 전달하세요.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  )
}

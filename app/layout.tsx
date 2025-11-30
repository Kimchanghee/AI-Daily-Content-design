import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "보험사 데일리 메시지 - 최신 뉴스를 고객에게 전달",
  description:
    "보험 영업 전문가를 위한 데일리 메시지 서비스. 최신 뉴스를 선택한 템플릿으로 고객에게 자동 발송하세요. 3일 무료 체험.",
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

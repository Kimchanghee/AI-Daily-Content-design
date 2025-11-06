"use client"

import { Mail, MessageCircle, Instagram } from "lucide-react"

const footerLinks = {
  제품: ["기능", "요금제", "보안", "로드맵"],
  회사: ["소개", "블로그", "채용", "문의"],
  법률: ["개인정보처리방침", "이용약관", "쿠키 정책", "컴플라이언스"],
  지원: ["문서", "API", "가이드", "고객지원"],
}

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background px-4 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">AI</span>
              </div>
              <span className="text-lg font-bold text-foreground">AI Daily Content</span>
            </div>
            <p className="text-xs text-muted-foreground">
              매일 꾸준한 SNS 콘텐츠를 AI가 자동으로 생성하는 구독형 서비스
            </p>
          </div>

          {/* Link Groups */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 text-sm font-semibold text-foreground">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-muted-foreground">© 2025 AI Daily Content. All rights reserved.</p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="#"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
                aria-label="Telegram"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="#"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

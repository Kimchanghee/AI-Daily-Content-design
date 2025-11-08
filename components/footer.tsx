"use client"

import { useState, useEffect } from "react"
import { getTranslation, type Locale } from "@/lib/i18n"

export default function Footer() {
  const [locale, setLocale] = useState<Locale>("ko")

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale) {
      setLocale(savedLocale)
    }
  }, [])

  const t = (key: keyof typeof import("@/lib/i18n").translations.ko) => getTranslation(locale, key)

  const footerLinks = {
    [t("product")]: [t("features"), t("pricing"), t("security"), t("roadmap")],
    [t("company")]: [t("about"), t("blog"), t("careers"), t("contact")],
    [t("legal")]: [t("privacy"), t("terms"), t("cookies"), t("compliance")],
    [t("support")]: [t("docs"), "API", t("guides"), t("customerSupport")],
  }

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
            <p className="text-xs text-muted-foreground">{t("footerDescription")}</p>
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
            <p className="text-xs text-muted-foreground">© 2025 AI Daily Content. {t("allRightsReserved")}.</p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="#"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors text-lg"
                aria-label="Instagram"
              >
                📷
              </a>
              <a
                href="#"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors text-lg"
                aria-label="Telegram"
              >
                💬
              </a>
              <a
                href="#"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors text-lg"
                aria-label="Email"
              >
                ✉️
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

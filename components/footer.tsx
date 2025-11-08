"use client"

import { useState, useEffect } from "react"
import { getTranslation, type Locale } from "@/lib/i18n"

export default function Footer() {
  const [locale, setLocale] = useState<Locale>("ko")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("locale") as Locale
      if (savedLocale) {
        setLocale(savedLocale)
      }
    }

    const handleLocaleChange = () => {
      if (typeof window !== "undefined") {
        const newLocale = localStorage.getItem("locale") as Locale
        if (newLocale) {
          setLocale(newLocale)
        }
      }
    }

    window.addEventListener("localeChange", handleLocaleChange)

    return () => {
      window.removeEventListener("localeChange", handleLocaleChange)
    }
  }, [])

  const t = (key: keyof typeof import("@/lib/i18n").translations.ko) => getTranslation(locale, key)

  const footerLinks = {
    [t("product")]: [t("features"), t("pricing"), t("security"), t("roadmap")],
    [t("company")]: [t("about"), t("blog"), t("careers"), t("contact")],
    [t("legal")]: [t("privacy"), t("terms"), t("cookies"), t("compliance")],
    [t("support")]: [t("docs"), "API", t("guides"), t("customerSupport")],
  }

  if (!mounted) {
    return null
  }

  return (
    <footer className="border-t border-border bg-background px-4 py-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:gap-8 grid-cols-1">
          {/* Brand */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                <span className="text-white text-base font-bold">AI</span>
              </div>
              <span className="text-base font-bold text-foreground">AI Daily Content</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-md">{t("footerDescription")}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="mb-2 text-xs font-semibold text-foreground">{category}</h4>
                <ul className="space-y-1.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-xs text-muted-foreground hover:text-accent transition-colors block">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-8 border-t border-border pt-6">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <p className="text-xs text-muted-foreground text-center md:text-left">
              © 2025 AI Daily Content. {t("allRightsReserved")}.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              <a
                href="#"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors text-base"
                aria-label="Instagram"
              >
                📷
              </a>
              <a
                href="#"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors text-base"
                aria-label="Telegram"
              >
                💬
              </a>
              <a
                href="#"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors text-base"
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

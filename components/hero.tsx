"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { getTranslation, type Locale } from "@/lib/i18n"

export default function Hero() {
  const [locale, setLocale] = useState<Locale>("ko")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLocale = (typeof window !== "undefined" && localStorage.getItem("locale")) as Locale
    if (savedLocale) {
      setLocale(savedLocale)
    }

    const handleLocaleChange = () => {
      const newLocale = (typeof window !== "undefined" && localStorage.getItem("locale")) as Locale
      if (newLocale) {
        setLocale(newLocale)
      }
    }

    window.addEventListener("localeChange", handleLocaleChange)

    return () => {
      window.removeEventListener("localeChange", handleLocaleChange)
    }
  }, [])

  if (!mounted) {
    return null
  }

  const t = (key: keyof typeof import("@/lib/i18n").translations.ko) => getTranslation(locale, key)

  const userTypes = [t("insurance"), t("realEstate"), t("finance"), t("b2bSales")]

  return (
    <section className="relative overflow-hidden bg-background px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32 lg:py-40 xl:py-48 pt-24 sm:pt-32">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 sm:px-4 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">{t("badge")}</span>
          </div>

          {/* Title */}
          <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-balance leading-tight">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("heroTitle1")}
            </span>
            <br />
            <span className="text-foreground">{t("heroTitle2")}</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl mx-auto text-balance leading-relaxed px-2">
            {t("heroDescription")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12 px-4 sm:px-0">
            <Button
              size="lg"
              className="px-8 py-4 sm:py-3 text-base sm:text-lg bg-gradient-to-r from-primary to-accent text-accent-foreground hover:opacity-90 transform hover:scale-105 transition-all shadow-lg min-h-[48px]"
            >
              {t("start7DayTrial")}
              <span className="ml-2">→</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 sm:py-3 text-base sm:text-lg border-border hover:bg-muted/50 bg-transparent min-h-[48px]"
            >
              {t("viewIntro")}
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-muted-foreground">{t("alreadyUsedBy")}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8">
              {userTypes.map((user) => (
                <div key={user} className="text-xs sm:text-sm font-semibold text-muted-foreground opacity-60 px-2">
                  {user}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

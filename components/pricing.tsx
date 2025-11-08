"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { getTranslation, type Locale } from "@/lib/i18n"

export default function Pricing() {
  const [locale, setLocale] = useState<Locale>("ko")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLocale = typeof window !== "undefined" ? localStorage.getItem("locale") : null
    if (savedLocale && (savedLocale === "ko" || savedLocale === "en" || savedLocale === "ja")) {
      setLocale(savedLocale as Locale)
    }

    const handleLocaleChange = () => {
      const newLocale = typeof window !== "undefined" ? localStorage.getItem("locale") : null
      if (newLocale && (newLocale === "ko" || newLocale === "en" || newLocale === "ja")) {
        setLocale(newLocale as Locale)
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

  const features = [
    t("unlimitedNews"),
    t("aiImageCreation"),
    t("telegramIntegration"),
    t("customerGroupManagement"),
    t("scheduledSending"),
    t("advancedAnalytics"),
    t("prioritySupport"),
    t("customTemplates"),
  ]

  return (
    <section id="요금제" className="bg-card/30 px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto mb-12 sm:mb-16 max-w-2xl text-center">
          <h2 className="section-title mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {t("pricingTitle")}
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-3 sm:mb-4"></div>
          <p className="section-subtitle text-base sm:text-lg px-4">{t("pricingSubtitle")}</p>
        </div>

        <div className="max-w-md mx-auto px-2 sm:px-4">
          <Card className="border-2 border-accent bg-background/80 shadow-2xl ring-1 ring-accent/30 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-accent text-accent-foreground px-4 py-2 sm:py-2.5 text-center font-semibold text-sm">
              ⭐ {t("planName")}
            </div>

            <CardHeader className="px-4 sm:px-5 pt-5 sm:pt-6">
              <h3 className="mb-2 text-lg sm:text-xl font-bold text-foreground">{t("planName")}</h3>
              <p className="mb-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">{t("planDescription")}</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">₩19,800</span>
                <span className="text-xs sm:text-sm text-muted-foreground">{t("perMonth")}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 px-4 sm:px-5 pb-5 sm:pb-6">
              <Button className="w-full font-semibold text-sm sm:text-base bg-gradient-to-r from-primary to-accent text-accent-foreground hover:opacity-90 transform hover:scale-105 transition-all min-h-[44px]">
                {t("getStarted")} →
              </Button>

              <div className="space-y-2.5">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <span className="text-accent text-base sm:text-lg flex-shrink-0 mt-0.5">✓</span>
                    <span className="text-xs sm:text-sm text-foreground leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

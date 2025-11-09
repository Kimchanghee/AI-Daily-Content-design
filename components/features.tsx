"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getTranslation, type Locale } from "@/lib/i18n"

export default function Features() {
  const [locale, setLocale] = useState<Locale>("ko")
  const [mounted, setMounted] = useState(false)

  const handleLocaleChange = useCallback(() => {
    if (typeof window === "undefined") return
    const newLocale = localStorage.getItem("locale")
    if (newLocale && (newLocale === "ko" || newLocale === "en" || newLocale === "ja")) {
      setLocale(newLocale as Locale)
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    const savedLocale = typeof window !== "undefined" ? localStorage.getItem("locale") : null
    if (savedLocale && (savedLocale === "ko" || savedLocale === "en" || savedLocale === "ja")) {
      setLocale(savedLocale as Locale)
    }

    window.addEventListener("localeChange", handleLocaleChange)

    return () => {
      window.removeEventListener("localeChange", handleLocaleChange)
    }
  }, [handleLocaleChange])

  if (!mounted) {
    return null
  }

  const t = (key: keyof typeof import("@/lib/i18n").translations.ko) => getTranslation(locale, key)

  const features = [
    {
      icon: "✨",
      title: t("feature1Title"),
      description: t("feature1Desc"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: "🖼️",
      title: t("feature2Title"),
      description: t("feature2Desc"),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: "📤",
      title: t("feature3Title"),
      description: t("feature3Desc"),
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: "👥",
      title: t("feature4Title"),
      description: t("feature4Desc"),
      gradient: "from-orange-500 to-red-500",
    },
  ]

  return (
    <section id="기능" className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 sm:mb-16 max-w-2xl text-center">
          <h2 className="section-title mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {t("featuresTitle")}
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-3 sm:mb-4"></div>
          <p className="section-subtitle text-base sm:text-lg px-4">{t("featuresSubtitle")}</p>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-border bg-background/50 backdrop-blur-sm hover:border-accent/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-2"
            >
              <CardContent className="pt-6 sm:pt-8 px-4 sm:px-6">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transform hover:rotate-6 transition-transform text-2xl sm:text-3xl shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="mb-2 sm:mb-3 text-base sm:text-lg font-bold text-foreground leading-snug">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

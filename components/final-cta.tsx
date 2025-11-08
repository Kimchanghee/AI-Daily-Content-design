"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { getTranslation, type Locale } from "@/lib/i18n"

export default function FinalCTA() {
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

  if (!mounted) {
    return null
  }

  return (
    <section className="relative overflow-hidden px-4 py-8 md:py-12">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl animate-pulse" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <h2 className="section-title mb-4 md:mb-6">{t("ctaTitle")}</h2>
        <p className="section-subtitle mb-6 md:mb-8 text-balance">{t("ctaDescription")}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="px-8 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transform hover:scale-105 transition-all shadow-lg"
          >
            {t("startFreeTrial")} →
          </Button>
          <Button size="lg" variant="outline" className="px-8 border-border hover:bg-muted/50 bg-transparent">
            {t("bookConsultation")}
          </Button>
        </div>
      </div>
    </section>
  )
}

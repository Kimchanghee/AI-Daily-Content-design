"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCurrentUser, type User } from "@/lib/auth"
import LanguageSwitcher from "@/components/language-switcher"
import { getTranslation, type Locale } from "@/lib/i18n"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [locale, setLocale] = useState<Locale>("ko")

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }
    loadUser()

    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale) {
      setLocale(savedLocale)
    }

    const handleLocaleChange = () => {
      const newLocale = localStorage.getItem("locale") as Locale
      if (newLocale) {
        setLocale(newLocale)
      }
    }

    window.addEventListener("localeChange", handleLocaleChange)

    return () => {
      window.removeEventListener("localeChange", handleLocaleChange)
    }
  }, [])

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem("locale", newLocale)
  }

  const t = (key: keyof typeof import("@/lib/i18n").translations.ko) => getTranslation(locale, key)

  const navItems = [
    { label: t("features"), id: "기능" },
    { label: t("testimonials"), id: "후기" },
    { label: t("pricing"), id: "요금제" },
    { label: t("contact"), id: "문의" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white text-lg sm:text-xl font-bold">AI</span>
            </div>
            <span className="font-bold text-lg sm:text-xl text-foreground hidden sm:inline">AI Daily Content</span>
            <span className="font-bold text-base text-foreground sm:hidden">AI Daily</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-foreground hover:text-accent transition-colors font-medium text-sm xl:text-base relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher currentLocale={locale} onLocaleChange={handleLocaleChange} />

            {user ? (
              <Link href={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}>
                <Button
                  size="sm"
                  className="px-3 sm:px-6 py-2 sm:py-2.5 text-sm bg-gradient-to-r from-primary to-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-all shadow-md"
                >
                  <span className="hidden sm:inline">{t("dashboard")}</span>
                  <span className="sm:hidden">📊</span>
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="text-foreground hover:text-accent">
                    {t("login")}
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    size="sm"
                    className="px-3 sm:px-6 py-2 sm:py-2.5 text-sm bg-gradient-to-r from-primary to-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-all shadow-md whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">{t("startFreeTrial")}</span>
                    <span className="sm:hidden">무료 시작</span>
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-foreground hover:text-accent font-bold text-2xl min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-border animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-foreground hover:text-accent transition-colors font-medium py-2 px-3 rounded-lg hover:bg-muted/50"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              {!user && (
                <Link href="/auth/login" className="sm:hidden">
                  <Button variant="outline" className="w-full bg-transparent">
                    {t("login")}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

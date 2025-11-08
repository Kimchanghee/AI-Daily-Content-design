"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Locale } from "@/lib/i18n"

interface LanguageSwitcherProps {
  currentLocale: Locale
  onLocaleChange: (locale: Locale) => void
}

export default function LanguageSwitcher({ currentLocale, onLocaleChange }: LanguageSwitcherProps) {
  const languageNames: Record<Locale, string> = {
    ko: "한국어",
    en: "English",
    ja: "日本語",
  }

  const handleLocaleChange = (locale: Locale) => {
    onLocaleChange(locale)
    window.dispatchEvent(new CustomEvent("localeChange"))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <span>🌐</span>
          <span className="text-sm">{languageNames[currentLocale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLocaleChange("ko")} className="cursor-pointer">
          한국어
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLocaleChange("en")} className="cursor-pointer">
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLocaleChange("ja")} className="cursor-pointer">
          日本語
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// 띠별운세 타입 정의

export interface ZodiacFortune {
  id: string
  name: string // 띠 이름 (쥐띠, 소띠 등)
  animal: string // 동물 이름 (쥐, 소 등)
  years: number[] // 해당 띠의 출생년도
  fortune: string // 운세 내용
  icon: string // 이모지 아이콘
}

// 12띠 기본 정보
export const ZODIAC_ANIMALS = [
  { id: "rat", name: "쥐띠", animal: "쥐", icon: "🐀", years: [1960, 1972, 1984, 1996, 2008, 2020] },
  { id: "ox", name: "소띠", animal: "소", icon: "🐂", years: [1961, 1973, 1985, 1997, 2009, 2021] },
  { id: "tiger", name: "호랑이띠", animal: "호랑이", icon: "🐅", years: [1962, 1974, 1986, 1998, 2010, 2022] },
  { id: "rabbit", name: "토끼띠", animal: "토끼", icon: "🐇", years: [1963, 1975, 1987, 1999, 2011, 2023] },
  { id: "dragon", name: "용띠", animal: "용", icon: "🐉", years: [1964, 1976, 1988, 2000, 2012, 2024] },
  { id: "snake", name: "뱀띠", animal: "뱀", icon: "🐍", years: [1965, 1977, 1989, 2001, 2013, 2025] },
  { id: "horse", name: "말띠", animal: "말", icon: "🐎", years: [1966, 1978, 1990, 2002, 2014, 2026] },
  { id: "sheep", name: "양띠", animal: "양", icon: "🐏", years: [1967, 1979, 1991, 2003, 2015, 2027] },
  { id: "monkey", name: "원숭이띠", animal: "원숭이", icon: "🐒", years: [1968, 1980, 1992, 2004, 2016, 2028] },
  { id: "rooster", name: "닭띠", animal: "닭", icon: "🐓", years: [1969, 1981, 1993, 2005, 2017, 2029] },
  { id: "dog", name: "개띠", animal: "개", icon: "🐕", years: [1970, 1982, 1994, 2006, 2018, 2030] },
  { id: "pig", name: "돼지띠", animal: "돼지", icon: "🐖", years: [1971, 1983, 1995, 2007, 2019, 2031] },
] as const

export type ZodiacId = typeof ZODIAC_ANIMALS[number]["id"]

// 운세 데이터 전체
export interface FortuneData {
  date: string
  fortunes: ZodiacFortune[]
}

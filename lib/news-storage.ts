import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data", "news")

// 날짜 키 생성 (YYYY-MM-DD)
export const getDateKey = (date: Date = new Date()): string => {
  const koreaTime = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
  const year = koreaTime.getFullYear()
  const month = String(koreaTime.getMonth() + 1).padStart(2, "0")
  const day = String(koreaTime.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// 디렉토리 생성 확인
const ensureDataDir = async () => {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// 뉴스 데이터 저장 (일단위 JSON 파일)
export const saveNewsData = async (newsArray: any[], topic: string) => {
  await ensureDataDir()

  const dateKey = getDateKey()
  const fileName = `${dateKey}.json`
  const filePath = path.join(DATA_DIR, fileName)

  const dataToSave = {
    date: dateKey,
    topic: topic,
    updatedAt: new Date().toISOString(),
    news: newsArray,
  }

  const jsonString = JSON.stringify(dataToSave, null, 2)
  await fs.writeFile(filePath, jsonString, "utf-8")

  console.log(`[News Storage] Saved ${newsArray.length} news items to ${fileName}`)
  return dataToSave
}

// 특정 날짜의 뉴스 데이터 불러오기
export const loadNewsData = async (dateKey?: string): Promise<any | null> => {
  await ensureDataDir()

  const targetDate = dateKey || getDateKey()
  const fileName = `${targetDate}.json`
  const filePath = path.join(DATA_DIR, fileName)

  try {
    const fileContent = await fs.readFile(filePath, "utf-8")
    const data = JSON.parse(fileContent)
    console.log(`[News Storage] Loaded ${data.news?.length || 0} news items from ${fileName}`)
    return data
  } catch (error) {
    console.log(`[News Storage] No data found for ${targetDate}`)
    return null
  }
}

// 특정 인덱스의 뉴스 아이템 불러오기
export const loadNewsItem = async (index: number, dateKey?: string): Promise<any | null> => {
  const data = await loadNewsData(dateKey)
  if (!data || !data.news || index < 0 || index >= data.news.length) {
    return null
  }
  return data.news[index]
}

// 최근 N일간의 뉴스 파일 목록 가져오기
export const getRecentNewsFiles = async (days: number = 7): Promise<string[]> => {
  await ensureDataDir()

  try {
    const files = await fs.readdir(DATA_DIR)
    const jsonFiles = files
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse()
      .slice(0, days)
    return jsonFiles.map((f) => f.replace(".json", ""))
  } catch {
    return []
  }
}

// 오래된 뉴스 파일 정리 (30일 이상)
export const cleanupOldNews = async (keepDays: number = 30) => {
  await ensureDataDir()

  try {
    const files = await fs.readdir(DATA_DIR)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - keepDays)
    const cutoffKey = getDateKey(cutoffDate)

    let deletedCount = 0
    for (const file of files) {
      if (file.endsWith(".json") && file < cutoffKey) {
        await fs.unlink(path.join(DATA_DIR, file))
        deletedCount++
      }
    }

    if (deletedCount > 0) {
      console.log(`[News Storage] Cleaned up ${deletedCount} old news files`)
    }
  } catch (error) {
    console.error("[News Storage] Cleanup error:", error)
  }
}

// 증시 및 환율 데이터 타입
export interface StockData {
  kospi: {
    value: number
    change: number
    changePercent: number
  }
  kosdaq: {
    value: number
    change: number
    changePercent: number
  }
  exchange: {
    usdKrw: number
    change: number
  }
  updatedAt: string
}

// Gemini API를 사용하여 증시/환율 데이터 가져오기 (5번 재시도)
export async function fetchStockData(): Promise<StockData> {
  const today = new Date()
  const koreaTime = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
  const dateStr = `${koreaTime.getFullYear()}.${String(koreaTime.getMonth() + 1).padStart(2, "0")}.${String(koreaTime.getDate()).padStart(2, "0")}`

  const MAX_RETRIES = 5

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Stock API] Fetching stock data via Gemini (attempt ${attempt}/${MAX_RETRIES})...`)

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `오늘 ${dateStr} 기준 한국 증시와 환율 정보를 알려주세요.

다음 정보를 JSON 형식으로만 응답해주세요:
1. KOSPI 지수 (현재가, 전일대비 변동폭, 변동률%)
2. KOSDAQ 지수 (현재가, 전일대비 변동폭, 변동률%)
3. 원/달러 환율 (현재가, 전일대비 변동폭)

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 반환하세요:
{
  "kospi": {"value": 2500.00, "change": 10.5, "changePercent": 0.42},
  "kosdaq": {"value": 800.00, "change": -5.2, "changePercent": -0.65},
  "exchange": {"usdKrw": 1400.00, "change": 3.5}
}

참고: change가 양수면 상승, 음수면 하락입니다.`
              }]
            }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 1024,
            },
          })
        }
      )

      if (!response.ok) {
        throw new Error(`Gemini API failed: ${response.status}`)
      }

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

      console.log("[Stock API] Gemini response:", text.substring(0, 300))

      // JSON 추출
      let jsonStr = text
      if (text.includes("```json")) {
        jsonStr = text.split("```json")[1].split("```")[0].trim()
      } else if (text.includes("```")) {
        jsonStr = text.split("```")[1].split("```")[0].trim()
      }

      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)

      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const stockData = JSON.parse(jsonMatch[0])

      console.log(`[Stock API] Fetched via Gemini - KOSPI: ${stockData.kospi.value}, KOSDAQ: ${stockData.kosdaq.value}, USD/KRW: ${stockData.exchange.usdKrw}`)

      return {
        kospi: {
          value: stockData.kospi.value,
          change: stockData.kospi.change,
          changePercent: stockData.kospi.changePercent,
        },
        kosdaq: {
          value: stockData.kosdaq.value,
          change: stockData.kosdaq.change,
          changePercent: stockData.kosdaq.changePercent,
        },
        exchange: {
          usdKrw: stockData.exchange.usdKrw,
          change: stockData.exchange.change,
        },
        updatedAt: dateStr,
      }

    } catch (error) {
      console.error(`[Stock API] Attempt ${attempt} failed:`, error)

      if (attempt === MAX_RETRIES) {
        throw new Error(`Failed to fetch stock data after ${MAX_RETRIES} attempts: ${error}`)
      }

      // 재시도 전 대기 (1초 * 시도 횟수)
      await new Promise(resolve => setTimeout(resolve, attempt * 1000))
    }
  }

  // TypeScript를 위한 unreachable code (실제로는 도달하지 않음)
  throw new Error('Unexpected error in fetchStockData')
}

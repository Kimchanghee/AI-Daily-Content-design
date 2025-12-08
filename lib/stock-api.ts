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

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// 네이버 금융 HTML을 가져와서 Gemini로 분석 (뉴스와 동일한 방식)
export async function fetchStockData(): Promise<StockData> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured")
  }

  const today = new Date()
  const koreaTime = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
  const dateStr = `${koreaTime.getFullYear()}.${String(koreaTime.getMonth() + 1).padStart(2, "0")}.${String(koreaTime.getDate()).padStart(2, "0")}`

  const MAX_RETRIES = 5

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Stock API] Attempt ${attempt}/${MAX_RETRIES}: Fetching Naver Finance HTML...`)

      // 1. 네이버 금융 시세 페이지 HTML 가져오기
      const siseResponse = await fetch("https://finance.naver.com/sise/", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        },
      })

      if (!siseResponse.ok) {
        throw new Error(`Failed to fetch Naver sise: ${siseResponse.status}`)
      }

      const siseHtml = await siseResponse.text()

      // 2. 네이버 환율 페이지 HTML 가져오기
      const exchangeResponse = await fetch("https://finance.naver.com/marketindex/", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        },
      })

      if (!exchangeResponse.ok) {
        throw new Error(`Failed to fetch Naver marketindex: ${exchangeResponse.status}`)
      }

      const exchangeHtml = await exchangeResponse.text()

      console.log(`[Stock API] HTML fetched, sending to Gemini for analysis...`)

      // 3. Gemini API로 HTML 분석해서 증시/환율 데이터 추출
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `다음은 네이버 금융 페이지의 HTML입니다. 이 페이지에서 오늘(${dateStr})의 증시와 환율 정보를 추출해주세요.

추출해야 할 정보:
1. KOSPI 지수: 현재가, 전일대비 변동폭, 변동률(%)
2. KOSDAQ 지수: 현재가, 전일대비 변동폭, 변동률(%)
3. 원/달러 환율: 현재가, 전일대비 변동폭

반드시 아래 JSON 형식으로만 응답해주세요. 다른 텍스트 없이 JSON만 반환하세요:
{"kospi": {"value": 2500.00, "change": 10.5, "changePercent": 0.42}, "kosdaq": {"value": 800.00, "change": -5.2, "changePercent": -0.65}, "exchange": {"usdKrw": 1400.00, "change": 3.5}}

참고: change가 양수면 상승, 음수면 하락입니다.

=== 증시 페이지 HTML ===
${siseHtml.substring(0, 50000)}

=== 환율 페이지 HTML ===
${exchangeHtml.substring(0, 30000)}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 1024,
            },
          }),
        }
      )

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text()
        console.error("[Stock API] Gemini API error:", errorText)
        throw new Error(`Gemini API error: ${geminiResponse.status}`)
      }

      const geminiData = await geminiResponse.json()
      const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ""

      console.log("[Stock API] Gemini response:", responseText.substring(0, 300))

      // JSON 추출 (마크다운 코드 블록 제거)
      let jsonStr = responseText
      if (responseText.includes("```json")) {
        jsonStr = responseText.split("```json")[1].split("```")[0].trim()
      } else if (responseText.includes("```")) {
        jsonStr = responseText.split("```")[1].split("```")[0].trim()
      }

      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in Gemini response")
      }

      const stockData = JSON.parse(jsonMatch[0])

      console.log(`[Stock API] Extracted - KOSPI: ${stockData.kospi.value}, KOSDAQ: ${stockData.kosdaq.value}, USD/KRW: ${stockData.exchange.usdKrw}`)

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

  throw new Error("Failed to fetch stock data")
}

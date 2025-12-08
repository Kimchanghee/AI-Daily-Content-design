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

// 네이버 금융에서 실시간 데이터 스크래핑
async function fetchNaverFinanceData(): Promise<StockData | null> {
  try {
    const response = await fetch('https://finance.naver.com/sise/')
    const html = await response.text()
    
    // KOSPI 추출
    const kospiMatch = html.match(/<span class="num">([\d,\.]+)<\/span>[\s\S]*?<span class="num">([\d,\.\-+]+)<\/span>/)
    const kospiValue = kospiMatch ? parseFloat(kospiMatch[1].replace(/,/g, '')) : null
    const kospiChange = kospiMatch ? parseFloat(kospiMatch[2].replace(/,/g, '')) : null
    
    // KOSDAQ 추출 (두 번째 지수)
    const kosdaqRegex = /<em class="no_dn">코스닥<\/em>[\s\S]*?<span class="num">([\d,\.]+)<\/span>[\s\S]*?<span class="num">([\d,\.\-+]+)<\/span>/
    const kosdaqMatch = html.match(kosdaqRegex)
    const kosdaqValue = kosdaqMatch ? parseFloat(kosdaqMatch[1].replace(/,/g, '')) : null
    const kosdaqChange = kosdaqMatch ? parseFloat(kosdaqMatch[2].replace(/,/g, '')) : null
    
    // 환율 페이지에서 USD/KRW 가져오기
    const exchangeResponse = await fetch('https://finance.naver.com/marketindex/')
    const exchangeHtml = await exchangeResponse.text()
    const usdMatch = exchangeHtml.match(/미국USD[\s\S]*?<span class="value">([\d,\.]+)<\/span>[\s\S]*?<span class="change">([\d,\.\-+]+)<\/span>/)
    const usdKrw = usdMatch ? parseFloat(usdMatch[1].replace(/,/g, '')) : null
    const usdChange = usdMatch ? parseFloat(usdMatch[2].replace(/,/g, '')) : null
    
    if (!kospiValue || !kosdaqValue || !usdKrw) {
      return null // 스크래핑 실패
    }
    
    return {
      kospi: {
        value: kospiValue,
        change: kospiChange || 0,
        changePercent: kospiChange ? (kospiChange / kospiValue) * 100 : 0
      },
      kosdaq: {
        value: kosdaqValue,
        change: kosdaqChange || 0,
        changePercent: kosdaqChange ? (kosdaqChange / kosdaqValue) * 100 : 0
      },
      exchange: {
        usdKrw: usdKrw,
        change: usdChange || 0
      },
      updatedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('[Stock API] Naver scraping failed:', error)
    return null
  }
}

// Gemini API를 사용하여 실시간 데이터 가져오기 (스크래핑 실패 시 대체)
async function fetchGeminiStockData(): Promise<StockData> {
  const today = new Date()
  const koreaTime = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
  const dateStr = `${koreaTime.getFullYear()}.${String(koreaTime.getMonth() + 1).padStart(2, "0")}.${String(koreaTime.getDate()).padStart(2, "0")}`
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `오늘 ${dateStr} 기준 한국 증시와 환율 정보를 정확하게 알려주세요.

다음 정보를 JSON 형식으로만 출력하세요:
1. KOSPI 지수 (현재가, 전일대비 변동폭, 변동률%)
2. KOSDAQ 지수 (현재가, 전일대비 변동폭, 변동률%)
3. 달러 환율 (현재가, 전일대비 변동폭)

반드시 아래 JSON만 정확히 출력하고 다른 텍스트 없이 JSON만 반환하세요:

{"kospi": {"value": 2500.00, "change": 10.5, "changePercent": 0.42}, "kosdaq": {"value": 800.00, "change": -5.2, "changePercent": -0.65}, "exchange": {"usdKrw": 1400.00, "change": 3.5}}

실거: change가 양수면 상승, 음수면 하락입니다.`
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
    throw new Error(`Gemini API error: ${response.status}`)
  }
  
  const data = await response.json()
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text
  
  if (!content) {
    throw new Error('No content from Gemini API')
  }
  
  // JSON 추출 (코드 블록 제거)
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Invalid JSON from Gemini')
  }
  
  const stockData = JSON.parse(jsonMatch[0])
  
  return {
    kospi: stockData.kospi,
    kosdaq: stockData.kosdaq,
    exchange: stockData.exchange,
    updatedAt: new Date().toISOString()
  }
}

// 메인 함수: 스크래핑 시도 → 실패 시 Gemini 사용 (5회 재시도)
export async function fetchStockData(): Promise<StockData> {
  const MAX_RETRIES = 5
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Stock API] Attempt ${attempt}/${MAX_RETRIES}: Trying Naver scraping...`)
      
      // 먼저 네이버 스크래핑 시도
      const scrapedData = await fetchNaverFinanceData()
      if (scrapedData) {
        console.log('[Stock API] Naver scraping succeeded')
        return scrapedData
      }
      
      // 스크래핑 실패 시 Gemini 사용
      console.log('[Stock API] Naver scraping failed, trying Gemini API...')
      const geminiData = await fetchGeminiStockData()
      console.log('[Stock API] Gemini API succeeded')
      return geminiData
      
    } catch (error) {
      console.error(`[Stock API] Attempt ${attempt} failed:`, error)
      
      if (attempt === MAX_RETRIES) {
        throw new Error(`Failed to fetch stock data after ${MAX_RETRIES} attempts`)
      }
      
      // 재시도 전 1초 대기
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  throw new Error('Failed to fetch stock data')
}

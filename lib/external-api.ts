// 외부 서버 API 전송 유틸리티

const EXTERNAL_API_BASE = "http://49.236.90.137:3000/api/daily"

interface ExternalApiResponse {
  status: boolean
  message: string
}

// 뉴스 데이터를 외부 서버로 전송
export async function sendNewsToExternalServer(newsData: any[]): Promise<ExternalApiResponse> {
  try {
    console.log(`[External API] Sending ${newsData.length} news items to external server`)

    const response = await fetch(`${EXTERNAL_API_BASE}/news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        content: JSON.stringify(newsData),
      }),
    })

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`)
    }

    const result = await response.json()
    console.log("[External API] News sent successfully:", result)
    return result
  } catch (error) {
    console.error("[External API] Failed to send news:", error)
    throw error
  }
}

// 운세 데이터를 외부 서버로 전송
export async function sendFortuneToExternalServer(fortuneData: any[]): Promise<ExternalApiResponse> {
  try {
    console.log(`[External API] Sending ${fortuneData.length} fortune items to external server`)

    // 필요한 필드만 추출 (id, fortune)
    const simplifiedFortune = fortuneData.map((item) => ({
      id: item.id,
      fortune: item.fortune,
    }))

    const response = await fetch(`${EXTERNAL_API_BASE}/fortune`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        content: JSON.stringify(simplifiedFortune),
      }),
    })

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`)
    }

    const result = await response.json()
    console.log("[External API] Fortune sent successfully:", result)
    return result
  } catch (error) {
    console.error("[External API] Failed to send fortune:", error)
    throw error
  }
}

// 증시/환율 데이터를 외부 서버로 전송
export async function sendStockToExternalServer(stockData: any): Promise<ExternalApiResponse> {
  try {
    console.log(`[External API] Sending stock data to external server`)

    const response = await fetch(`${EXTERNAL_API_BASE}/stock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        content: JSON.stringify(stockData),
      }),
    })

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`)
    }

    const result = await response.json()
    console.log("[External API] Stock sent successfully:", result)
    return result
  } catch (error) {
    console.error("[External API] Failed to send stock:", error)
    throw error
  }
}

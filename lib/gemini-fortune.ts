import { ZODIAC_ANIMALS, type ZodiacFortune } from "@/components/templates/fortune-types"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// Gemini API를 사용하여 띠별운세 생성
export async function generateFortuneWithGemini(): Promise<ZodiacFortune[]> {
  if (!GEMINI_API_KEY) {
    console.error("[Gemini Fortune] API key not configured")
    throw new Error("GEMINI_API_KEY is not configured")
  }

  const today = new Date()
  const koreaTime = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Seoul" }))
  const dateStr = `${koreaTime.getFullYear()}년 ${koreaTime.getMonth() + 1}월 ${koreaTime.getDate()}일`

  console.log(`[Gemini Fortune] Generating fortunes for: ${dateStr}`)

  try {
    const zodiacNames = ZODIAC_ANIMALS.map((z) => z.name).join(", ")

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
                  text: `오늘은 ${dateStr}입니다. 12가지 띠(${zodiacNames})에 대한 오늘의 운세를 작성해주세요.

각 띠별로 다음 형식의 JSON 배열로 응답해주세요:
- id: 띠 영문 ID (rat, ox, tiger, rabbit, dragon, snake, horse, sheep, monkey, rooster, dog, pig)
- fortune: 오늘의 운세 내용 (40-60자, 긍정적이고 구체적인 조언 포함)

운세 내용은:
1. 일, 사랑, 재물, 건강 중 하나 이상의 주제를 다룰 것
2. 구체적인 행동 조언이나 주의사항 포함
3. 너무 부정적이지 않게, 희망적인 메시지 포함
4. 각 띠마다 다른 내용으로 작성

반드시 아래 JSON 형식으로만 응답해주세요. 다른 텍스트 없이 JSON 배열만 반환하세요:
[{"id": "rat", "fortune": "오늘은..."}, {"id": "ox", "fortune": "..."}, ...]`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 4096,
          },
        }),
      }
    )

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error("[Gemini Fortune] API error:", errorText)
      throw new Error(`Gemini API error: ${geminiResponse.status}`)
    }

    const geminiData = await geminiResponse.json()
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ""

    console.log("[Gemini Fortune] Raw response:", responseText.substring(0, 500))

    // JSON 추출 (마크다운 코드 블록 제거)
    let jsonStr = responseText
    if (responseText.includes("```json")) {
      jsonStr = responseText.split("```json")[1].split("```")[0].trim()
    } else if (responseText.includes("```")) {
      jsonStr = responseText.split("```")[1].split("```")[0].trim()
    }

    const fortuneData: { id: string; fortune: string }[] = JSON.parse(jsonStr)

    // 완전한 ZodiacFortune 객체로 변환
    const fortunes: ZodiacFortune[] = ZODIAC_ANIMALS.map((zodiac) => {
      const generatedFortune = fortuneData.find((f) => f.id === zodiac.id)
      return {
        id: zodiac.id,
        name: zodiac.name,
        animal: zodiac.animal,
        years: [...zodiac.years],
        fortune: generatedFortune?.fortune || "오늘 하루도 좋은 일이 가득하길 바랍니다.",
        icon: zodiac.icon,
      }
    })

    console.log(`[Gemini Fortune] Successfully generated ${fortunes.length} fortunes`)
    return fortunes
  } catch (error) {
    console.error("[Gemini Fortune] Error generating fortunes:", error)
    throw error
  }
}

// 폴백용 기본 운세 데이터
export function getDefaultFortunes(): ZodiacFortune[] {
  const defaultMessages = [
    "이동 시에는 항시 주변 변화에 주의를 기울여라. 자칫 한눈 팔다 좋은 기회를 놓칠 수 있다.",
    "자고로 일이란 순서가 있고, 좋은 결실을 얻을 수 있는 때가 있다. 서두르지 말라.",
    "무던히 꾸준하게 노력하고 최선을 다했으나, 운이 맞지 않은 시기이다. 조금 더 기다려라.",
    "지인에게 개인적인 인정에 이끌려 당신의 능력 이상의 도움을 주지 않도록 주의하라.",
    "자신의 직관대로 사람을 상대하기 보다는 그 사람을 면밀하게 살펴보는 것이 좋다.",
    "당신은 최선을 다해서 살았다고 하는데 실제로는 백일 중 최선을 다한 날은 얼마 안 된다.",
    "당신은 다른 사람을 위해서 봉사할 준비가 되어 있는 사람이다. 그 마음을 잊지 마라.",
    "급박하게 돌아가는 상황에서는 한 걸음 물러서서 대응하는 것이 현명하다.",
    "당신의 장점은 어렵고 힘든 상황에 굴하지 않는 것이다. 매사 긍정적으로 생각하라.",
    "예상치 못한 사람에게 선물을 받을 수도 있는 하루다. 선물에 담긴 마음을 헤아려라.",
    "구입하려는 물건을 생각 외로 싸게 얻을 수 있다. 단, 신속하게 행동해야 한다.",
    "다른 사람의 사정을 생각하여 그 사람을 위한 행동도 좋지만, 먼저 자신을 돌봐라.",
  ]

  return ZODIAC_ANIMALS.map((zodiac, index) => ({
    id: zodiac.id,
    name: zodiac.name,
    animal: zodiac.animal,
    years: [...zodiac.years],
    fortune: defaultMessages[index],
    icon: zodiac.icon,
  }))
}

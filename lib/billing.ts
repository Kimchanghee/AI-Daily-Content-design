// 결제 및 구독 관리 유틸리티

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: "month" | "year"
  features: string[]
  limits: {
    contentGeneration: number
    messageSends: number
    imageGeneration: number
    channels: number
  }
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  status: "active" | "canceled" | "expired" | "trial"
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

export interface PaymentHistory {
  id: string
  userId: string
  amount: number
  status: "succeeded" | "failed" | "pending"
  description: string
  createdAt: Date
  invoiceUrl?: string
}

// 구독 플랜 데이터
export const plans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "베이직",
    price: 29000,
    interval: "month",
    features: [
      "AI 콘텐츠 생성 100건/월",
      "메시지 발송 500건/월",
      "이미지 생성 50건/월",
      "채널 연동 2개",
      "기본 템플릿 제공",
      "이메일 지원",
    ],
    limits: {
      contentGeneration: 100,
      messageSends: 500,
      imageGeneration: 50,
      channels: 2,
    },
  },
  {
    id: "pro",
    name: "프로",
    price: 49000,
    interval: "month",
    features: [
      "AI 콘텐츠 생성 300건/월",
      "메시지 발송 2,000건/월",
      "이미지 생성 200건/월",
      "채널 연동 5개",
      "프리미엄 템플릿 제공",
      "우선 지원",
      "분석 대시보드",
    ],
    limits: {
      contentGeneration: 300,
      messageSends: 2000,
      imageGeneration: 200,
      channels: 5,
    },
  },
  {
    id: "enterprise",
    name: "엔터프라이즈",
    price: 99000,
    interval: "month",
    features: [
      "AI 콘텐츠 생성 무제한",
      "메시지 발송 무제한",
      "이미지 생성 무제한",
      "채널 연동 무제한",
      "맞춤 템플릿 제작",
      "전담 매니저 배정",
      "고급 분석 및 리포트",
      "API 접근",
    ],
    limits: {
      contentGeneration: -1, // -1 = 무제한
      messageSends: -1,
      imageGeneration: -1,
      channels: -1,
    },
  },
]

// 샘플 구독 데이터
const sampleSubscriptions: Subscription[] = [
  {
    id: "1",
    userId: "2",
    planId: "pro",
    status: "active",
    currentPeriodStart: new Date("2024-01-15"),
    currentPeriodEnd: new Date("2024-02-15"),
    cancelAtPeriodEnd: false,
  },
]

// 샘플 결제 이력
const samplePaymentHistory: PaymentHistory[] = [
  {
    id: "1",
    userId: "2",
    amount: 49000,
    status: "succeeded",
    description: "프로 플랜 - 2024년 1월",
    createdAt: new Date("2024-01-15"),
    invoiceUrl: "#",
  },
  {
    id: "2",
    userId: "2",
    amount: 49000,
    status: "succeeded",
    description: "프로 플랜 - 2023년 12월",
    createdAt: new Date("2023-12-15"),
    invoiceUrl: "#",
  },
  {
    id: "3",
    userId: "2",
    amount: 49000,
    status: "succeeded",
    description: "프로 플랜 - 2023년 11월",
    createdAt: new Date("2023-11-15"),
    invoiceUrl: "#",
  },
]

export async function getSubscription(userId: string): Promise<Subscription | null> {
  // 실제로는 데이터베이스에서 조회
  return sampleSubscriptions.find((s) => s.userId === userId) || null
}

export async function getPaymentHistory(userId: string): Promise<PaymentHistory[]> {
  // 실제로는 데이터베이스에서 조회
  return samplePaymentHistory.filter((p) => p.userId === userId)
}

export async function createCheckoutSession(userId: string, planId: string): Promise<{ url: string }> {
  // 실제로는 결제 API (Stripe 등) 호출
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { url: "/dashboard/billing?success=true" }
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  // 실제로는 결제 API 호출
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const index = sampleSubscriptions.findIndex((s) => s.id === subscriptionId)
  if (index !== -1) {
    sampleSubscriptions[index].cancelAtPeriodEnd = true
  }
}

export async function resumeSubscription(subscriptionId: string): Promise<void> {
  // 실제로는 결제 API 호출
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const index = sampleSubscriptions.findIndex((s) => s.id === subscriptionId)
  if (index !== -1) {
    sampleSubscriptions[index].cancelAtPeriodEnd = false
  }
}

export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return plans.find((p) => p.id === planId)
}

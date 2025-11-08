// 메시지 발송 관리 유틸리티

export interface MessagingChannel {
  id: string
  name: string
  type: "telegram" | "kakao" | "email" | "sms"
  status: "connected" | "disconnected" | "error"
  config: {
    apiKey?: string
    channelId?: string
    webhookUrl?: string
    [key: string]: any
  }
  userId: string
  createdAt: Date
  lastUsed?: Date
}

export interface MessageHistory {
  id: string
  channelId: string
  channelName: string
  channelType: "telegram" | "kakao" | "email" | "sms"
  contentTitle: string
  sentAt: Date
  status: "success" | "failed" | "pending"
  recipientCount: number
  deliveredCount: number
  failedCount: number
}

// 샘플 채널 데이터
const sampleChannels: MessagingChannel[] = [
  {
    id: "1",
    name: "메인 텔레그램 채널",
    type: "telegram",
    status: "connected",
    config: {
      channelId: "@my_channel",
      apiKey: "telegram_bot_token_xxx",
    },
    userId: "2",
    createdAt: new Date("2024-01-01"),
    lastUsed: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "고객 알림 카카오톡",
    type: "kakao",
    status: "disconnected",
    config: {
      apiKey: "",
    },
    userId: "2",
    createdAt: new Date("2024-01-05"),
  },
]

// 샘플 발송 이력
const sampleHistory: MessageHistory[] = [
  {
    id: "1",
    channelId: "1",
    channelName: "메인 텔레그램 채널",
    channelType: "telegram",
    contentTitle: "신상품 출시 안내",
    sentAt: new Date("2024-01-15T10:00:00"),
    status: "success",
    recipientCount: 1234,
    deliveredCount: 1180,
    failedCount: 54,
  },
  {
    id: "2",
    channelId: "1",
    channelName: "메인 텔레그램 채널",
    channelType: "telegram",
    contentTitle: "주말 특가 프로모션",
    sentAt: new Date("2024-01-14T14:30:00"),
    status: "success",
    recipientCount: 1234,
    deliveredCount: 1210,
    failedCount: 24,
  },
  {
    id: "3",
    channelId: "1",
    channelName: "메인 텔레그램 채널",
    channelType: "telegram",
    contentTitle: "고객 후기 공유",
    sentAt: new Date("2024-01-13T16:00:00"),
    status: "success",
    recipientCount: 1234,
    deliveredCount: 1195,
    failedCount: 39,
  },
]

export async function getChannels(userId: string): Promise<MessagingChannel[]> {
  // 실제로는 데이터베이스에서 조회
  return sampleChannels.filter((c) => c.userId === userId)
}

export async function getChannel(id: string): Promise<MessagingChannel | null> {
  // 실제로는 데이터베이스에서 조회
  return sampleChannels.find((c) => c.id === id) || null
}

export async function createChannel(channel: Omit<MessagingChannel, "id" | "createdAt">): Promise<MessagingChannel> {
  // 실제로는 데이터베이스에 저장
  const newChannel: MessagingChannel = {
    ...channel,
    id: String(sampleChannels.length + 1),
    createdAt: new Date(),
  }
  sampleChannels.push(newChannel)
  return newChannel
}

export async function updateChannel(id: string, updates: Partial<MessagingChannel>): Promise<MessagingChannel> {
  // 실제로는 데이터베이스 업데이트
  const index = sampleChannels.findIndex((c) => c.id === id)
  if (index === -1) throw new Error("채널을 찾을 수 없습니다.")

  sampleChannels[index] = { ...sampleChannels[index], ...updates }
  return sampleChannels[index]
}

export async function deleteChannel(id: string): Promise<void> {
  // 실제로는 데이터베이스에서 삭제
  const index = sampleChannels.findIndex((c) => c.id === id)
  if (index !== -1) {
    sampleChannels.splice(index, 1)
  }
}

export async function getMessageHistory(userId: string): Promise<MessageHistory[]> {
  // 실제로는 데이터베이스에서 조회
  return sampleHistory
}

export async function testConnection(
  type: MessagingChannel["type"],
  config: MessagingChannel["config"],
): Promise<{ success: boolean; message: string }> {
  // 실제로는 API 연결 테스트
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // 시뮬레이션: 90% 성공률
  const success = Math.random() > 0.1

  return {
    success,
    message: success ? "연결 테스트에 성공했습니다." : "연결 테스트에 실패했습니다. 설정을 확인해주세요.",
  }
}

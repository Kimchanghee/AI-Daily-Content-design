// 콘텐츠 관리 유틸리티

export interface Content {
  id: string
  title: string
  description: string
  platform: "Instagram" | "Facebook" | "Telegram" | "Twitter"
  status: "작성중" | "예약됨" | "발송 완료" | "실패"
  scheduledDate?: Date
  createdAt: Date
  imageUrl?: string
  content: string
  userId: string
}

// 샘플 콘텐츠 데이터
const sampleContents: Content[] = [
  {
    id: "1",
    title: "신상품 출시 안내",
    description: "새로운 겨울 컬렉션 소개",
    platform: "Instagram",
    status: "발송 완료",
    scheduledDate: new Date("2024-01-15"),
    createdAt: new Date("2024-01-14"),
    content: "🎉 새로운 겨울 컬렉션이 출시되었습니다! 따뜻하고 스타일리시한 아이템들을 만나보세요.",
    imageUrl: "/winter-fashion-collection.png",
    userId: "2",
  },
  {
    id: "2",
    title: "주말 특가 프로모션",
    description: "이번 주말 한정 특별 할인",
    platform: "Facebook",
    status: "예약됨",
    scheduledDate: new Date("2024-01-20"),
    createdAt: new Date("2024-01-16"),
    content: "🔥 주말 특가! 전 품목 20% 할인! 이번 주말만 특별한 가격으로 만나보세요.",
    imageUrl: "/sale-promotion-banner.jpg",
    userId: "2",
  },
  {
    id: "3",
    title: "고객 후기 공유",
    description: "만족하신 고객님들의 리뷰",
    platform: "Telegram",
    status: "발송 완료",
    scheduledDate: new Date("2024-01-14"),
    createdAt: new Date("2024-01-13"),
    content: "⭐️ 고객님들의 따뜻한 후기를 공유합니다. 많은 사랑 감사드립니다!",
    userId: "2",
  },
]

export async function getContents(userId: string): Promise<Content[]> {
  // 실제로는 데이터베이스에서 조회
  return sampleContents.filter((c) => c.userId === userId)
}

export async function getContent(id: string): Promise<Content | null> {
  // 실제로는 데이터베이스에서 조회
  return sampleContents.find((c) => c.id === id) || null
}

export async function createContent(content: Omit<Content, "id" | "createdAt">): Promise<Content> {
  // 실제로는 데이터베이스에 저장
  const newContent: Content = {
    ...content,
    id: String(sampleContents.length + 1),
    createdAt: new Date(),
  }
  sampleContents.push(newContent)
  return newContent
}

export async function updateContent(id: string, updates: Partial<Content>): Promise<Content> {
  // 실제로는 데이터베이스 업데이트
  const index = sampleContents.findIndex((c) => c.id === id)
  if (index === -1) throw new Error("콘텐츠를 찾을 수 없습니다.")

  sampleContents[index] = { ...sampleContents[index], ...updates }
  return sampleContents[index]
}

export async function deleteContent(id: string): Promise<void> {
  // 실제로는 데이터베이스에서 삭제
  const index = sampleContents.findIndex((c) => c.id === id)
  if (index !== -1) {
    sampleContents.splice(index, 1)
  }
}

// AI 콘텐츠 생성 시뮬레이션
export async function generateAIContent(
  prompt: string,
  platform: string,
): Promise<{ title: string; content: string; description: string }> {
  // 실제로는 AI API 호출
  await new Promise((resolve) => setTimeout(resolve, 2000)) // 시뮬레이션

  const templates = {
    Instagram: {
      title: "매력적인 인스타그램 포스팅",
      content: `✨ ${prompt}\n\n우리 제품과 함께라면 매일이 특별해집니다!\n\n#데일리 #라이프스타일 #추천`,
      description: "AI가 생성한 인스타그램 최적화 콘텐츠",
    },
    Facebook: {
      title: "페이스북 홍보 게시물",
      content: `🎯 ${prompt}\n\n지금 바로 확인해보세요! 특별한 혜택이 기다리고 있습니다.`,
      description: "AI가 생성한 페이스북 마케팅 콘텐츠",
    },
    Telegram: {
      title: "텔레그램 업데이트 메시지",
      content: `📢 ${prompt}\n\n자세한 내용은 채널에서 확인하세요!`,
      description: "AI가 생성한 텔레그램 공지 메시지",
    },
    Twitter: {
      title: "트위터 짧은 게시물",
      content: `${prompt}\n\n#AI콘텐츠 #마케팅`,
      description: "AI가 생성한 트위터 포스팅",
    },
  }

  return templates[platform as keyof typeof templates] || templates.Instagram
}

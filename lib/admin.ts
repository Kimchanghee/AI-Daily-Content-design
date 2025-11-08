// 관리자 기능 유틸리티

import type { User } from "./auth"
import type { Content } from "./content"
import type { MessagingChannel } from "./messaging"
import type { Subscription } from "./billing"

export interface AdminStats {
  totalUsers: number
  activeSubscriptions: number
  totalRevenue: number
  monthlyRevenue: number
  totalContents: number
  totalMessages: number
}

export interface SystemLog {
  id: string
  timestamp: Date
  level: "info" | "warning" | "error"
  message: string
  userId?: string
  details?: string
}

// 샘플 전체 사용자 데이터
const allUsers: Array<User & { lastLogin?: Date; subscription?: string }> = [
  {
    id: "1",
    email: "admin@aidaily.com",
    name: "관리자",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date("2024-01-20"),
  },
  {
    id: "2",
    email: "user@example.com",
    name: "김철수",
    role: "user",
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date("2024-01-19"),
    subscription: "pro",
  },
  {
    id: "3",
    email: "seller@shop.com",
    name: "이영희",
    role: "user",
    createdAt: new Date("2024-01-10"),
    lastLogin: new Date("2024-01-18"),
    subscription: "basic",
  },
  {
    id: "4",
    email: "marketer@company.com",
    name: "박민수",
    role: "user",
    createdAt: new Date("2024-01-05"),
    lastLogin: new Date("2024-01-20"),
    subscription: "enterprise",
  },
]

// 샘플 시스템 로그
const systemLogs: SystemLog[] = [
  {
    id: "1",
    timestamp: new Date("2024-01-20T10:30:00"),
    level: "info",
    message: "새 사용자 가입",
    userId: "2",
    details: "user@example.com",
  },
  {
    id: "2",
    timestamp: new Date("2024-01-20T09:15:00"),
    level: "warning",
    message: "API 요청 한도 초과",
    userId: "3",
    details: "Rate limit exceeded for user: seller@shop.com",
  },
  {
    id: "3",
    timestamp: new Date("2024-01-19T18:45:00"),
    level: "error",
    message: "메시지 발송 실패",
    userId: "2",
    details: "Telegram API error: Invalid token",
  },
  {
    id: "4",
    timestamp: new Date("2024-01-19T15:20:00"),
    level: "info",
    message: "구독 갱신 성공",
    userId: "4",
    details: "Enterprise plan renewed",
  },
]

export async function getAdminStats(): Promise<AdminStats> {
  // 실제로는 데이터베이스에서 집계
  return {
    totalUsers: allUsers.filter((u) => u.role === "user").length,
    activeSubscriptions: allUsers.filter((u) => u.subscription).length,
    totalRevenue: 4250000,
    monthlyRevenue: 850000,
    totalContents: 487,
    totalMessages: 12450,
  }
}

export async function getAllUsers(): Promise<Array<User & { lastLogin?: Date; subscription?: string }>> {
  // 실제로는 데이터베이스에서 조회
  return allUsers
}

export async function getUserById(id: string): Promise<(User & { lastLogin?: Date; subscription?: string }) | null> {
  // 실제로는 데이터베이스에서 조회
  return allUsers.find((u) => u.id === id) || null
}

export async function updateUserRole(userId: string, role: "user" | "admin"): Promise<void> {
  // 실제로는 데이터베이스 업데이트
  const user = allUsers.find((u) => u.id === userId)
  if (user) {
    user.role = role
  }
}

export async function deleteUser(userId: string): Promise<void> {
  // 실제로는 데이터베이스에서 삭제
  const index = allUsers.findIndex((u) => u.id === userId)
  if (index !== -1) {
    allUsers.splice(index, 1)
  }
}

export async function getSystemLogs(limit = 50): Promise<SystemLog[]> {
  // 실제로는 데이터베이스에서 조회
  return systemLogs.slice(0, limit)
}

export async function getAllContents(): Promise<Content[]> {
  // 실제로는 데이터베이스에서 조회
  return []
}

export async function getAllChannels(): Promise<MessagingChannel[]> {
  // 실제로는 데이터베이스에서 조회
  return []
}

export async function getAllSubscriptions(): Promise<Subscription[]> {
  // 실제로는 데이터베이스에서 조회
  return []
}

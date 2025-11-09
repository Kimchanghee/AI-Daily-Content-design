// 관리자 기능 유틸리티

import { createClient } from "@/lib/supabase/client"
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
  const supabase = createClient()

  // profiles와 subscriptions 조인하여 사용자 정보 가져오기
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(`
      id,
      email,
      name,
      role,
      created_at,
      subscriptions (
        plan_name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return (
    profiles?.map((profile: any) => ({
      id: profile.id,
      email: profile.email,
      name: profile.name || profile.email.split("@")[0],
      role: profile.role as "user" | "admin",
      createdAt: new Date(profile.created_at),
      subscription: profile.subscriptions?.[0]?.plan_name,
    })) || []
  )
}

export async function getUserById(id: string): Promise<(User & { lastLogin?: Date; subscription?: string }) | null> {
  // 실제로는 데이터베이스에서 조회
  return allUsers.find((u) => u.id === id) || null
}

export async function updateUserRole(userId: string, role: "user" | "admin"): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId)

  if (error) {
    console.error("Error updating user role:", error)
    throw new Error("역할 업데이트에 실패했습니다.")
  }
}

export async function deleteUser(userId: string): Promise<void> {
  const supabase = createClient()

  // auth.users 테이블에서 삭제하면 CASCADE로 profiles도 자동 삭제됨
  // 하지만 auth.users는 직접 삭제할 수 없으므로 관리자 API 사용 필요
  // 현재는 profiles만 삭제 (실제 운영환경에서는 Supabase Admin API 사용)
  const { error } = await supabase.from("profiles").delete().eq("id", userId)

  if (error) {
    console.error("Error deleting user:", error)
    throw new Error("사용자 삭제에 실패했습니다.")
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

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let client: SupabaseClient | undefined

export function createClient() {
  // 브라우저 환경에서만 작동
  if (typeof window === "undefined") {
    throw new Error("createClient can only be used in browser context")
  }

  // globalThis에서 기존 인스턴스 확인
  if ((globalThis as any).__supabase_client) {
    return (globalThis as any).__supabase_client as SupabaseClient
  }

  // 새 인스턴스 생성 및 globalThis에 저장
  client = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  ;(globalThis as any).__supabase_client = client

  return client
}

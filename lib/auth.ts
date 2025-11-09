import { createClient } from "@/lib/supabase/client"

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  createdAt: Date
}

export async function authenticate(email: string, password: string): Promise<User | null> {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    return null
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("session", JSON.stringify(data.user))
    document.cookie = `session=${JSON.stringify(data.user)}; path=/; max-age=604800`
  }

  // 프로필에서 role 가져오기
  const { data: profile } = await supabase.from("profiles").select("role, name").eq("id", data.user.id).single()

  const role = profile?.role || "user"

  return {
    id: data.user.id,
    email: data.user.email!,
    name: profile?.name || data.user.email!.split("@")[0],
    role: role as "user" | "admin",
    createdAt: new Date(data.user.created_at),
  }
}

export async function register(email: string, password: string, name: string): Promise<User> {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })

  if (error || !data.user) {
    throw new Error(error?.message || "회원가입에 실패했습니다.")
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("session", JSON.stringify(data.user))
    document.cookie = `session=${JSON.stringify(data.user)}; path=/; max-age=604800`
  }

  return {
    id: data.user.id,
    email: data.user.email!,
    name,
    role: "user",
    createdAt: new Date(data.user.created_at),
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // 프로필 정보 가져오기 (role 포함)
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const role = profile?.role || "user"

  return {
    id: user.id,
    email: user.email!,
    name: profile?.name || user.email!.split("@")[0],
    role: role as "user" | "admin",
    createdAt: new Date(user.created_at),
  }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
}

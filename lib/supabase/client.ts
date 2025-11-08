// Supabase 클라이언트를 사용하지 않고 fetch API로 직접 통신
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return {
    auth: {
      async signInWithPassword({ email, password }: { email: string; password: string }) {
        // 임시로 목 데이터 반환
        if (email === "admin@aidaily.com" && password === "admin123") {
          return {
            data: {
              user: {
                id: "admin-id",
                email: "admin@aidaily.com",
                created_at: new Date().toISOString(),
              },
            },
            error: null,
          }
        }
        if (email === "user@example.com" && password === "user123") {
          return {
            data: {
              user: {
                id: "user-id",
                email: "user@example.com",
                created_at: new Date().toISOString(),
              },
            },
            error: null,
          }
        }
        return {
          data: { user: null },
          error: { message: "잘못된 이메일 또는 비밀번호입니다." },
        }
      },
      async signUp({
        email,
        password,
        options,
      }: {
        email: string
        password: string
        options?: any
      }) {
        return {
          data: {
            user: {
              id: `user-${Date.now()}`,
              email,
              created_at: new Date().toISOString(),
            },
          },
          error: null,
        }
      },
      async getUser() {
        // 로컬스토리지에서 세션 확인
        if (typeof window !== "undefined") {
          const session = localStorage.getItem("session")
          if (session) {
            const user = JSON.parse(session)
            return { data: { user }, error: null }
          }
        }
        return { data: { user: null }, error: null }
      },
      async signOut() {
        if (typeof window !== "undefined") {
          localStorage.removeItem("session")
        }
        return { error: null }
      },
      async resetPasswordForEmail({ email }: { email: string }) {
        return { data: {}, error: null }
      },
      async updateUser({ password }: { password: string }) {
        return { data: { user: {} }, error: null }
      },
    },
    from(table: string) {
      return {
        select(columns: string) {
          return {
            eq(column: string, value: any) {
              return {
                async single() {
                  return { data: null, error: null }
                },
              }
            },
          }
        },
      }
    },
  }
}

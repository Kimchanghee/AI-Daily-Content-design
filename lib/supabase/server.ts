import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return {
    auth: {
      async getUser() {
        const sessionCookie = cookieStore.get("session")
        if (sessionCookie) {
          try {
            const user = JSON.parse(sessionCookie.value)
            return { data: { user }, error: null }
          } catch {
            return { data: { user: null }, error: null }
          }
        }
        return { data: { user: null }, error: null }
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

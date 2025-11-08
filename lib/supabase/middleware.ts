import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  // 쿠키에서 세션 확인
  const sessionCookie = request.cookies.get("session")
  let user = null

  if (sessionCookie) {
    try {
      user = JSON.parse(sessionCookie.value)
    } catch {
      user = null
    }
  }

  // 보호된 경로 리디렉션
  if (!user && (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/admin"))) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // 관리자 권한 확인
  if (user && request.nextUrl.pathname.startsWith("/admin")) {
    if (user.email !== "admin@aidaily.com") {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

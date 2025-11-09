import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <span className="text-4xl">✨</span>
            <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
              AI Daily Content
            </span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📧</span>
            </div>
            <CardTitle>이메일을 확인해주세요</CardTitle>
            <CardDescription>회원가입이 거의 완료되었습니다!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm">
              <p className="font-medium mb-2">가입 확인 이메일을 발송했습니다</p>
              <p className="text-blue-600">이메일 받은편지함을 확인하고 인증 링크를 클릭하여 계정을 활성화해주세요.</p>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• 이메일이 오지 않았나요? 스팸 폴더를 확인해보세요.</p>
              <p>• 이메일 인증 후 로그인이 가능합니다.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/auth/login">로그인 페이지로 이동</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

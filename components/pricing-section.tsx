import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PricingSection() {
  return (
    <div id="pricing" className="container max-w-[1400px] mx-auto px-4 py-16 bg-muted/30">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">간편한 단일 요금제</h2>
        <p className="text-lg text-muted-foreground">복잡한 옵션 없이 하나의 요금으로 모든 기능 이용 가능</p>
      </div>

      <div className="max-w-[400px] mx-auto">
        <Card className="border-2 border-black">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">프로 플랜</CardTitle>
                <CardDescription>전문 보험 영업인을 위한 완벽한 솔루션</CardDescription>
              </div>
              <Badge>인기</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">30,000원</span>
                <span className="text-muted-foreground">/월</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">부가세 포함</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-black mt-1 font-bold">✓</span>
                <span>6개 카테고리 뉴스 자동 수집</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-black mt-1 font-bold">✓</span>
                <span>3가지 전문 디자인 템플릿</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-black mt-1 font-bold">✓</span>
                <span>1시간마다 자동 업데이트</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-black mt-1 font-bold">✓</span>
                <span>무제한 다운로드</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-black mt-1 font-bold">✓</span>
                <span>고객 관리 시스템</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-black mt-1 font-bold">✓</span>
                <span>텔레그램 자동 발송</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/auth/signup" className="w-full">
              <Button size="lg" className="w-full bg-black hover:bg-gray-800 text-white">
                3일 무료 체험 시작
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* FAQ or additional info */}
      <div className="mt-16 text-center space-y-4">
        <h3 className="text-xl font-semibold">자주 묻는 질문</h3>
        <div className="max-w-[600px] mx-auto space-y-4 text-left">
          <details className="group">
            <summary className="cursor-pointer font-medium p-4 bg-card rounded-lg">
              무료 체험 기간은 어떻게 되나요?
            </summary>
            <p className="p-4 text-muted-foreground">
              가입 후 3일간 모든 기능을 무료로 체험하실 수 있습니다. 체험 기간 종료 후 자동으로 유료 구독이 시작되며,
              언제든지 해지 가능합니다.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium p-4 bg-card rounded-lg">결제 방법은 무엇인가요?</summary>
            <p className="p-4 text-muted-foreground">
              신용카드 및 체크카드 결제를 지원합니다. 안전한 결제 시스템으로 보호됩니다.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium p-4 bg-card rounded-lg">해지는 언제든지 가능한가요?</summary>
            <p className="p-4 text-muted-foreground">
              네, 언제든지 마이페이지에서 구독을 해지하실 수 있습니다. 해지 시 다음 결제일부터 요금이 청구되지 않습니다.
            </p>
          </details>
        </div>
      </div>
    </div>
  )
}

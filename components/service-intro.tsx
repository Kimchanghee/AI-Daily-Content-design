import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ServiceIntro() {
  return (
    <div className="container max-w-[1400px] mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-20">
        <Badge variant="secondary" className="text-sm px-4 py-1">
          3일 무료 체험
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">보험사 데일리 메시지</h1>
        <p className="text-xl text-muted-foreground max-w-[700px] mx-auto leading-relaxed">
          매일 아침, 고객에게 보낼 최신 뉴스 메시지를 자동으로 준비해드립니다.
          <br />
          영업 활동에 집중하고, 고객 소통은 더 쉽게.
        </p>
      </div>

      <div className="mb-20 bg-black text-white rounded-lg p-12">
        <div className="max-w-[800px] mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center mb-8">왜 영업직군에 필요한가요?</h2>

          <div className="space-y-6 text-lg leading-relaxed">
            <div className="border-l-4 border-white pl-6">
              <h3 className="font-bold text-xl mb-2">매일 반복되는 고객 소통의 부담</h3>
              <p className="text-white/80">
                보험 영업은 고객과의 꾸준한 관계 유지가 핵심입니다. 하지만 매일 수십 명의 고객에게 의미있는 메시지를
                보내는 것은 시간도 오래 걸리고 아이디어도 고갈됩니다.
              </p>
            </div>

            <div className="border-l-4 border-white pl-6">
              <h3 className="font-bold text-xl mb-2">고객이 원하는 것: 유용한 정보</h3>
              <p className="text-white/80">
                고객들은 단순한 인사말보다 실제로 도움이 되는 최신 뉴스와 정보를 원합니다. 하지만 매일 뉴스를 찾아보고,
                정리하고, 멋진 형태로 만드는 것은 현실적으로 어렵습니다.
              </p>
            </div>

            <div className="border-l-4 border-white pl-6">
              <h3 className="font-bold text-xl mb-2">이 서비스가 해결합니다</h3>
              <p className="text-white/80">
                <strong>보험사 데일리 메시지</strong>는 매일 최신 뉴스를 자동으로 수집하고, 전문적인 디자인 템플릿에
                담아 드립니다. 당신은 템플릿을 선택하고, 당신의 이름과 인사말을 추가한 후 다운로드만 하면 됩니다.
              </p>
            </div>
          </div>

          <div className="text-center pt-6">
            <p className="text-2xl font-bold">하루 5분이면 충분합니다.</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h3 className="font-bold text-xl">실시간 뉴스 수집</h3>
              <p className="text-muted-foreground">
                네이버 뉴스에서 6개 카테고리(정치, 경제, 사회, 생활/문화, IT/과학, 세계)의 최신 헤드라인을 자동으로
                수집합니다.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h3 className="font-bold text-xl">전문 템플릿</h3>
              <p className="text-muted-foreground">
                클래식, 모던, 프리미엄 비즈니스 3가지 전문 디자인 템플릿 중 선택하여 메시지를 생성할 수 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h3 className="font-bold text-xl">자동 업데이트</h3>
              <p className="text-muted-foreground">
                오전 9시부터 오후 11시 59분까지 1시간마다 자동으로 최신 뉴스를 업데이트합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How it works */}
      <div className="text-center space-y-8">
        <h2 className="text-3xl font-bold">사용 방법</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl mx-auto">
              1
            </div>
            <h3 className="font-semibold">회원가입</h3>
            <p className="text-sm text-muted-foreground">3일 무료 체험으로 시작하세요</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl mx-auto">
              2
            </div>
            <h3 className="font-semibold">템플릿 선택</h3>
            <p className="text-sm text-muted-foreground">원하는 디자인을 선택하세요</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl mx-auto">
              3
            </div>
            <h3 className="font-semibold">미리보기</h3>
            <p className="text-sm text-muted-foreground">오늘의 뉴스가 적용된 템플릿을 확인하세요</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl mx-auto">
              4
            </div>
            <h3 className="font-semibold">다운로드 & 발송</h3>
            <p className="text-sm text-muted-foreground">이미지를 다운로드하여 고객에게 발송하세요</p>
          </div>
        </div>

        <div className="pt-8">
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8 py-6">
              지금 바로 시작하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

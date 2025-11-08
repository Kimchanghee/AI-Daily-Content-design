"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getCurrentUser, type User } from "@/lib/auth"
import { TrendingUp, FileText, Send, Users, ArrowUpRight, Plus } from "lucide-react"

const stats = [
  {
    name: "생성된 뉴스",
    value: "87",
    change: "+15%",
    changeType: "positive",
    icon: FileText,
  },
  {
    name: "발송된 메시지",
    value: "2,340",
    change: "+23%",
    changeType: "positive",
    icon: Send,
  },
  {
    name: "평균 도달률",
    value: "96.8%",
    change: "+3.2%",
    changeType: "positive",
    icon: TrendingUp,
  },
  {
    name: "총 고객 수",
    value: "456",
    change: "+34",
    changeType: "positive",
    icon: Users,
  },
]

const recentContent = [
  {
    id: 1,
    title: "2024년 부동산 시장 전망",
    category: "부동산",
    status: "발송 완료",
    date: "2024-01-15",
    recipients: 234,
  },
  {
    id: 2,
    title: "금리 인하 시 대응 전략",
    category: "금융",
    status: "예약됨",
    date: "2024-01-16",
    recipients: 189,
  },
  {
    id: 3,
    title: "보험 트렌드 리포트",
    category: "보험",
    status: "발송 완료",
    date: "2024-01-14",
    recipients: 312,
  },
]
// </CHANGE>

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }
    loadUser()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">대시보드</h1>
          <p className="text-muted-foreground mt-2">
            {user?.name}님, 환영합니다! 오늘도 고객에게 유익한 뉴스를 전달해보세요.
          </p>
        </div>
        {/* </CHANGE> */}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.change}
                  </span>
                  <span>지난 달 대비</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>빠른 시작</CardTitle>
            <CardDescription>AI로 새로운 뉴스를 생성하고 고객에게 발송하세요</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <Button className="h-24 flex flex-col gap-2">
              <Plus className="h-6 w-6" />
              <span>새 뉴스 생성</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 bg-transparent">
              <Users className="h-6 w-6" />
              <span>고객 그룹 관리</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 bg-transparent">
              <Send className="h-6 w-6" />
              <span>텔레그램 설정</span>
            </Button>
          </CardContent>
        </Card>
        {/* </CHANGE> */}

        {/* Two Column Layout */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>최근 발송한 뉴스</CardTitle>
              <CardDescription>최근 생성하고 발송한 뉴스 목록</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentContent.map((content) => (
                  <div
                    key={content.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{content.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{content.category}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{content.recipients}명 수신</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{content.date}</span>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          content.status === "발송 완료" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {content.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* </CHANGE> */}

          <Card>
            <CardHeader>
              <CardTitle>이번 달 사용량</CardTitle>
              <CardDescription>월 19,800원 구독 플랜 한도 대비 사용률</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">뉴스 생성</span>
                  <span className="text-sm text-muted-foreground">87 / 무제한</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">메시지 발송</span>
                  <span className="text-sm text-muted-foreground">2,340 / 무제한</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">고객 관리</span>
                  <span className="text-sm text-muted-foreground">456 / 무제한</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">현재 플랜: 월 구독 (₩19,800/월)</p>
                <p className="text-xs text-green-600">✓ 무제한 뉴스 생성 및 발송</p>
              </div>
            </CardContent>
          </Card>
          {/* </CHANGE> */}
        </div>
      </div>
    </DashboardLayout>
  )
}

"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Check, Send, Users } from "lucide-react"

const channels = [
  {
    id: 1,
    name: "부동산 고객 채널",
    telegramId: "@realestate_customers",
    subscribers: 234,
    status: "연결됨",
    lastSent: "2024-01-15 14:30",
  },
  {
    id: 2,
    name: "VIP 고객 전용",
    telegramId: "@vip_customers",
    subscribers: 33,
    status: "연결됨",
    lastSent: "2024-01-15 09:00",
  },
  {
    id: 3,
    name: "잠재 고객 채널",
    telegramId: "@potential_customers",
    subscribers: 189,
    status: "대기중",
    lastSent: "-",
  },
]
// </CHANGE>

export default function TelegramPage() {
  const [botToken, setBotToken] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    // API 연결 로직
    setTimeout(() => {
      setIsConnecting(false)
      alert("텔레그램 봇이 연결되었습니다!")
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">텔레그램 설정</h1>
          <p className="text-muted-foreground mt-2">텔레그램 채널을 연동하고 자동 발송을 설정하세요</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>텔레그램 봇 연동</CardTitle>
              <CardDescription>BotFather에서 생성한 봇 토큰을 입력하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bot-token">봇 토큰</Label>
                <Input
                  id="bot-token"
                  type="password"
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                />
              </div>
              <Button onClick={handleConnect} disabled={isConnecting || !botToken} className="w-full">
                {isConnecting ? "연결 중..." : "봇 연결하기"}
              </Button>
              <div className="text-sm text-muted-foreground space-y-1 pt-2">
                <p className="font-semibold">연동 방법:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>텔레그램에서 @BotFather 검색</li>
                  <li>/newbot 명령어로 봇 생성</li>
                  <li>받은 토큰을 위 입력란에 붙여넣기</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>발송 통계</CardTitle>
              <CardDescription>오늘의 메시지 발송 현황</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Send className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">발송된 메시지</p>
                    <p className="text-2xl font-bold">347</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">도달률</p>
                    <p className="text-2xl font-bold">96.8%</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">활성 구독자</p>
                    <p className="text-2xl font-bold">456</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>연결된 채널</CardTitle>
            <CardDescription>관리 중인 텔레그램 채널 목록</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{channel.name}</p>
                      <p className="text-sm text-muted-foreground">{channel.telegramId}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className={
                            channel.status === "연결됨"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {channel.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{channel.subscribers}명 구독</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <p className="text-xs text-muted-foreground">마지막 발송: {channel.lastSent}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        테스트 발송
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        설정
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

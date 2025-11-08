"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCurrentUser, type User } from "@/lib/auth"
import { createChannel, updateChannel, getChannel, testConnection, type MessagingChannel } from "@/lib/messaging"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

export default function SetupChannelPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const channelId = searchParams.get("id")

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const [name, setName] = useState("")
  const [type, setType] = useState<MessagingChannel["type"]>("telegram")
  const [apiKey, setApiKey] = useState("")
  const [channelIdValue, setChannelIdValue] = useState("")
  const [webhookUrl, setWebhookUrl] = useState("")

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (channelId) {
        const channel = await getChannel(channelId)
        if (channel) {
          setName(channel.name)
          setType(channel.type)
          setApiKey(channel.config.apiKey || "")
          setChannelIdValue(channel.config.channelId || "")
          setWebhookUrl(channel.config.webhookUrl || "")
        }
      }
    }
    loadData()
  }, [channelId])

  const handleTest = async () => {
    setIsTesting(true)
    setTestResult(null)

    try {
      const result = await testConnection(type, {
        apiKey,
        channelId: channelIdValue,
        webhookUrl,
      })
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        message: "연결 테스트 중 오류가 발생했습니다.",
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleSave = async () => {
    if (!user) return

    if (!name.trim() || !apiKey.trim()) {
      alert("필수 항목을 입력해주세요.")
      return
    }

    setIsLoading(true)
    try {
      const channelData = {
        name,
        type,
        status: "connected" as const,
        config: {
          apiKey,
          channelId: channelIdValue,
          webhookUrl,
        },
        userId: user.id,
      }

      if (channelId) {
        await updateChannel(channelId, channelData)
      } else {
        await createChannel(channelData)
      }

      router.push("/dashboard/messages")
    } catch (error) {
      alert("채널 저장 중 오류가 발생했습니다.")
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {channelId ? "채널 설정 수정" : "새 채널 연동"}
          </h1>
          <p className="text-muted-foreground mt-2">메시지 발송을 위한 채널을 설정하세요</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>채널의 이름과 유형을 선택하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">채널 이름</Label>
              <Input
                id="name"
                placeholder="예: 메인 텔레그램 채널"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">채널 유형</Label>
              <Select value={type} onValueChange={(value: any) => setType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="telegram">텔레그램</SelectItem>
                  <SelectItem value="kakao">카카오톡</SelectItem>
                  <SelectItem value="email">이메일</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>연동 설정</CardTitle>
            <CardDescription>
              {type === "telegram" && "Telegram Bot API 토큰과 채널 ID를 입력하세요"}
              {type === "kakao" && "카카오톡 비즈니스 API 키를 입력하세요"}
              {type === "email" && "SMTP 서버 정보를 입력하세요"}
              {type === "sms" && "SMS 서비스 API 키를 입력하세요"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">
                API 키 / 토큰 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="API 키를 입력하세요"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            {type === "telegram" && (
              <div className="space-y-2">
                <Label htmlFor="channelId">채널 ID</Label>
                <Input
                  id="channelId"
                  placeholder="@your_channel"
                  value={channelIdValue}
                  onChange={(e) => setChannelIdValue(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">채널의 @username 또는 chat_id를 입력하세요</p>
              </div>
            )}

            {(type === "telegram" || type === "kakao") && (
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL (선택)</Label>
                <Textarea
                  id="webhookUrl"
                  placeholder="https://your-domain.com/webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  rows={2}
                />
                <p className="text-sm text-muted-foreground">메시지 수신을 위한 webhook URL을 입력하세요</p>
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={handleTest}
                disabled={isTesting || !apiKey.trim()}
                className="w-full bg-transparent"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    연결 테스트 중...
                  </>
                ) : (
                  "연결 테스트"
                )}
              </Button>

              {testResult && (
                <div
                  className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                    testResult.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {testResult.success ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <span className="text-sm">{testResult.message}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.back()} disabled={isLoading} className="flex-1">
            취소
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="flex-1">
            {isLoading ? "저장 중..." : "저장하기"}
          </Button>
        </div>

        {type === "telegram" && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-sm">텔레그램 봇 설정 가이드</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-muted-foreground">
              <ol className="list-decimal list-inside space-y-1">
                <li>텔레그램에서 @BotFather를 검색하여 대화 시작</li>
                <li>/newbot 명령어로 새 봇 생성</li>
                <li>봇 이름과 username 설정</li>
                <li>받은 API 토큰을 위 필드에 입력</li>
                <li>봇을 채널 관리자로 추가</li>
              </ol>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

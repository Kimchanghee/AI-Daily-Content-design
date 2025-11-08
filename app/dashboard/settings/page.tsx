"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Mail, MessageSquare, Globe, Shield, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">설정</h1>
          <p className="text-muted-foreground mt-2">앱 설정과 알림을 관리하세요</p>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <CardTitle>알림 설정</CardTitle>
            </div>
            <CardDescription>다양한 알림을 받을 방법을 설정하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">이메일 알림</Label>
                <p className="text-sm text-muted-foreground">중요한 업데이트를 이메일로 받습니다</p>
              </div>
              <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">푸시 알림</Label>
                <p className="text-sm text-muted-foreground">브라우저 푸시 알림을 받습니다</p>
              </div>
              <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-emails">마케팅 이메일</Label>
                <p className="text-sm text-muted-foreground">새로운 기능과 프로모션 정보를 받습니다</p>
              </div>
              <Switch id="marketing-emails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <CardTitle>언어 및 지역</CardTitle>
            </div>
            <CardDescription>앱의 언어와 시간대를 설정하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>언어</Label>
              <Select defaultValue="ko">
                <SelectTrigger>
                  <SelectValue placeholder="언어 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ko">한국어</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>시간대</Label>
              <Select defaultValue="asia-seoul">
                <SelectTrigger>
                  <SelectValue placeholder="시간대 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asia-seoul">서울 (KST)</SelectItem>
                  <SelectItem value="america-new-york">뉴욕 (EST)</SelectItem>
                  <SelectItem value="europe-london">런던 (GMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <CardTitle>개인정보 및 보안</CardTitle>
            </div>
            <CardDescription>계정 보안 설정을 관리하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Mail className="w-4 h-4 mr-2" />
              이메일 변경
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Shield className="w-4 h-4 mr-2" />
              2단계 인증 설정
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <MessageSquare className="w-4 h-4 mr-2" />
              데이터 다운로드
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              <CardTitle className="text-red-600">위험 구역</CardTitle>
            </div>
            <CardDescription>계정 삭제는 되돌릴 수 없습니다</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full">
              계정 삭제
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

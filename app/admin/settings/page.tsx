"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [allowSignup, setAllowSignup] = useState(true)

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">시스템 설정</h1>
          <p className="text-muted-foreground mt-2">시스템 전반의 설정을 관리하세요</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>일반 설정</CardTitle>
            <CardDescription>시스템의 기본 설정을 관리합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance">유지보수 모드</Label>
                <p className="text-sm text-muted-foreground">
                  활성화 시 관리자를 제외한 모든 사용자의 접근이 차단됩니다
                </p>
              </div>
              <Switch id="maintenance" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="signup">회원가입 허용</Label>
                <p className="text-sm text-muted-foreground">비활성화 시 신규 회원가입이 불가능합니다</p>
              </div>
              <Switch id="signup" checked={allowSignup} onCheckedChange={setAllowSignup} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API 설정</CardTitle>
            <CardDescription>외부 API 연동 설정을 관리합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key">OpenAI API Key</Label>
              <Input id="openai-key" type="password" placeholder="sk-..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegram-token">Telegram Bot Token</Label>
              <Input id="telegram-token" type="password" placeholder="1234567890:ABC..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripe-key">Stripe Secret Key</Label>
              <Input id="stripe-key" type="password" placeholder="sk_test_..." />
            </div>
            <Button>설정 저장</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>데이터베이스</CardTitle>
            <CardDescription>데이터베이스 관리 및 백업</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button variant="outline">데이터베이스 백업</Button>
              <Button variant="outline">캐시 초기화</Button>
              <Button variant="destructive">전체 데이터 초기화</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

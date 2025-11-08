"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser, type User } from "@/lib/auth"
import { Camera, Save } from "lucide-react"

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        setName(currentUser.name)
        setEmail(currentUser.email)
      }
    }
    loadUser()
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleSaveProfile = () => {
    // 실제로는 API 호출
    alert("프로필이 저장되었습니다.")
  }

  const handleSavePassword = () => {
    // 실제로는 API 호출
    alert("비밀번호가 변경되었습니다.")
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">마이페이지</h1>
          <p className="text-muted-foreground mt-2">프로필 정보와 계정 설정을 관리하세요</p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>프로필</CardTitle>
            <CardDescription>나의 기본 정보를 확인하고 수정할 수 있습니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-2">
                  <Badge variant="secondary">{user.role === "admin" ? "관리자" : "일반 사용자"}</Badge>
                </div>
              </div>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">기본 정보</TabsTrigger>
                <TabsTrigger value="password">비밀번호</TabsTrigger>
                <TabsTrigger value="subscription">구독 정보</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4 mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="010-0000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">회사명</Label>
                    <Input
                      id="company"
                      placeholder="소속 회사명"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handleSaveProfile}>
                  <Save className="w-4 h-4 mr-2" />
                  저장하기
                </Button>
              </TabsContent>

              <TabsContent value="password" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">현재 비밀번호</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">새 비밀번호</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                <Button onClick={handleSavePassword}>비밀번호 변경</Button>
              </TabsContent>

              <TabsContent value="subscription" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">현재 플랜</p>
                          <p className="text-sm text-muted-foreground">프로 플랜</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700">활성</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">다음 결제일</p>
                          <p className="text-sm text-muted-foreground">2024년 2월 15일</p>
                        </div>
                        <p className="font-semibold">₩49,000</p>
                      </div>
                      <div className="pt-4 border-t border-border space-y-2">
                        <Button className="w-full">플랜 업그레이드</Button>
                        <Button variant="outline" className="w-full bg-transparent">
                          구독 취소
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

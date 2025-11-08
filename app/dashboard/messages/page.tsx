"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser, type User } from "@/lib/auth"
import {
  getChannels,
  getMessageHistory,
  type MessagingChannel,
  type MessageHistory,
  deleteChannel,
} from "@/lib/messaging"
import { Plus, Send, Settings, Trash2, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function MessagesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [channels, setChannels] = useState<MessagingChannel[]>([])
  const [history, setHistory] = useState<MessageHistory[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        const userChannels = await getChannels(currentUser.id)
        const userHistory = await getMessageHistory(currentUser.id)
        setChannels(userChannels)
        setHistory(userHistory)
      }
    }
    loadData()
  }, [])

  const handleDelete = async () => {
    if (deleteId) {
      await deleteChannel(deleteId)
      setChannels(channels.filter((c) => c.id !== deleteId))
      setDeleteId(null)
    }
  }

  const getStatusColor = (status: MessagingChannel["status"]) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-700"
      case "disconnected":
        return "bg-gray-100 text-gray-700"
      case "error":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getTypeLabel = (type: MessagingChannel["type"]) => {
    switch (type) {
      case "telegram":
        return "텔레그램"
      case "kakao":
        return "카카오톡"
      case "email":
        return "이메일"
      case "sms":
        return "SMS"
      default:
        return type
    }
  }

  const getHistoryStatusColor = (status: MessageHistory["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700"
      case "failed":
        return "bg-red-100 text-red-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const totalSent = history.reduce((sum, h) => sum + h.recipientCount, 0)
  const totalDelivered = history.reduce((sum, h) => sum + h.deliveredCount, 0)
  const totalFailed = history.reduce((sum, h) => sum + h.failedCount, 0)
  const deliveryRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : "0"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">메시지 발송 관리</h1>
            <p className="text-muted-foreground mt-2">채널을 연동하고 메시지 발송 현황을 확인하세요</p>
          </div>
          <Link href="/dashboard/messages/setup">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />새 채널 연동
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 발송</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">전체 발송 건수</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전달 성공</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDelivered.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">성공적으로 전달됨</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전달 실패</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFailed.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">전달 실패 건수</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전달률</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deliveryRate}%</div>
              <p className="text-xs text-muted-foreground">평균 전달 성공률</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="channels" className="space-y-4">
          <TabsList>
            <TabsTrigger value="channels">연동 채널</TabsTrigger>
            <TabsTrigger value="history">발송 이력</TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="space-y-4">
            {channels.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {channels.map((channel) => (
                  <Card key={channel.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{channel.name}</CardTitle>
                          <CardDescription>{getTypeLabel(channel.type)}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(channel.status)}>
                          {channel.status === "connected" ? "연결됨" : "연결 안됨"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm space-y-2">
                        {channel.config.channelId && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">채널 ID:</span>
                            <span className="font-mono">{channel.config.channelId}</span>
                          </div>
                        )}
                        {channel.lastUsed && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">마지막 사용:</span>
                            <span>{new Date(channel.lastUsed).toLocaleDateString("ko-KR")}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/messages/setup?id=${channel.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                            <Settings className="w-4 h-4" />
                            설정
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => setDeleteId(channel.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Send className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">연동된 채널이 없습니다</h3>
                  <p className="text-muted-foreground mb-4 text-center">
                    첫 번째 메시징 채널을 연동하여 콘텐츠를 발송하세요
                  </p>
                  <Link href="/dashboard/messages/setup">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      채널 연동하기
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>발송 이력</CardTitle>
                <CardDescription>최근 메시지 발송 내역을 확인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{item.contentTitle}</p>
                          <Badge className={getHistoryStatusColor(item.status)}>
                            {item.status === "success" ? "성공" : item.status === "failed" ? "실패" : "대기"}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span>{item.channelName}</span>
                          <span>•</span>
                          <span>{new Date(item.sentAt).toLocaleString("ko-KR")}</span>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold">{item.recipientCount}</div>
                          <div className="text-muted-foreground">총 발송</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{item.deliveredCount}</div>
                          <div className="text-muted-foreground">성공</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-red-600">{item.failedCount}</div>
                          <div className="text-muted-foreground">실패</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>채널 연동을 해제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 채널 연동이 해제되면 더 이상 이 채널로 메시지를 발송할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              연동 해제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}

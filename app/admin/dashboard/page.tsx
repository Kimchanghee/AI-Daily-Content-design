"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAdminStats, getSystemLogs, type AdminStats, type SystemLog } from "@/lib/admin"
import { Users, DollarSign, FileText, TrendingUp, AlertCircle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [logs, setLogs] = useState<SystemLog[]>([])

  useEffect(() => {
    const loadData = async () => {
      const adminStats = await getAdminStats()
      const systemLogs = await getSystemLogs(10)
      setStats(adminStats)
      setLogs(systemLogs)
    }
    loadData()
  }, [])

  const getLogIcon = (level: SystemLog["level"]) => {
    switch (level) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case "info":
        return <Info className="w-4 h-4 text-blue-600" />
    }
  }

  const getLogBadge = (level: SystemLog["level"]) => {
    switch (level) {
      case "error":
        return <Badge className="bg-red-100 text-red-700">오류</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-700">경고</Badge>
      case "info":
        return <Badge className="bg-blue-100 text-blue-700">정보</Badge>
    }
  }

  if (!stats) return null

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">관리자 대시보드</h1>
          <p className="text-muted-foreground mt-2">시스템 전체 현황을 확인하세요</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">활성 사용자 수</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">활성 구독</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">구독 중인 사용자</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">이번 달 매출</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₩{(stats.monthlyRevenue / 1000).toFixed(0)}K</div>
              <p className="text-xs text-muted-foreground">총 매출: ₩{(stats.totalRevenue / 1000).toFixed(0)}K</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 콘텐츠</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalContents}</div>
              <p className="text-xs text-muted-foreground">{stats.totalMessages}건 발송됨</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>월별 매출 추이</CardTitle>
              <CardDescription>최근 6개월 매출 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-end justify-between gap-2">
                {[450, 520, 680, 750, 820, 850].map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-blue-500 rounded-t" style={{ height: `${(value / 850) * 100}%` }}></div>
                    <span className="text-xs text-muted-foreground">{index + 1}월</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>사용자 증가 추이</CardTitle>
              <CardDescription>최근 6개월 신규 가입자</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-end justify-between gap-2">
                {[12, 18, 24, 32, 28, 35].map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-green-500 rounded-t" style={{ height: `${(value / 35) * 100}%` }}></div>
                    <span className="text-xs text-muted-foreground">{index + 1}월</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Logs */}
        <Card>
          <CardHeader>
            <CardTitle>시스템 로그</CardTitle>
            <CardDescription>최근 시스템 이벤트 및 알림</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <div className="mt-0.5">{getLogIcon(log.level)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{log.message}</p>
                      {getLogBadge(log.level)}
                    </div>
                    {log.details && <p className="text-xs text-muted-foreground">{log.details}</p>}
                    <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString("ko-KR")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

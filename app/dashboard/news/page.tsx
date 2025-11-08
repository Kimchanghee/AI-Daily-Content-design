"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Calendar, Eye, Send, Trash2 } from "lucide-react"
import Link from "next/link"

const newsItems = [
  {
    id: 1,
    title: "2024년 부동산 시장 전망",
    category: "부동산",
    status: "발송 완료",
    date: "2024-01-15",
    recipients: 234,
    views: 189,
    imageUrl: "/real-estate-market-trends.png",
  },
  {
    id: 2,
    title: "금리 인하 시 대응 전략",
    category: "금융",
    status: "예약됨",
    date: "2024-01-16",
    recipients: 189,
    views: 0,
    imageUrl: "/financial-interest-rate-strategy.jpg",
  },
  {
    id: 3,
    title: "보험 트렌드 리포트 2024",
    category: "보험",
    status: "발송 완료",
    date: "2024-01-14",
    recipients: 312,
    views: 287,
    imageUrl: "/insurance-trends-report.jpg",
  },
  {
    id: 4,
    title: "B2B 영업 효율화 전략",
    category: "영업",
    status: "작성중",
    date: "2024-01-17",
    recipients: 0,
    views: 0,
    imageUrl: "/b2b-sales-strategy.jpg",
  },
]
// </CHANGE>

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNews = newsItems.filter(
    (news) =>
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "발송 완료":
        return "bg-green-100 text-green-700"
      case "예약됨":
        return "bg-blue-100 text-blue-700"
      case "작성중":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      부동산: "bg-purple-100 text-purple-700",
      금융: "bg-blue-100 text-blue-700",
      보험: "bg-green-100 text-green-700",
      영업: "bg-orange-100 text-orange-700",
    }
    return colors[category] || "bg-gray-100 text-gray-700"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">뉴스 콘텐츠 관리</h1>
            <p className="text-muted-foreground mt-2">AI로 생성한 이미지형 뉴스를 관리하고 발송하세요</p>
          </div>
          <Link href="/dashboard/news/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />새 뉴스 생성
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="뉴스 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">전체 뉴스</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newsItems.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">예약됨</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newsItems.filter((n) => n.status === "예약됨").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">발송 완료</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newsItems.filter((n) => n.status === "발송 완료").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">총 수신자</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newsItems.reduce((sum, n) => sum + n.recipients, 0)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((news) => (
            <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative">
                <img
                  src={news.imageUrl || "/placeholder.svg"}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-1">{news.title}</CardTitle>
                  <Badge className={getCategoryColor(news.category)}>{news.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{news.date}</span>
                  </div>
                  <Badge className={getStatusColor(news.status)}>{news.status}</Badge>
                </div>
                {news.status === "발송 완료" && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{news.recipients}명 수신</span>
                    <span>{news.views}회 조회</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                    <Eye className="w-4 h-4" />
                    보기
                  </Button>
                  {news.status !== "발송 완료" && (
                    <Button size="sm" className="flex-1 gap-2">
                      <Send className="w-4 h-4" />
                      발송
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700 bg-transparent">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

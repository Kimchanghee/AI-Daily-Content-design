"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser, type User } from "@/lib/auth"
import { getContents, type Content, deleteContent } from "@/lib/content"
import { Plus, Search, Calendar, FileText, Trash2, Edit, Eye } from "lucide-react"
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

export default function ContentPage() {
  const [user, setUser] = useState<User | null>(null)
  const [contents, setContents] = useState<Content[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        const userContents = await getContents(currentUser.id)
        setContents(userContents)
      }
    }
    loadData()
  }, [])

  const filteredContents = contents.filter(
    (content) =>
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = async () => {
    if (deleteId) {
      await deleteContent(deleteId)
      setContents(contents.filter((c) => c.id !== deleteId))
      setDeleteId(null)
    }
  }

  const getStatusColor = (status: Content["status"]) => {
    switch (status) {
      case "발송 완료":
        return "bg-green-100 text-green-700"
      case "예약됨":
        return "bg-blue-100 text-blue-700"
      case "작성중":
        return "bg-yellow-100 text-yellow-700"
      case "실패":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getPlatformColor = (platform: Content["platform"]) => {
    switch (platform) {
      case "Instagram":
        return "bg-pink-100 text-pink-700"
      case "Facebook":
        return "bg-blue-100 text-blue-700"
      case "Telegram":
        return "bg-sky-100 text-sky-700"
      case "Twitter":
        return "bg-cyan-100 text-cyan-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">콘텐츠 관리</h1>
            <p className="text-muted-foreground mt-2">AI로 생성한 콘텐츠를 관리하고 예약 발송하세요</p>
          </div>
          <Link href="/dashboard/content/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />새 콘텐츠 생성
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="콘텐츠 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">전체 콘텐츠</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contents.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">예약됨</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contents.filter((c) => c.status === "예약됨").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">발송 완료</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contents.filter((c) => c.status === "발송 완료").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">작성중</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contents.filter((c) => c.status === "작성중").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Content List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredContents.map((content) => (
            <Card key={content.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {content.imageUrl && (
                <div className="aspect-video bg-muted relative">
                  <img
                    src={content.imageUrl || "/placeholder.svg"}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-1">{content.title}</CardTitle>
                  <Badge className={getPlatformColor(content.platform)}>{content.platform}</Badge>
                </div>
                <CardDescription className="line-clamp-2">{content.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {content.scheduledDate
                        ? new Date(content.scheduledDate).toLocaleDateString("ko-KR")
                        : "예약 없음"}
                    </span>
                  </div>
                  <Badge className={getStatusColor(content.status)}>{content.status}</Badge>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/content/${content.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                      <Eye className="w-4 h-4" />
                      보기
                    </Button>
                  </Link>
                  <Link href={`/dashboard/content/${content.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                      <Edit className="w-4 h-4" />
                      수정
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
                    onClick={() => setDeleteId(content.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContents.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">콘텐츠가 없습니다</h3>
              <p className="text-muted-foreground mb-4">첫 번째 콘텐츠를 생성해보세요</p>
              <Link href="/dashboard/content/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  콘텐츠 생성하기
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 콘텐츠가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}

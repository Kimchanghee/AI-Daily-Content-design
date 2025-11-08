"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function AdminContentsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">콘텐츠 관리</h1>
          <p className="text-muted-foreground mt-2">전체 콘텐츠를 관리하고 모니터링하세요</p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">콘텐츠 관리 기능</h3>
            <p className="text-muted-foreground text-center">
              전체 사용자의 콘텐츠를 조회하고 관리할 수 있는 기능이 준비 중입니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

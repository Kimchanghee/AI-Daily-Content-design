"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getAllUsers, deleteUser, updateUserRole } from "@/lib/admin"
import type { User } from "@/lib/auth"
import { Search, Trash2, Shield, UserIcon } from "lucide-react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Array<User & { lastLogin?: Date; subscription?: string }>>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      const allUsers = await getAllUsers()
      setUsers(allUsers)
    }
    loadUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = async () => {
    if (deleteId) {
      await deleteUser(deleteId)
      setUsers(users.filter((u) => u.id !== deleteId))
      setDeleteId(null)
    }
  }

  const handleToggleRole = async (userId: string, currentRole: "user" | "admin") => {
    const newRole = currentRole === "admin" ? "user" : "admin"
    await updateUserRole(userId, newRole)
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
  }

  const getSubscriptionBadge = (subscription?: string) => {
    if (!subscription) return <Badge variant="outline">무료</Badge>
    switch (subscription) {
      case "basic":
        return <Badge className="bg-gray-100 text-gray-700">베이직</Badge>
      case "pro":
        return <Badge className="bg-blue-100 text-blue-700">프로</Badge>
      case "enterprise":
        return <Badge className="bg-purple-100 text-purple-700">엔터프라이즈</Badge>
      default:
        return <Badge variant="outline">무료</Badge>
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">사용자 관리</h1>
            <p className="text-muted-foreground mt-2">전체 사용자를 관리하고 모니터링하세요</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">전체 사용자</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredUsers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">활성 구독</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredUsers.filter((u) => u.subscription).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">관리자</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredUsers.filter((u) => u.role === "admin").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">신규 (이번 달)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  filteredUsers.filter(
                    (u) =>
                      new Date(u.createdAt).getMonth() === new Date().getMonth() &&
                      new Date(u.createdAt).getFullYear() === new Date().getFullYear(),
                  ).length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="사용자 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>사용자 목록</CardTitle>
            <CardDescription>전체 사용자 정보를 확인하고 관리하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>역할</TableHead>
                    <TableHead>구독</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead>마지막 로그인</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.role === "admin" ? (
                          <Badge className="bg-red-100 text-red-700">
                            <Shield className="w-3 h-3 mr-1" />
                            관리자
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <UserIcon className="w-3 h-3 mr-1" />
                            사용자
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{getSubscriptionBadge(user.subscription)}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString("ko-KR")}</TableCell>
                      <TableCell>
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString("ko-KR") : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleToggleRole(user.id, user.role)}>
                            {user.role === "admin" ? "사용자로" : "관리자로"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() => setDeleteId(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>사용자를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 사용자의 모든 데이터가 영구적으로 삭제됩니다.
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
    </AdminLayout>
  )
}

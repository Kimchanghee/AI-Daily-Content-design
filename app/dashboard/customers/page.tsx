"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Users, Mail, Phone, MessageSquare } from "lucide-react"

const customers = [
  {
    id: 1,
    name: "홍길동",
    email: "hong@example.com",
    phone: "010-1234-5678",
    telegramId: "@honggildong",
    group: "기존 고객",
    status: "활성",
    lastContact: "2024-01-15",
  },
  {
    id: 2,
    name: "김영희",
    email: "kim@example.com",
    phone: "010-2345-6789",
    telegramId: "@kimyounghee",
    group: "잠재 고객",
    status: "활성",
    lastContact: "2024-01-14",
  },
  {
    id: 3,
    name: "이철수",
    email: "lee@example.com",
    phone: "010-3456-7890",
    telegramId: "@leecheolsoo",
    group: "VIP 고객",
    status: "활성",
    lastContact: "2024-01-16",
  },
  {
    id: 4,
    name: "박민수",
    email: "park@example.com",
    phone: "010-4567-8901",
    telegramId: "",
    group: "잠재 고객",
    status: "비활성",
    lastContact: "2024-01-10",
  },
]

const groups = [
  { name: "기존 고객", count: 234, color: "bg-blue-100 text-blue-700" },
  { name: "잠재 고객", count: 189, color: "bg-green-100 text-green-700" },
  { name: "VIP 고객", count: 33, color: "bg-purple-100 text-purple-700" },
]
// </CHANGE>

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.group.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">고객 관리</h1>
            <p className="text-muted-foreground mt-2">기존 고객과 잠재 고객을 그룹별로 관리하세요</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />새 고객 추가
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="고객 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.name}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  {group.name}
                  <Badge className={group.color}>{group.count}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{group.count}명</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>고객 목록</CardTitle>
            <CardDescription>총 {filteredCustomers.length}명의 고객</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{customer.name}</p>
                        <Badge className={groups.find((g) => g.name === customer.group)?.color}>{customer.group}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {customer.phone}
                      </div>
                      {customer.telegramId && (
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          {customer.telegramId}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        customer.status === "활성" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }
                    >
                      {customer.status}
                    </Badge>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      상세보기
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

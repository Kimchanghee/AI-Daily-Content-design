"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser, type User } from "@/lib/auth"
import {
  getSubscription,
  getPaymentHistory,
  cancelSubscription,
  resumeSubscription,
  createCheckoutSession,
  getPlanById,
  plans,
  type Subscription,
  type PaymentHistory,
} from "@/lib/billing"
import { Check, CreditCard, Download, AlertCircle, Sparkles } from "lucide-react"
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

export default function BillingPage() {
  const searchParams = useSearchParams()
  const success = searchParams.get("success")

  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([])
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        const userSubscription = await getSubscription(currentUser.id)
        const userPayments = await getPaymentHistory(currentUser.id)
        setSubscription(userSubscription)
        setPaymentHistory(userPayments)
      }
    }
    loadData()

    if (success === "true") {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    }
  }, [success])

  const currentPlan = subscription ? getPlanById(subscription.planId) : null

  const handleUpgrade = async (planId: string) => {
    if (!user) return

    setIsProcessing(true)
    try {
      const { url } = await createCheckoutSession(user.id, planId)
      window.location.href = url
    } catch (error) {
      alert("결제 처리 중 오류가 발생했습니다.")
      setIsProcessing(false)
    }
  }

  const handleCancel = async () => {
    if (!subscription) return

    setIsProcessing(true)
    try {
      await cancelSubscription(subscription.id)
      const updatedSubscription = await getSubscription(user!.id)
      setSubscription(updatedSubscription)
      setShowCancelDialog(false)
    } catch (error) {
      alert("구독 취소 중 오류가 발생했습니다.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleResume = async () => {
    if (!subscription) return

    setIsProcessing(true)
    try {
      await resumeSubscription(subscription.id)
      const updatedSubscription = await getSubscription(user!.id)
      setSubscription(updatedSubscription)
    } catch (error) {
      alert("구독 재개 중 오류가 발생했습니다.")
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: Subscription["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">활성</Badge>
      case "canceled":
        return <Badge className="bg-red-100 text-red-700">취소됨</Badge>
      case "expired":
        return <Badge className="bg-gray-100 text-gray-700">만료됨</Badge>
      case "trial":
        return <Badge className="bg-blue-100 text-blue-700">체험판</Badge>
    }
  }

  const getPaymentStatusBadge = (status: PaymentHistory["status"]) => {
    switch (status) {
      case "succeeded":
        return <Badge className="bg-green-100 text-green-700">성공</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-700">실패</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">대기중</Badge>
    }
  }

  // 사용량 데이터 (실제로는 API에서 가져옴)
  const usage = {
    contentGeneration: 48,
    messageSends: 320,
    imageGeneration: 24,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">구독 및 결제</h1>
          <p className="text-muted-foreground mt-2">플랜을 관리하고 결제 내역을 확인하세요</p>
        </div>

        {showSuccess && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-700">
                <Check className="w-5 h-5" />
                <span className="font-medium">결제가 성공적으로 완료되었습니다!</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="subscription" className="space-y-4">
          <TabsList>
            <TabsTrigger value="subscription">현재 구독</TabsTrigger>
            <TabsTrigger value="plans">플랜 변경</TabsTrigger>
            <TabsTrigger value="history">결제 내역</TabsTrigger>
          </TabsList>

          <TabsContent value="subscription" className="space-y-4">
            {subscription && currentPlan ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">{currentPlan.name} 플랜</CardTitle>
                        <CardDescription>월 ₩{currentPlan.price.toLocaleString()}</CardDescription>
                      </div>
                      {getStatusBadge(subscription.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">다음 결제일</span>
                        <span className="font-medium">
                          {new Date(subscription.currentPeriodEnd).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      {subscription.cancelAtPeriodEnd && (
                        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm text-yellow-700">
                            구독이 {new Date(subscription.currentPeriodEnd).toLocaleDateString("ko-KR")}에 종료됩니다
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border space-y-2">
                      <h4 className="font-semibold mb-4">포함된 기능</h4>
                      <div className="grid gap-2">
                        {currentPlan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-600" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border space-y-2">
                      {subscription.cancelAtPeriodEnd ? (
                        <Button onClick={handleResume} disabled={isProcessing} className="w-full">
                          구독 재개하기
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => setShowCancelDialog(true)}
                          disabled={isProcessing}
                          className="w-full text-red-600 hover:text-red-700"
                        >
                          구독 취소
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Usage Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>이번 달 사용량</CardTitle>
                    <CardDescription>현재 플랜 한도 대비 사용률</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">AI 콘텐츠 생성</span>
                        <span className="text-sm text-muted-foreground">
                          {usage.contentGeneration} / {currentPlan.limits.contentGeneration}
                        </span>
                      </div>
                      <Progress
                        value={(usage.contentGeneration / currentPlan.limits.contentGeneration) * 100}
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">메시지 발송</span>
                        <span className="text-sm text-muted-foreground">
                          {usage.messageSends} / {currentPlan.limits.messageSends.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(usage.messageSends / currentPlan.limits.messageSends) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">이미지 생성</span>
                        <span className="text-sm text-muted-foreground">
                          {usage.imageGeneration} / {currentPlan.limits.imageGeneration}
                        </span>
                      </div>
                      <Progress
                        value={(usage.imageGeneration / currentPlan.limits.imageGeneration) * 100}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CreditCard className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">활성 구독이 없습니다</h3>
                  <p className="text-muted-foreground mb-4 text-center">
                    플랜을 선택하여 AI Daily Content를 시작하세요
                  </p>
                  <Button onClick={() => document.querySelector<HTMLButtonElement>('[value="plans"]')?.click()}>
                    플랜 선택하기
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="plans" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => {
                const isCurrentPlan = subscription?.planId === plan.id
                const isUpgrade =
                  subscription &&
                  plans.findIndex((p) => p.id === subscription.planId) < plans.findIndex((p) => p.id === plan.id)

                return (
                  <Card
                    key={plan.id}
                    className={`relative ${plan.id === "pro" ? "border-blue-500 shadow-lg ring-2 ring-blue-500" : ""}`}
                  >
                    {plan.id === "pro" && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-blue-600 text-white px-4 py-1">
                          <Sparkles className="w-3 h-3 mr-1 inline" />
                          추천
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-3xl font-bold">₩{plan.price.toLocaleString()}</span>
                        <span className="text-muted-foreground">/{plan.interval === "month" ? "월" : "년"}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        className="w-full"
                        variant={isCurrentPlan ? "outline" : "default"}
                        disabled={isCurrentPlan || isProcessing}
                        onClick={() => handleUpgrade(plan.id)}
                      >
                        {isCurrentPlan ? "현재 플랜" : isUpgrade ? "업그레이드" : "플랜 선택"}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>결제 내역</CardTitle>
                <CardDescription>과거 결제 내역을 확인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{payment.description}</p>
                          {getPaymentStatusBadge(payment.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.createdAt).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold">₩{payment.amount.toLocaleString()}</span>
                        {payment.invoiceUrl && payment.status === "succeeded" && (
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                            <Download className="w-4 h-4" />
                            영수증
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>구독을 취소하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              구독을 취소하면 현재 결제 기간이 종료될 때까지 서비스를 이용할 수 있으며, 이후 자동으로 갱신되지 않습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>돌아가기</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-red-600 hover:bg-red-700">
              구독 취소
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}

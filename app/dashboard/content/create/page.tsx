"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getCurrentUser, type User } from "@/lib/auth"
import { createContent, generateAIContent } from "@/lib/content"
import { Sparkles, CalendarIcon, Wand2, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

export default function CreateContentPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [platform, setPlatform] = useState<"Instagram" | "Facebook" | "Telegram" | "Twitter">("Instagram")
  const [scheduledDate, setScheduledDate] = useState<Date>()
  const [aiPrompt, setAiPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }
    loadUser()
  }, [])

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      alert("AI 프롬프트를 입력해주세요.")
      return
    }

    setIsGenerating(true)
    try {
      const generated = await generateAIContent(aiPrompt, platform)
      setTitle(generated.title)
      setDescription(generated.description)
      setContent(generated.content)
    } catch (error) {
      alert("AI 콘텐츠 생성 중 오류가 발생했습니다.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async (status: "작성중" | "예약됨") => {
    if (!user) return

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.")
      return
    }

    if (status === "예약됨" && !scheduledDate) {
      alert("예약 발송일을 선택해주세요.")
      return
    }

    setIsSaving(true)
    try {
      await createContent({
        title,
        description,
        content,
        platform,
        status,
        scheduledDate,
        userId: user.id,
      })

      router.push("/dashboard/content")
    } catch (error) {
      alert("콘텐츠 저장 중 오류가 발생했습니다.")
      setIsSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">새 콘텐츠 생성</h1>
          <p className="text-muted-foreground mt-2">AI를 활용하여 매력적인 SNS 콘텐츠를 생성하세요</p>
        </div>

        {/* AI Generator */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <CardTitle>AI 콘텐츠 생성</CardTitle>
            </div>
            <CardDescription>어떤 내용의 콘텐츠를 만들고 싶은지 설명해주세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-prompt">AI 프롬프트</Label>
              <Textarea
                id="ai-prompt"
                placeholder="예: 새로운 겨울 신상품 출시를 알리는 매력적인 홍보 문구를 작성해주세요"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>플랫폼 선택</Label>
              <Select value={platform} onValueChange={(value: any) => setPlatform(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Telegram">Telegram</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerateAI} disabled={isGenerating} className="w-full gap-2">
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AI 생성 중...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  AI로 콘텐츠 생성
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Content Form */}
        <Card>
          <CardHeader>
            <CardTitle>콘텐츠 정보</CardTitle>
            <CardDescription>생성된 콘텐츠를 수정하거나 직접 작성하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input id="title" placeholder="콘텐츠 제목" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Input
                id="description"
                placeholder="간단한 설명"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">콘텐츠 내용</Label>
              <Textarea
                id="content"
                placeholder="발송할 메시지 내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
              />
              <p className="text-sm text-muted-foreground">{content.length} / 2000 자</p>
            </div>

            <div className="space-y-2">
              <Label>예약 발송일 (선택)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, "PPP", { locale: ko }) : <span>날짜를 선택하세요</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.back()} disabled={isSaving} className="flex-1">
            취소
          </Button>
          <Button variant="outline" onClick={() => handleSave("작성중")} disabled={isSaving} className="flex-1">
            임시 저장
          </Button>
          <Button onClick={() => handleSave("예약됨")} disabled={isSaving} className="flex-1">
            {isSaving ? "저장 중..." : "예약 발송"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

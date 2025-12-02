"use client"

import { Button } from "@/components/ui/button"

interface TemplatePreviewProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  onDownload: () => void
  isMobile: boolean
}

export default function TemplatePreview({
  canvasRef,
  onDownload,
  isMobile,
}: TemplatePreviewProps) {
  if (isMobile) {
    return (
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-black rounded-full" />
          미리보기
        </h3>
        <div className="bg-gray-200 rounded-xl p-4 flex justify-center">
          <canvas ref={canvasRef} className="rounded-lg shadow-2xl" />
        </div>
        <div className="mt-4 flex justify-center">
          <Button
            onClick={onDownload}
            className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-sm font-bold rounded-full shadow-lg"
          >
            이미지 다운로드 (PNG)
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-black rounded-full" />
        미리보기
      </h3>
      <div className="bg-gray-100 rounded-xl p-6 flex justify-center">
        <canvas ref={canvasRef} className="rounded-lg shadow-xl" />
      </div>
      <div className="mt-6 flex flex-col items-center">
        <Button
          onClick={onDownload}
          className="bg-black hover:bg-gray-800 text-white px-10 py-4 text-sm font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          이미지 다운로드 (PNG)
        </Button>
        <p className="text-center text-xs text-gray-500 mt-3">
          540 x 960px (9:16) • PNG 고화질 • 매일 오후 9시 업데이트
        </p>
      </div>
    </div>
  )
}

"use client"

import { TEMPLATES } from "@/components/templates/template-types"

interface TemplateSelectorProps {
  selectedTemplate: string
  onSelectTemplate: (id: string) => void
  miniCanvasRefs: React.MutableRefObject<Map<string, HTMLCanvasElement>>
  isMobile: boolean
}

export default function TemplateSelector({
  selectedTemplate,
  onSelectTemplate,
  miniCanvasRefs,
  isMobile,
}: TemplateSelectorProps) {
  const setMiniCanvasRef = (id: string) => (el: HTMLCanvasElement | null) => {
    if (el) {
      miniCanvasRefs.current.set(id, el)
    }
  }

  if (isMobile) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-black rounded-full" />
          템플릿 선택
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={`relative flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 p-2 ${
                selectedTemplate === template.id
                  ? "border-black shadow-lg scale-105"
                  : "border-gray-200"
              }`}
              style={{ background: template.previewBg, width: "80px" }}
            >
              <div className="flex items-center justify-center">
                <canvas ref={setMiniCanvasRef(template.id)} className="rounded" />
              </div>
              <p className="text-[10px] font-bold text-center mt-1 text-white drop-shadow-md truncate">
                {template.name}
              </p>
              {selectedTemplate === template.id && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px]">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="lg:w-[280px] shrink-0">
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-black rounded-full" />
        템플릿 선택
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 p-2 ${
              selectedTemplate === template.id
                ? "border-black shadow-lg"
                : "border-gray-200 hover:border-gray-400"
            }`}
            style={{ background: template.previewBg }}
          >
            <div className="flex items-center justify-center">
              <canvas ref={setMiniCanvasRef(template.id)} className="rounded" />
            </div>
            <p className="text-[10px] font-bold text-center mt-2 text-white drop-shadow-md truncate px-1">
              {template.name}
            </p>
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-[10px]">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

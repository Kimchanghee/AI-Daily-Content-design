import type { NewsItem, UserInfo } from "./template-types.js"
import {
  renderSoftBlue,
  renderElegantSchool,
  renderPastelVintage,
  renderCreamModern,
  renderSageGreen,
  renderElegantBeige,
  renderSoftLavender,
  renderClassicMono,
  renderWarmPeach,
  renderMintGreen,
} from "./renderers/index.js"

// 템플릿 렌더링 함수 매핑
const templateRenderers: Record<
  string,
  (ctx: CanvasRenderingContext2D, width: number, height: number, news: NewsItem[], user: UserInfo) => void
> = {
  "soft-blue": renderSoftBlue,
  "elegant-school": renderElegantSchool,
  "pastel-vintage": renderPastelVintage,
  "cream-modern": renderCreamModern,
  "sage-green": renderSageGreen,
  "elegant-beige": renderElegantBeige,
  "soft-lavender": renderSoftLavender,
  "classic-mono": renderClassicMono,
  "warm-peach": renderWarmPeach,
  "mint-green": renderMintGreen,
}

export const renderMiniPreview = (
  templateId: string,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo
) => {
  const scaleX = width / 540
  const scaleY = height / 960

  ctx.save()
  ctx.scale(scaleX, scaleY)

  const renderer = templateRenderers[templateId] || renderSoftBlue
  renderer(ctx, 540, 960, news, user)

  ctx.restore()
}

export const renderTemplate = (
  templateId: string,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  news: NewsItem[],
  user: UserInfo
) => {
  const renderer = templateRenderers[templateId] || renderSoftBlue
  renderer(ctx, width, height, news, user)
}

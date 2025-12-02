"use client"

export default function HeroBanner() {
  return (
    <section className="relative bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-white rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-[1400px] mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight tracking-tight">
            고객에게 보낼 뉴스,
            <br />
            아직도 직접 만드세요?
          </h2>
          <p className="text-gray-400 text-base md:text-lg mb-6 leading-relaxed">
            매일 아침 뉴스 정리하느라 30분씩 쓰지 마세요.
            <br />
            클릭 한 번으로 프로페셔널한 뉴스 이미지를 받아보세요.
          </p>
          <div className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-bold">
            지금 가입하면 3일 무료 체험
          </div>
        </div>
      </div>
    </section>
  )
}

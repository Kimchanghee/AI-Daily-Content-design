"use client"

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center text-sm text-gray-600 space-y-1">
          <p className="font-bold text-gray-800">주식회사 데일리뉴스코리아</p>
          <p>대표: 홍길동 | 사업자등록번호: 123-45-67890</p>
          <p>주소: 서울특별시 강남구 테헤란로 123, 데일리빌딩 15층</p>
          <p>고객센터: 02-1234-5678 | 이메일: support@dailynews.kr</p>
          <p className="text-gray-400 pt-3">© 2025 DailyNews Korea. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

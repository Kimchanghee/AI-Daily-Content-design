# 다국어 이메일 템플릿

## 한국어, 영어, 일본어 자동 전환

회원가입 시 언어 정보를 메타데이터에 포함하여 자동으로 언어별 이메일을 발송할 수 있습니다.

### 코드 수정

`app/auth/signup/page.tsx`에서:

\`\`\`typescript
const locale = localStorage.getItem('locale') || 'ko'

await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      name: name,
      locale: locale, // 언어 정보 추가
    }
  }
})
\`\`\`

### 다국어 템플릿 예시

\`\`\`html
<!-- 언어별 제목 -->
{{ if eq .Data.user_metadata.locale "ko" }}
  <h2>회원가입을 환영합니다!</h2>
{{ else if eq .Data.user_metadata.locale "ja" }}
  <h2>ご登録ありがとうございます！</h2>
{{ else }}
  <h2>Welcome to AI Daily Content!</h2>
{{ end }}

<!-- 언어별 본문 -->
{{ if eq .Data.user_metadata.locale "ko" }}
  <p>안녕하세요, <strong>{{ .Data.user_metadata.name }}</strong>님!</p>
  <p>AI Daily Content에 가입해 주셔서 감사합니다.</p>
{{ else if eq .Data.user_metadata.locale "ja" }}
  <p>こんにちは、<strong>{{ .Data.user_metadata.name }}</strong>様！</p>
  <p>AI Daily Contentにご登録いただきありがとうございます。</p>
{{ else }}
  <p>Hello, <strong>{{ .Data.user_metadata.name }}</strong>!</p>
  <p>Thank you for signing up for AI Daily Content.</p>
{{ end }}
\`\`\`

이제 사용자의 선택 언어에 따라 자동으로 적절한 언어로 이메일이 발송됩니다.

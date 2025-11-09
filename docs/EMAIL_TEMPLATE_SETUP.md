# Supabase 이메일 템플릿 설정 가이드

## 개요
AI Daily Content 서비스의 회원가입 인증 이메일을 전문적이고 브랜드에 맞게 커스터마이즈하는 방법입니다.

## Supabase 대시보드 설정

### 1. Supabase 대시보드 접속
1. [https://supabase.com](https://supabase.com) 로그인
2. 프로젝트 선택
3. 좌측 메뉴에서 **Authentication** → **Email Templates** 클릭

### 2. Confirm Signup 템플릿 수정

**기본 템플릿을 아래 내용으로 교체하세요:**

\`\`\`html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Daily Content 회원가입 인증</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- 헤더 -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                ✨ AI Daily Content
              </h1>
            </td>
          </tr>

          <!-- 본문 -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1e293b; font-size: 24px; font-weight: 600;">
                회원가입을 환영합니다!
              </h2>
              
              <p style="margin: 0 0 20px; color: #475569; font-size: 16px; line-height: 1.6;">
                안녕하세요, <strong>{{ .Data.user_metadata.name }}</strong>님!
              </p>
              
              <p style="margin: 0 0 30px; color: #475569; font-size: 16px; line-height: 1.6;">
                AI Daily Content에 가입해 주셔서 감사합니다. 아래 버튼을 클릭하여 이메일 주소를 인증하고 AI 기반 뉴스레터 생성을 시작하세요.
              </p>

              <!-- 인증 버튼 -->
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="{{ .ConfirmationURL }}" 
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);">
                      이메일 인증하기
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                버튼이 작동하지 않는 경우, 아래 링크를 복사하여 브라우저에 붙여넣으세요:
              </p>
              
              <p style="margin: 10px 0 0; color: #2563eb; font-size: 14px; word-break: break-all;">
                {{ .ConfirmationURL }}
              </p>

              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">

              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                본인이 요청하지 않은 경우 이 이메일을 무시하셔도 됩니다.
              </p>
            </td>
          </tr>

          <!-- 푸터 -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8fafc; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">
                © 2025 AI Daily Content. All rights reserved.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                AI 기반 자동 뉴스레터 생성 서비스
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
\`\`\`

### 3. 이메일 제목 설정

**Subject 필드를 다음과 같이 수정:**

\`\`\`
[AI Daily Content] 회원가입 이메일 인증
\`\`\`

또는 사용자 이름을 포함하려면:

\`\`\`
{{ .Data.user_metadata.name }}님, AI Daily Content 가입을 환영합니다!
\`\`\`

### 4. 다른 이메일 템플릿도 수정

#### Invite User (사용자 초대)
**Subject:** `[AI Daily Content] 서비스 초대장`

#### Magic Link (매직 링크 로그인)
**Subject:** `[AI Daily Content] 로그인 링크`

#### Reset Password (비밀번호 재설정)
**Subject:** `[AI Daily Content] 비밀번호 재설정 요청`

## 사용 가능한 변수

Supabase 이메일 템플릿에서 사용할 수 있는 변수:

- `{{ .Email }}` - 사용자 이메일
- `{{ .Token }}` - 인증 토큰
- `{{ .TokenHash }}` - 토큰 해시
- `{{ .ConfirmationURL }}` - 인증 URL (자동 생성)
- `{{ .Data.user_metadata.name }}` - 사용자 이름
- `{{ .Data.user_metadata.full_name }}` - 전체 이름
- `{{ .SiteURL }}` - 사이트 URL

## 테스트

1. 템플릿 수정 후 **Save** 클릭
2. 테스트 회원가입으로 이메일 확인
3. 모바일과 데스크톱에서 이메일 렌더링 확인

## SMTP 설정 (선택사항)

더 나은 이메일 전송률을 위해 커스텀 SMTP를 설정할 수 있습니다:

1. **Settings** → **Project Settings** → **SMTP Settings**
2. 추천 서비스:
   - SendGrid
   - AWS SES
   - Mailgun
   - Resend

## 참고사항

- 이메일 템플릿은 HTML과 CSS를 지원하지만, JavaScript는 지원하지 않습니다
- 모든 CSS는 인라인 스타일로 작성해야 합니다
- 이미지는 절대 URL을 사용해야 합니다
- 다국어 지원을 위해 조건문을 사용할 수 있습니다

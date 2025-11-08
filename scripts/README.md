# 샘플 계정 생성 가이드

## 실행 순서

### 1단계: Auth 사용자 생성
Supabase Dashboard → SQL Editor에서 `01-create-auth-users.sql` 실행

이 스크립트는 다음 사용자를 생성합니다:
- **일반 사용자**: demo@aidaily.com / demo123456
- **관리자**: admin@aidaily.com / admin123456

### 2단계: 샘플 데이터 생성
Supabase Dashboard → SQL Editor에서 `02-create-sample-data.sql` 실행

이 스크립트는 다음 데이터를 생성합니다:
- 프로필 2개 (일반 사용자, 관리자)
- 구독 정보 1개 (Pro 플랜)
- 고객 그룹 3개 (VIP, 일반, 체험)
- 고객 3명
- 뉴스 콘텐츠 3개
- 텔레그램 설정 1개
- 발송 이력 1개

## 로그인 테스트

### 방법 1: UI에서 로그인
1. `/auth/login` 페이지 접속
2. 이메일: `demo@aidaily.com`
3. 비밀번호: `demo123456`
4. 로그인 버튼 클릭

### 방법 2: 관리자 로그인
1. `/auth/login` 페이지 접속
2. 이메일: `admin@aidaily.com`
3. 비밀번호: `admin123456`
4. 로그인 버튼 클릭

## 로그인 후 확인 사항

### 일반 사용자 (demo@aidaily.com)
- `/dashboard` - 대시보드 접근 가능
- `/dashboard/customers` - 3명의 고객 표시
- `/dashboard/content` - 3개의 뉴스 콘텐츠 표시
- `/dashboard/mypage` - 프로필 정보 표시

### 관리자 (admin@aidaily.com)
- `/admin/dashboard` - 관리자 대시보드 접근
- `/admin/users` - 전체 사용자 관리
- `/admin/contents` - 전체 콘텐츠 관리

## 문제 해결

### 오류: "null value in column violates not-null constraint"
- 01-create-auth-users.sql을 먼저 실행했는지 확인
- auth.users 테이블에 사용자가 생성되었는지 확인:
  \`\`\`sql
  SELECT id, email FROM auth.users WHERE email IN ('demo@aidaily.com', 'admin@aidaily.com');
  \`\`\`

### 오류: "violates foreign key constraint"
- profiles.id가 auth.users.id를 참조하므로 auth 사용자가 먼저 생성되어야 함
- 01-create-auth-users.sql을 다시 실행

### 로그인 실패
- 이메일과 비밀번호를 정확히 입력했는지 확인
- Supabase Dashboard → Authentication → Users에서 사용자가 존재하는지 확인
- email_confirmed_at이 NULL이 아닌지 확인

## 데이터 초기화

샘플 데이터를 삭제하고 다시 시작하려면:

\`\`\`sql
-- 샘플 데이터 삭제
DELETE FROM send_history WHERE user_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM telegram_settings WHERE user_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM news_content WHERE user_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM customers WHERE user_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM customer_groups WHERE user_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM subscriptions WHERE user_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM profiles WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM auth.identities WHERE user_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM auth.users WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
\`\`\`

그 후 01과 02 스크립트를 순서대로 다시 실행하세요.

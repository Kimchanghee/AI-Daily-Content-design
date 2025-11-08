# 샘플 계정 정보

## 계정 생성 방법

### 1단계: Supabase에서 사용자 생성

Supabase Dashboard에서 사용자를 생성하세요:

1. Supabase Dashboard 접속
2. Authentication > Users 메뉴 이동
3. "Add User" 버튼 클릭
4. 아래 정보로 사용자 생성

### 2단계: SQL 스크립트 실행

사용자 생성 후, 다음 스크립트를 순서대로 실행하세요:
1. `scripts/02-add-sample-data.sql` - 샘플 데이터 추가

---

## 샘플 계정 정보

### 일반 사용자 (데모 계정)
- **이메일**: `demo@aidaily.com`
- **비밀번호**: `Demo123!@#`
- **이름**: 김데모
- **회사**: 데모 컴퍼니
- **직책**: 마케팅 매니저
- **플랜**: Pro (월 49,000원)
- **사용량**: 23/100

**포함된 샘플 데이터:**
- 고객 그룹 3개 (VIP, 일반, 체험)
- 고객 3명 (이철수, 박영희, 김민수)
- 뉴스 콘텐츠 3개 (발행 2개, 초안 1개)
- 텔레그램 설정 1개
- 발송 이력 1개

### 관리자 계정
- **이메일**: `admin@aidaily.com`
- **비밀번호**: `Admin123!@#`
- **이름**: 관리자
- **회사**: AI Daily Content
- **직책**: CEO

---

## 로그인 테스트 방법

### 방법 1: 회원가입 페이지에서 직접 가입
1. 브라우저에서 `/auth/signup` 접속
2. 위의 계정 정보로 가입
3. 이메일 확인 (개발 환경에서는 자동 확인됨)
4. `/auth/login`에서 로그인

### 방법 2: Supabase Dashboard에서 직접 생성
1. Supabase Dashboard > Authentication > Users
2. "Add User" 클릭
3. 이메일과 비밀번호 입력
4. "Auto Confirm User" 체크
5. 생성 후 `/auth/login`에서 로그인

---

## 각 페이지 접근 방법

### 일반 사용자 (demo@aidaily.com)
- 대시보드: `/dashboard`
- 콘텐츠 관리: `/dashboard/content`
- 콘텐츠 생성: `/dashboard/content/create`
- 고객 관리: `/dashboard/customers`
- 뉴스 관리: `/dashboard/news`
- 텔레그램 설정: `/dashboard/telegram`
- 메시지 관리: `/dashboard/messages`
- 마이페이지: `/dashboard/mypage`
- 설정: `/dashboard/settings`
- 결제: `/dashboard/billing`

### 관리자 (admin@aidaily.com)
- 관리자 대시보드: `/admin/dashboard`
- 사용자 관리: `/admin/users`
- 콘텐츠 관리: `/admin/contents`

---

## 데이터베이스 확인

샘플 데이터가 제대로 생성되었는지 확인하려면:

\`\`\`sql
-- 프로필 확인
SELECT * FROM profiles WHERE email IN ('demo@aidaily.com', 'admin@aidaily.com');

-- 구독 정보 확인
SELECT * FROM subscriptions WHERE user_id IN (SELECT id FROM profiles WHERE email = 'demo@aidaily.com');

-- 고객 그룹 확인
SELECT * FROM customer_groups;

-- 고객 확인
SELECT * FROM customers;

-- 뉴스 콘텐츠 확인
SELECT * FROM news_content ORDER BY created_at DESC;
\`\`\`

---

## 문제 해결

### 로그인이 안 되는 경우
1. Supabase Dashboard에서 사용자가 제대로 생성되었는지 확인
2. 이메일이 확인되었는지 확인 (Email Confirmed 상태)
3. 비밀번호가 정확한지 확인

### 데이터가 보이지 않는 경우
1. SQL 스크립트가 성공적으로 실행되었는지 확인
2. RLS (Row Level Security) 정책이 올바르게 설정되었는지 확인
3. 로그인한 사용자 ID와 데이터의 user_id가 일치하는지 확인

### 페이지 접근이 안 되는 경우
1. 로그인 세션이 유효한지 확인
2. 브라우저 콘솔에서 오류 메시지 확인
3. Supabase 환경 변수가 올바르게 설정되었는지 확인

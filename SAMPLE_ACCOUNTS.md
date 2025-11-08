# 샘플 계정 정보

## ✅ SQL 스크립트로 바로 생성 가능!

`scripts/create-sample-users-and-data.sql` 스크립트를 실행하면 아래 계정들이 **Supabase Auth에 직접 생성**됩니다.

---

## 📧 샘플 계정

### 1. 일반 사용자 계정
- **이메일**: `demo@aidaily.com`
- **비밀번호**: `Demo123!@#`
- **권한**: 일반 사용자
- **플랜**: Pro (월 49,000원)
- **사용량**: 23/100

**포함 데이터**:
- ✅ 고객 그룹 3개 (VIP, 일반, 체험)
- ✅ 고객 3명 (이철수, 박영희, 김민수)
- ✅ 뉴스 콘텐츠 3개 (발행 2개, 초안 1개)
- ✅ 텔레그램 설정 1개
- ✅ 발송 이력 3개

### 2. 관리자 계정
- **이메일**: `admin@aidaily.com`
- **비밀번호**: `Admin123!@#`
- **권한**: 관리자
- **접근 가능**: `/admin` 모든 페이지

---

## 🚀 사용 방법

### 1단계: SQL 스크립트 실행
1. v0 UI에서 `scripts/create-sample-users-and-data.sql` 찾기
2. **실행(Run) 버튼** 클릭
3. 완료 메시지 확인

### 2단계: 로그인
1. `/auth/login` 페이지 이동
2. 위 계정 정보로 로그인
3. 일반 사용자: `/dashboard` 접속
4. 관리자: `/admin/dashboard` 접속

---

## 📊 생성되는 샘플 데이터

### 고객 그룹
- VIP 고객
- 일반 고객  
- 체험 고객

### 고객 정보
- 이철수 (VIP 고객, @chulsoo_lee)
- 박영희 (일반 고객, @younghee_park)
- 김민수 (체험 고객, @minsu_kim)

### 뉴스 콘텐츠
1. "AI 기술의 최신 동향" (발행됨, 1일 전)
2. "마케팅 자동화 전략" (발행됨, 3일 전)
3. "데이터 분석의 중요성" (초안)

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

## ⚠️ 참고사항

- 스크립트는 **중복 실행해도 안전**합니다 (ON CONFLICT DO NOTHING)
- 비밀번호는 Supabase에서 **bcrypt로 자동 해싱**됩니다
- 모든 데이터는 **RLS (Row Level Security)**로 보호됩니다
- 스크립트 실행 후 **바로 로그인 가능**합니다

---

## 🔧 문제 해결

### 로그인이 안 되는 경우
1. **SQL 스크립트가 성공적으로 실행되었는지 확인**
2. Supabase Dashboard → Authentication → Users에서 사용자 확인
3. 이메일/비밀번호를 정확히 입력했는지 확인 (`Demo123!@#`, `Admin123!@#`)

### 데이터가 보이지 않는 경우
1. 올바른 계정으로 로그인했는지 확인
2. RLS 정책이 활성화되어 있는지 확인
3. 브라우저 콘솔에서 오류 메시지 확인

### 스크립트 실행 오류가 발생하는 경우
1. Supabase 연결이 정상인지 확인
2. 데이터베이스 테이블이 생성되어 있는지 확인 (`scripts/001_initial_schema.sql`, `scripts/002_create_tables.sql` 먼저 실행)
3. auth 스키마 접근 권한이 있는지 확인

---

## 데이터베이스 확인

샘플 데이터가 제대로 생성되었는지 확인:

\`\`\`sql
-- 사용자 확인 (Supabase Auth)
SELECT id, email, created_at FROM auth.users 
WHERE email IN ('demo@aidaily.com', 'admin@aidaily.com');

-- 프로필 확인
SELECT * FROM profiles 
WHERE email IN ('demo@aidaily.com', 'admin@aidaily.com');

-- 구독 정보 확인
SELECT * FROM subscriptions 
WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid;

-- 고객 그룹 및 고객 확인
SELECT * FROM customer_groups;
SELECT * FROM customers;

-- 뉴스 콘텐츠 확인
SELECT * FROM news_contents ORDER BY created_at DESC;

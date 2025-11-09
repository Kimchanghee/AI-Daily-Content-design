# 데이터베이스 마이그레이션 가이드

## 개요
이 마이그레이션은 사용자 역할(role) 관리 시스템을 개선합니다.

## 변경사항

### 1. 데이터베이스 스키마
- `profiles` 테이블에 `role` 컬럼 추가 (기본값: 'user', CHECK 제약: 'user' | 'admin')
- `is_admin()` 헬퍼 함수 생성 (관리자 권한 확인용)

### 2. RLS (Row Level Security) 정책
모든 테이블의 RLS 정책을 업데이트하여 관리자가 모든 데이터에 접근할 수 있도록 개선:
- `profiles` - 관리자는 모든 프로필 조회/수정/삭제 가능
- `customer_groups` - 관리자는 모든 그룹 조회/수정/삭제 가능
- `customers` - 관리자는 모든 고객 조회/수정/삭제 가능
- `news_content` - 관리자는 모든 콘텐츠 조회/수정/삭제 가능
- `send_history` - 관리자는 모든 발송 기록 조회/삭제 가능
- `subscriptions` - 관리자는 모든 구독 조회/수정/삭제 가능
- `telegram_settings` - 관리자는 모든 설정 조회/수정/삭제 가능

### 3. 인증 로직
- **이전**: 이메일 하드코딩 방식 (`admin@aidaily.com`)
- **이후**: 데이터베이스 `role` 컬럼 기반

## 마이그레이션 실행 방법

### Supabase Dashboard 사용
1. Supabase 프로젝트 대시보드 접속
2. SQL Editor 메뉴 선택
3. `scripts/003_add_role_column_and_update_rls.sql` 파일 내용 복사
4. SQL Editor에 붙여넣기
5. "RUN" 버튼 클릭

### Supabase CLI 사용 (로컬 개발)
```bash
# Supabase CLI 설치 (필요한 경우)
npm install -g supabase

# 프로젝트 연결
supabase link --project-ref YOUR_PROJECT_REF

# 마이그레이션 실행
supabase db push
```

## 마이그레이션 후 확인사항

### 1. role 컬럼 확인
```sql
SELECT id, email, name, role FROM public.profiles LIMIT 10;
```

### 2. 관리자 계정 확인
```sql
SELECT id, email, name, role FROM public.profiles WHERE role = 'admin';
```

### 3. RLS 정책 확인
```sql
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 4. is_admin() 함수 테스트
```sql
-- 현재 로그인한 사용자가 관리자인지 확인
SELECT public.is_admin();
```

## 롤백 방법 (문제 발생 시)

```sql
-- role 컬럼 제거
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- is_admin() 함수 제거
DROP FUNCTION IF EXISTS public.is_admin();

-- RLS 정책을 원래대로 복원 (001_create_tables.sql 참조)
```

## 주의사항

1. **백업 필수**: 마이그레이션 전에 데이터베이스 백업을 권장합니다.
2. **다운타임**: RLS 정책 업데이트 중 잠시 서비스에 영향이 있을 수 있습니다.
3. **권한 확인**: Supabase 프로젝트에 대한 관리자 권한이 필요합니다.
4. **관리자 설정**: 마이그레이션 후 `admin@aidaily.com` 계정이 자동으로 관리자로 설정됩니다.

## 문제 해결

### "permission denied" 오류
- Supabase 프로젝트 관리자 권한 확인
- Service Role Key 사용 확인

### "relation does not exist" 오류
- `001_create_tables.sql`이 먼저 실행되었는지 확인
- 테이블 이름 철자 확인

### RLS 정책 충돌
- 기존 정책을 `DROP POLICY` 명령으로 제거 후 재생성

## 지원

문제가 발생하면 다음을 확인하세요:
1. Supabase 대시보드의 Database 로그
2. 브라우저 개발자 콘솔의 에러 메시지
3. 서버 로그 (`console.log` 출력)

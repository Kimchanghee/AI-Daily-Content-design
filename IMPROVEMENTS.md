# 인증 시스템 개선 사항

## 개선 날짜
2025-11-09

## 개선 목적
회원가입, 로그인, 사용자/관리자 페이지 접근성 및 보안 강화

---

## 주요 개선 사항

### 1. 서버사이드 라우트 보호 활성화 ✅
**파일:** `middleware.ts` (신규 생성)

- Next.js middleware를 활성화하여 서버사이드에서 라우트 보호 적용
- `/dashboard` 및 `/admin` 경로에 대한 인증 확인
- 관리자 권한이 없는 사용자가 `/admin` 접근 시 `/dashboard`로 리다이렉트
- 인증되지 않은 사용자가 보호된 경로 접근 시 `/auth/login`으로 리다이렉트

**이점:**
- 클라이언트 사이드 리다이렉트 이전에 서버에서 접근 차단
- 보안 강화 및 사용자 경험 개선

---

### 2. 인증 플로우 개선 ✅
**파일:** `lib/auth.ts`

**변경 사항:**
- ❌ 제거: `localStorage`에 세션을 수동으로 저장하는 코드 삭제
- ❌ 제거: `document.cookie`를 수동으로 설정하는 코드 삭제
- ✅ 개선: Supabase가 자동으로 세션 쿠키를 관리하도록 변경
- ✅ 개선: 사용자 role을 데이터베이스 profiles 테이블에서 가져오도록 수정

**영향을 받는 함수:**
- `authenticate()` - 로그인
- `register()` - 회원가입
- `getCurrentUser()` - 현재 사용자 정보 가져오기

**이점:**
- Supabase의 표준 세션 관리 방식 사용
- localStorage와 cookie 간 불일치 문제 해결
- 서버/클라이언트 간 일관된 세션 처리

---

### 3. 역할 기반 접근 제어 (RBAC) 강화 ✅
**파일:**
- `lib/auth.ts`
- `lib/supabase/middleware.ts`
- `app/auth/login/page.tsx`

**변경 사항:**
- ✅ 데이터베이스에서 사용자 role 조회
- ✅ Fallback: profiles 테이블에 role이 없을 경우 이메일로 판단 (`admin@aidaily.com` → `admin`)
- ✅ 로그인 후 role에 따라 적절한 페이지로 리다이렉트:
  - `admin` role → `/admin/dashboard`
  - `user` role → `/dashboard`

**이점:**
- 데이터베이스 기반 역할 관리로 확장성 향상
- 향후 다양한 역할 추가 가능 (예: moderator, editor 등)
- 하드코딩된 이메일 체크에서 벗어남

---

### 4. 데이터베이스 스키마 업데이트 ✅
**신규 마이그레이션 파일:**

#### `scripts/003_add_role_to_profiles.sql`
```sql
- profiles 테이블에 role 컬럼 추가 (기본값: 'user')
- CHECK 제약조건: role in ('user', 'admin')
- 기존 admin@aidaily.com 사용자에게 admin role 부여
- 성능 향상을 위한 인덱스 추가
```

#### `scripts/004_update_profile_trigger_with_role.sql`
```sql
- handle_new_user() 트리거 함수 업데이트
- 신규 사용자 생성 시 자동으로 role 할당:
  - admin@aidaily.com → 'admin'
  - 그 외 → 'user'
```

**실행 필요:**
이 SQL 스크립트들을 Supabase 대시보드의 SQL Editor에서 순서대로 실행해야 합니다.

---

## 데이터베이스 마이그레이션 실행 방법

### Supabase 대시보드 사용
1. Supabase 프로젝트 대시보드 접속
2. 좌측 메뉴에서 "SQL Editor" 클릭
3. 다음 순서로 스크립트 실행:
   ```
   1. scripts/003_add_role_to_profiles.sql
   2. scripts/004_update_profile_trigger_with_role.sql
   ```
4. 각 스크립트를 복사하여 SQL Editor에 붙여넣고 "Run" 클릭

### Supabase CLI 사용 (선택사항)
```bash
# Supabase 로컬 개발 환경이 설정된 경우
supabase db push

# 또는 개별 마이그레이션 실행
psql $DATABASE_URL < scripts/003_add_role_to_profiles.sql
psql $DATABASE_URL < scripts/004_update_profile_trigger_with_role.sql
```

---

## 테스트 시나리오

### 1. 회원가입 테스트
**경로:** `/auth/signup`

✅ **확인 사항:**
- [ ] 이메일, 비밀번호, 이름 입력 후 회원가입 성공
- [ ] 이메일 확인이 필요한 경우 `/auth/verify-email`로 리다이렉트
- [ ] 이메일 확인이 불필요한 경우 `/dashboard`로 리다이렉트
- [ ] profiles 테이블에 새 레코드 생성 (role='user')
- [ ] subscriptions 테이블에 기본 구독 생성

**테스트 계정:**
```
이메일: test@example.com
비밀번호: test123
이름: 테스트 사용자
```

---

### 2. 일반 사용자 로그인 테스트
**경로:** `/auth/login`

✅ **확인 사항:**
- [ ] 이메일, 비밀번호 입력 후 로그인 성공
- [ ] `/dashboard`로 자동 리다이렉트
- [ ] 대시보드에서 사용자 정보 표시
- [ ] 좌측 네비게이션 메뉴 정상 작동
- [ ] 로그아웃 기능 정상 작동

**테스트 계정:**
```
이메일: user@example.com
비밀번호: password123
```

---

### 3. 관리자 로그인 테스트
**경로:** `/auth/login`

✅ **확인 사항:**
- [ ] admin@aidaily.com 계정으로 로그인
- [ ] `/admin/dashboard`로 자동 리다이렉트
- [ ] 관리자 대시보드에 시스템 통계 표시
- [ ] 관리자 메뉴 접근 가능:
  - 사용자 관리 (`/admin/users`)
  - 콘텐츠 관리 (`/admin/contents`)
  - 시스템 설정 (`/admin/settings`)
- [ ] "사용자 모드로 전환" 버튼으로 `/dashboard` 접근 가능

**테스트 계정:**
```
이메일: admin@aidaily.com
비밀번호: (관리자 비밀번호)
```

---

### 4. 라우트 보호 테스트

#### 4.1 인증되지 않은 사용자
✅ **확인 사항:**
- [ ] 로그아웃 상태에서 `/dashboard` 접근 시 → `/auth/login`으로 리다이렉트
- [ ] 로그아웃 상태에서 `/admin/dashboard` 접근 시 → `/auth/login`으로 리다이렉트

#### 4.2 일반 사용자
✅ **확인 사항:**
- [ ] 일반 사용자로 로그인 후 `/dashboard` 접근 가능
- [ ] 일반 사용자로 `/admin/dashboard` 접근 시 → `/dashboard`로 리다이렉트
- [ ] 일반 사용자로 `/admin/users` 접근 시 → `/dashboard`로 리다이렉트

#### 4.3 관리자
✅ **확인 사항:**
- [ ] 관리자로 로그인 후 `/admin/dashboard` 접근 가능
- [ ] 관리자로 `/admin/users` 접근 가능
- [ ] 관리자로 `/dashboard` 접근 가능 (일반 사용자 뷰)

---

### 5. 세션 지속성 테스트
✅ **확인 사항:**
- [ ] 로그인 후 페이지 새로고침 시 로그인 상태 유지
- [ ] 브라우저 탭 닫았다가 다시 열어도 로그인 상태 유지
- [ ] 로그아웃 후 보호된 페이지 접근 시 로그인 페이지로 리다이렉트

---

## 알려진 제한사항 및 TODO

### 현재 제한사항
1. **샘플 데이터 사용**
   - `lib/admin.ts`와 `lib/content.ts`는 여전히 메모리 내 샘플 데이터 사용
   - 실제 데이터베이스 통합 필요

2. **관리자 계정 관리**
   - 현재는 `admin@aidaily.com` 하드코딩
   - 향후 관리자 UI에서 role 변경 기능 추가 필요

3. **역할 종류 제한**
   - 현재 'user'와 'admin' 두 가지만 지원
   - 향후 'moderator', 'editor' 등 추가 역할 필요 시 확장 가능

### 향후 개선 사항
- [ ] 관리자 페이지에서 사용자 role 변경 UI 추가
- [ ] 실제 데이터베이스 쿼리로 콘텐츠 및 사용자 목록 표시
- [ ] 권한별 세부 기능 제어 (예: 콘텐츠 삭제는 admin만 가능)
- [ ] 감사 로그 (audit log) 추가
- [ ] 2단계 인증 (2FA) 지원

---

## 기술 스택
- **인증:** Supabase Auth
- **데이터베이스:** PostgreSQL (Supabase)
- **프레임워크:** Next.js 16.0 (App Router)
- **언어:** TypeScript
- **보안:** Row Level Security (RLS) 활성화

---

## 문제 발생 시 확인 사항

### 로그인이 안 되는 경우
1. Supabase 프로젝트가 활성화되어 있는지 확인
2. 환경 변수 확인:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. 브라우저 콘솔에서 에러 메시지 확인
4. Supabase 대시보드에서 Authentication 설정 확인

### Role이 제대로 설정되지 않는 경우
1. `scripts/003_add_role_to_profiles.sql` 실행 여부 확인
2. `scripts/004_update_profile_trigger_with_role.sql` 실행 여부 확인
3. Supabase 대시보드에서 profiles 테이블 직접 확인
4. SQL Editor에서 쿼리 실행:
   ```sql
   SELECT id, email, name, role FROM public.profiles;
   ```

### Middleware가 작동하지 않는 경우
1. `middleware.ts` 파일이 프로젝트 루트에 있는지 확인
2. Next.js 개발 서버 재시작
3. 빌드 후 테스트:
   ```bash
   npm run build
   npm run start
   ```

---

## 연락처 및 지원
문제가 발생하거나 추가 개선이 필요한 경우:
- GitHub Issues 생성
- 개발팀에 문의

---

**마지막 업데이트:** 2025-11-09
**작성자:** Claude AI Assistant

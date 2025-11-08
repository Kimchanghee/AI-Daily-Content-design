-- 샘플 사용자 계정 생성을 위한 안내
-- Supabase Auth를 통해 사용자를 생성해야 합니다

-- 방법 1: Supabase Dashboard에서 수동 생성
-- 1. Supabase Dashboard > Authentication > Users 이동
-- 2. "Add User" 버튼 클릭
-- 3. 아래 정보로 사용자 생성:

/*
일반 사용자:
  Email: demo@aidaily.com
  Password: Demo123!@#

관리자:
  Email: admin@aidaily.com
  Password: Admin123!@#
*/

-- 방법 2: SQL을 통한 사용자 생성 (Supabase에서 auth.users에 직접 접근 가능한 경우)
-- 주의: 이 방법은 Supabase의 보안 정책에 따라 작동하지 않을 수 있습니다

-- 이 스크립트 실행 후, 다음 스크립트(02-add-sample-data.sql)를 실행하세요

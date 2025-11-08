-- 관리자 계정 추가를 위한 SQL 스크립트
-- 주의: Supabase Auth에서 직접 회원가입해야 합니다.
-- 이 스크립트는 프로필만 생성합니다.

-- admin@aidaily.com 계정의 프로필 생성 (이미 Auth에 가입되어 있어야 함)
-- Auth에서 먼저 admin@aidaily.com으로 회원가입 후 실행하세요
INSERT INTO profiles (id, email, name, company, job_title)
SELECT 
  id,
  email,
  'Admin User',
  'AI Daily Content',
  'System Administrator'
FROM auth.users
WHERE email = 'admin@aidaily.com'
ON CONFLICT (id) DO UPDATE
SET 
  name = EXCLUDED.name,
  company = EXCLUDED.company,
  job_title = EXCLUDED.job_title;

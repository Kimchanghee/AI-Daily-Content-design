-- Step 1: Supabase Auth 사용자 생성
-- 주의: 이 스크립트는 Supabase SQL Editor에서 실행해야 합니다

-- auth.users 테이블에 직접 사용자 생성
-- 암호화된 비밀번호 생성 (password: demo123456)
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES
  -- 일반 사용자 demo@aidaily.com / demo123456
  (
    '11111111-1111-1111-1111-111111111111'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo@aidaily.com',
    crypt('demo123456', gen_salt('bf')),
    NOW(),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}',
    '{"name":"김데모"}',
    false,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL,
    false,
    NULL
  ),
  -- 관리자 admin@aidaily.com / admin123456
  (
    '22222222-2222-2222-2222-222222222222'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@aidaily.com',
    crypt('admin123456', gen_salt('bf')),
    NOW(),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider":"email","providers":["email"],"role":"admin"}',
    '{"name":"관리자"}',
    false,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL,
    false,
    NULL
  )
ON CONFLICT (id) DO NOTHING;

-- auth.identities 테이블에도 추가
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES
  (
    '11111111-1111-1111-1111-111111111111'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    '{"sub":"11111111-1111-1111-1111-111111111111","email":"demo@aidaily.com"}',
    'email',
    NOW(),
    NOW(),
    NOW()
  ),
  (
    '22222222-2222-2222-2222-222222222222'::uuid,
    '22222222-2222-2222-2222-222222222222'::uuid,
    '{"sub":"22222222-2222-2222-2222-222222222222","email":"admin@aidaily.com"}',
    'email',
    NOW(),
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

SELECT 'Auth users created successfully!' as message;
SELECT email, created_at FROM auth.users WHERE email IN ('demo@aidaily.com', 'admin@aidaily.com');

-- ============================================
-- 샘플 사용자 및 데이터 생성 스크립트
-- ============================================
-- 이 스크립트를 실행하면 바로 로그인 가능한 샘플 계정이 생성됩니다.
-- 
-- 계정 정보:
-- 일반 사용자: demo@aidaily.com / Demo123!@#
-- 관리자: admin@aidaily.com / Admin123!@#

-- pgcrypto 확장 활성화 (비밀번호 해싱을 위해 필요)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. 샘플 사용자 생성 (Supabase Auth)
-- 일반 사용자
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'demo@aidaily.com',
  crypt('Demo123!@#', gen_salt('bf')),
  now(),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  false,
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmed_at = EXCLUDED.confirmed_at,
  updated_at = now();

-- auth.identities 테이블에도 추가
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  jsonb_build_object('sub', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::text, 'email', 'demo@aidaily.com'),
  'email',
  now(),
  now(),
  now()
) ON CONFLICT (provider, id) DO UPDATE SET
  identity_data = EXCLUDED.identity_data,
  updated_at = now();

-- 관리자 사용자
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud
) VALUES (
  'b1ffcd99-8d1b-5fg9-cc7e-7cc0ce491b22'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'admin@aidaily.com',
  crypt('Admin123!@#', gen_salt('bf')),
  now(),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  false,
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  confirmed_at = EXCLUDED.confirmed_at,
  updated_at = now();

-- auth.identities 테이블에도 추가
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'b1ffcd99-8d1b-5fg9-cc7e-7cc0ce491b22'::uuid,
  'b1ffcd99-8d1b-5fg9-cc7e-7cc0ce491b22'::uuid,
  jsonb_build_object('sub', 'b1ffcd99-8d1b-5fg9-cc7e-7cc0ce491b22'::text, 'email', 'admin@aidaily.com'),
  'email',
  now(),
  now(),
  now()
) ON CONFLICT (provider, id) DO UPDATE SET
  identity_data = EXCLUDED.identity_data,
  updated_at = now();

-- 2. 프로필 생성
INSERT INTO public.profiles (id, email, name, created_at, updated_at)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'demo@aidaily.com', '데모 사용자', now(), now()),
  ('b1ffcd99-8d1b-5fg9-cc7e-7cc0ce491b22'::uuid, 'admin@aidaily.com', '관리자', now(), now())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  updated_at = now();

-- 3. 구독 정보 생성 (데모 사용자용)
INSERT INTO public.subscriptions (
  user_id,
  plan_name,
  status,
  monthly_price,
  monthly_limit,
  current_usage,
  started_at,
  expires_at,
  created_at,
  updated_at
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'pro',
  'active',
  49000,
  100,
  23,
  now(),
  now() + interval '1 month',
  now(),
  now()
) ON CONFLICT (user_id) DO UPDATE SET
  plan_name = EXCLUDED.plan_name,
  status = EXCLUDED.status,
  monthly_price = EXCLUDED.monthly_price,
  monthly_limit = EXCLUDED.monthly_limit,
  current_usage = EXCLUDED.current_usage,
  updated_at = now();

-- 4. 고객 그룹 생성 (데모 사용자용)
INSERT INTO public.customer_groups (id, user_id, name, description, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'VIP 고객', '프리미엄 서비스 고객', now(), now()),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, '일반 고객', '일반 서비스 고객', now(), now()),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, '체험 고객', '무료 체험 중인 고객', now(), now())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = now();

-- 5. 고객 생성 (데모 사용자용)
INSERT INTO public.customers (
  user_id,
  group_id,
  name,
  phone,
  email,
  telegram_id,
  created_at,
  updated_at
) VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '이철수', '010-1234-5678', 'chulsoo@example.com', '@chulsoo_lee', now(), now()),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, '박영희', '010-2345-6789', 'younghee@example.com', '@younghee_park', now(), now()),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, '김민수', '010-3456-7890', 'minsu@example.com', '@minsu_kim', now(), now())
ON CONFLICT DO NOTHING;

-- 6. 뉴스 콘텐츠 생성 (데모 사용자용)
INSERT INTO public.news_content (
  id,
  user_id,
  title,
  content,
  category,
  status,
  published_at,
  created_at,
  updated_at
) VALUES 
  (
    '44444444-4444-4444-4444-444444444444'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'AI 기술의 최신 동향',
    '인공지능 기술이 빠르게 발전하고 있습니다. 특히 생성형 AI 분야에서 놀라운 발전이 이루어지고 있으며, 다양한 산업 분야에 적용되고 있습니다. 앞으로도 AI 기술의 발전은 계속될 것으로 전망됩니다.',
    'Technology',
    'published',
    now() - interval '1 day',
    now() - interval '1 day',
    now()
  ),
  (
    '55555555-5555-5555-5555-555555555555'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '마케팅 자동화 전략',
    '효과적인 마케팅 자동화 전략을 통해 고객 참여도를 높일 수 있습니다. 개인화된 콘텐츠 전송이 핵심이며, 적절한 타이밍에 고객에게 다가가는 것이 중요합니다.',
    'Marketing',
    'published',
    now() - interval '3 days',
    now() - interval '3 days',
    now()
  ),
  (
    '66666666-6666-6666-6666-666666666666'::uuid,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '데이터 분석의 중요성',
    '데이터 기반 의사결정이 비즈니스 성공의 핵심입니다. 올바른 데이터 분석 방법론을 통해 더 나은 비즈니스 인사이트를 얻을 수 있습니다.',
    'Business',
    'draft',
    null,
    now(),
    now()
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = now();

-- 7. 텔레그램 설정 생성 (데모 사용자용)
INSERT INTO public.telegram_settings (
  user_id,
  bot_token,
  channel_id,
  is_connected,
  created_at,
  updated_at
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz',
  '@aidaily_demo',
  true,
  now(),
  now()
) ON CONFLICT (user_id) DO UPDATE SET
  bot_token = EXCLUDED.bot_token,
  channel_id = EXCLUDED.channel_id,
  is_connected = EXCLUDED.is_connected,
  updated_at = now();

-- 8. 발송 이력 생성 (데모 사용자용 - 첫 번째 뉴스 콘텐츠를 3명의 고객에게 발송)
INSERT INTO public.send_history (
  user_id,
  news_id,
  customer_id,
  status,
  sent_at,
  created_at
)
SELECT 
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  '44444444-4444-4444-4444-444444444444'::uuid,
  c.id,
  'sent',
  now() - interval '1 day',
  now() - interval '1 day'
FROM public.customers c
WHERE c.user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid
ON CONFLICT DO NOTHING;

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '✅ 샘플 계정 생성 완료!';
  RAISE NOTICE '';
  RAISE NOTICE '📧 일반 사용자 계정:';
  RAISE NOTICE '   이메일: demo@aidaily.com';
  RAISE NOTICE '   비밀번호: Demo123!@#';
  RAISE NOTICE '';
  RAISE NOTICE '👨‍💼 관리자 계정:';
  RAISE NOTICE '   이메일: admin@aidaily.com';
  RAISE NOTICE '   비밀번호: Admin123!@#';
  RAISE NOTICE '';
  RAISE NOTICE '📊 생성된 샘플 데이터:';
  RAISE NOTICE '   - 고객 그룹: 3개';
  RAISE NOTICE '   - 고객: 3명';
  RAISE NOTICE '   - 뉴스 콘텐츠: 3개 (발행 2개, 초안 1개)';
  RAISE NOTICE '   - 구독: Pro 플랜 (23/100 사용)';
  RAISE NOTICE '   - 텔레그램 설정: 활성화';
  RAISE NOTICE '   - 발송 이력: 3건';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 이제 바로 로그인할 수 있습니다!';
END $$;

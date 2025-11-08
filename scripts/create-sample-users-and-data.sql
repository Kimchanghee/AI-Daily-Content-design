-- ============================================
-- 샘플 사용자 및 데이터 생성 스크립트
-- ============================================
-- 이 스크립트를 실행하면 바로 로그인 가능한 샘플 계정이 생성됩니다.

-- 1. 샘플 사용자 생성 (Supabase Auth)
-- 일반 사용자: demo@aidaily.com / Demo123!@#
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
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
  crypt('Demo123!@#', gen_salt('bf')), -- 비밀번호 해싱
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"데모 사용자"}'::jsonb,
  false,
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- 관리자 사용자: admin@aidaily.com / Admin123!@#
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
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
  crypt('Admin123!@#', gen_salt('bf')), -- 비밀번호 해싱
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
  '{"name":"관리자"}'::jsonb,
  false,
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- 2. 프로필 생성
INSERT INTO profiles (id, email, name, role, created_at, updated_at)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'demo@aidaily.com', '데모 사용자', 'user', now(), now()),
  ('b1ffcd99-8d1b-5fg9-cc7e-7cc0ce491b22'::uuid, 'admin@aidaily.com', '관리자', 'admin', now(), now())
ON CONFLICT (id) DO NOTHING;

-- 3. 구독 정보 생성 (데모 사용자용)
INSERT INTO subscriptions (
  id,
  user_id,
  plan_type,
  status,
  current_period_start,
  current_period_end,
  monthly_content_limit,
  monthly_content_used,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'pro',
  'active',
  now(),
  now() + interval '1 month',
  100,
  23,
  now(),
  now()
) ON CONFLICT DO NOTHING;

-- 4. 고객 그룹 생성 (데모 사용자용)
INSERT INTO customer_groups (id, user_id, name, description, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'VIP 고객', '프리미엄 서비스 고객', now(), now()),
  (gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, '일반 고객', '일반 서비스 고객', now(), now()),
  (gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, '체험 고객', '무료 체험 중인 고객', now(), now())
ON CONFLICT DO NOTHING;

-- 5. 고객 생성 (데모 사용자용)
WITH group_ids AS (
  SELECT id, name FROM customer_groups WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid
)
INSERT INTO customers (
  id,
  user_id,
  group_id,
  name,
  email,
  phone,
  telegram_id,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  g.id,
  c.name,
  c.email,
  c.phone,
  c.telegram_id,
  now(),
  now()
FROM (VALUES
  ('이철수', 'chulsoo@example.com', '010-1234-5678', '@chulsoo_lee', 'VIP 고객'),
  ('박영희', 'younghee@example.com', '010-2345-6789', '@younghee_park', '일반 고객'),
  ('김민수', 'minsu@example.com', '010-3456-7890', '@minsu_kim', '체험 고객')
) AS c(name, email, phone, telegram_id, group_name)
JOIN group_ids g ON g.name = c.group_name
ON CONFLICT DO NOTHING;

-- 6. 뉴스 콘텐츠 생성 (데모 사용자용)
INSERT INTO news_contents (
  id,
  user_id,
  title,
  content,
  summary,
  status,
  publish_date,
  created_at,
  updated_at
) VALUES 
  (
    gen_random_uuid(),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'AI 기술의 최신 동향',
    '인공지능 기술이 빠르게 발전하고 있습니다. 특히 생성형 AI 분야에서 놀라운 발전이 이루어지고 있으며...',
    'AI 기술의 최신 동향을 분석합니다.',
    'published',
    now() - interval '1 day',
    now() - interval '1 day',
    now()
  ),
  (
    gen_random_uuid(),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '마케팅 자동화 전략',
    '효과적인 마케팅 자동화 전략을 통해 고객 참여도를 높일 수 있습니다. 개인화된 콘텐츠 전송이 핵심입니다...',
    '마케팅 자동화로 고객 참여 극대화하기',
    'published',
    now() - interval '3 days',
    now() - interval '3 days',
    now()
  ),
  (
    gen_random_uuid(),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '데이터 분석의 중요성',
    '데이터 기반 의사결정이 비즈니스 성공의 핵심입니다. 올바른 데이터 분석 방법론을 알아봅니다...',
    '데이터로 더 나은 결정 내리기',
    'draft',
    null,
    now(),
    now()
  )
ON CONFLICT DO NOTHING;

-- 7. 텔레그램 설정 생성 (데모 사용자용)
INSERT INTO telegram_settings (
  id,
  user_id,
  bot_token,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz',
  true,
  now(),
  now()
) ON CONFLICT DO NOTHING;

-- 8. 발송 이력 생성 (데모 사용자용)
WITH news_id AS (
  SELECT id FROM news_contents 
  WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid 
  AND status = 'published' 
  LIMIT 1
),
customer_ids AS (
  SELECT id FROM customers 
  WHERE user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid 
  LIMIT 3
)
INSERT INTO send_history (
  id,
  user_id,
  news_id,
  customer_id,
  send_method,
  status,
  sent_at,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  (SELECT id FROM news_id),
  c.id,
  'telegram',
  'success',
  now() - interval '1 day',
  now() - interval '1 day',
  now()
FROM customer_ids c
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
  RAISE NOTICE '🎉 이제 바로 로그인할 수 있습니다!';
END $$;

-- 샘플 프로필 데이터 추가
-- Note: 실제 사용자는 Supabase Auth를 통해 생성되어야 합니다
-- 이 스크립트는 이미 생성된 사용자 ID에 대한 프로필과 샘플 데이터를 추가합니다

-- 샘플 사용자 프로필 (실제 사용자 ID로 대체 필요)
-- 테스트용 사용자 ID를 변수로 설정
DO $$
DECLARE
    sample_user_id uuid := '00000000-0000-0000-0000-000000000001'::uuid;
    sample_admin_id uuid := '00000000-0000-0000-0000-000000000002'::uuid;
BEGIN
    -- 샘플 일반 사용자 프로필
    INSERT INTO profiles (id, email, name, company, job_title, phone, created_at, updated_at)
    VALUES (
        sample_user_id,
        'demo@aidaily.com',
        '김데모',
        '데모 컴퍼니',
        '마케팅 매니저',
        '010-1234-5678',
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        company = EXCLUDED.company,
        job_title = EXCLUDED.job_title,
        phone = EXCLUDED.phone;

    -- 샘플 관리자 프로필
    INSERT INTO profiles (id, email, name, company, job_title, phone, created_at, updated_at)
    VALUES (
        sample_admin_id,
        'admin@aidaily.com',
        '관리자',
        'AI Daily Content',
        'CEO',
        '010-9999-8888',
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        company = EXCLUDED.company,
        job_title = EXCLUDED.job_title,
        phone = EXCLUDED.phone;

    -- 샘플 구독 정보
    INSERT INTO subscriptions (id, user_id, plan_name, status, monthly_price, monthly_limit, current_usage, started_at, expires_at, created_at, updated_at)
    VALUES (
        gen_random_uuid(),
        sample_user_id,
        'Pro',
        'active',
        49000,
        100,
        23,
        NOW() - INTERVAL '10 days',
        NOW() + INTERVAL '20 days',
        NOW(),
        NOW()
    ) ON CONFLICT DO NOTHING;

    -- 샘플 고객 그룹
    INSERT INTO customer_groups (id, user_id, name, description, created_at, updated_at)
    VALUES 
        (gen_random_uuid(), sample_user_id, 'VIP 고객', '중요 VIP 고객 리스트', NOW(), NOW()),
        (gen_random_uuid(), sample_user_id, '일반 고객', '일반 구독 고객', NOW(), NOW()),
        (gen_random_uuid(), sample_user_id, '체험 고객', '무료 체험 중인 고객', NOW(), NOW())
    ON CONFLICT DO NOTHING;

    -- 샘플 고객 데이터
    INSERT INTO customers (id, user_id, group_id, name, email, phone, telegram_id, tags, notes, created_at, updated_at)
    SELECT 
        gen_random_uuid(),
        sample_user_id,
        (SELECT id FROM customer_groups WHERE user_id = sample_user_id AND name = 'VIP 고객' LIMIT 1),
        '이철수',
        'chulsoo@example.com',
        '010-1111-2222',
        '@chulsoo',
        ARRAY['VIP', '장기고객'],
        '5년차 고객, 매우 만족도 높음',
        NOW(),
        NOW()
    WHERE NOT EXISTS (SELECT 1 FROM customers WHERE email = 'chulsoo@example.com');

    INSERT INTO customers (id, user_id, group_id, name, email, phone, telegram_id, tags, notes, created_at, updated_at)
    SELECT 
        gen_random_uuid(),
        sample_user_id,
        (SELECT id FROM customer_groups WHERE user_id = sample_user_id AND name = '일반 고객' LIMIT 1),
        '박영희',
        'younghee@example.com',
        '010-3333-4444',
        '@younghee',
        ARRAY['일반', '신규'],
        '최근 가입한 고객',
        NOW(),
        NOW()
    WHERE NOT EXISTS (SELECT 1 FROM customers WHERE email = 'younghee@example.com');

    INSERT INTO customers (id, user_id, group_id, name, email, phone, telegram_id, tags, notes, created_at, updated_at)
    SELECT 
        gen_random_uuid(),
        sample_user_id,
        (SELECT id FROM customer_groups WHERE user_id = sample_user_id AND name = '체험 고객' LIMIT 1),
        '김민수',
        'minsu@example.com',
        '010-5555-6666',
        '@minsu',
        ARRAY['체험중'],
        '무료 체험 기간',
        NOW(),
        NOW()
    WHERE NOT EXISTS (SELECT 1 FROM customers WHERE email = 'minsu@example.com');

    -- 샘플 뉴스 콘텐츠
    INSERT INTO news_content (id, user_id, title, content, category, status, tags, image_url, scheduled_at, published_at, created_at, updated_at)
    VALUES 
        (
            gen_random_uuid(),
            sample_user_id,
            'AI 기술의 최신 동향 2024',
            '인공지능 기술이 급속도로 발전하면서 다양한 산업 분야에서 혁신을 일으키고 있습니다. 특히 생성형 AI는 콘텐츠 제작, 고객 서비스, 데이터 분석 등에서 큰 변화를 가져오고 있습니다.',
            'Technology',
            'published',
            ARRAY['AI', '기술', '트렌드'],
            '/placeholder.svg?height=400&width=600',
            NOW() - INTERVAL '1 day',
            NOW() - INTERVAL '1 day',
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            sample_user_id,
            '마케팅 자동화로 효율성 극대화',
            '마케팅 자동화 도구를 활용하면 반복적인 작업을 자동화하고, 고객과의 소통을 개선하며, ROI를 향상시킬 수 있습니다. AI 기반 마케팅 플랫폼이 주목받고 있습니다.',
            'Marketing',
            'published',
            ARRAY['마케팅', '자동화', '효율성'],
            '/placeholder.svg?height=400&width=600',
            NOW() - INTERVAL '2 days',
            NOW() - INTERVAL '2 days',
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            sample_user_id,
            '2024년 디지털 트랜스포메이션 전략',
            '디지털 트랜스포메이션은 더 이상 선택이 아닌 필수입니다. 클라우드, AI, 빅데이터를 활용한 혁신적인 비즈니스 모델이 경쟁력의 핵심이 되고 있습니다.',
            'Business',
            'draft',
            ARRAY['디지털', '비즈니스', '전략'],
            '/placeholder.svg?height=400&width=600',
            NOW() + INTERVAL '1 day',
            NULL,
            NOW(),
            NOW()
        )
    ON CONFLICT DO NOTHING;

    -- 샘플 텔레그램 설정
    INSERT INTO telegram_settings (id, user_id, bot_token, channel_id, is_connected, last_test_at, created_at, updated_at)
    VALUES (
        gen_random_uuid(),
        sample_user_id,
        'sample_bot_token_123456',
        '@aidaily_channel',
        true,
        NOW() - INTERVAL '1 hour',
        NOW(),
        NOW()
    ) ON CONFLICT DO NOTHING;

    -- 샘플 발송 이력
    INSERT INTO send_history (id, user_id, news_id, customer_id, group_id, status, sent_at, created_at)
    SELECT 
        gen_random_uuid(),
        sample_user_id,
        (SELECT id FROM news_content WHERE user_id = sample_user_id AND status = 'published' LIMIT 1),
        (SELECT id FROM customers WHERE user_id = sample_user_id LIMIT 1),
        (SELECT id FROM customer_groups WHERE user_id = sample_user_id LIMIT 1),
        'sent',
        NOW() - INTERVAL '1 day',
        NOW()
    WHERE EXISTS (SELECT 1 FROM news_content WHERE user_id = sample_user_id)
    ON CONFLICT DO NOTHING;

END $$;

-- 확인용 쿼리
SELECT 'Sample data created successfully!' as message;
SELECT 'Profiles:', COUNT(*) FROM profiles;
SELECT 'Subscriptions:', COUNT(*) FROM subscriptions;
SELECT 'Customer Groups:', COUNT(*) FROM customer_groups;
SELECT 'Customers:', COUNT(*) FROM customers;
SELECT 'News Content:', COUNT(*) FROM news_content;
SELECT 'Telegram Settings:', COUNT(*) FROM telegram_settings;
SELECT 'Send History:', COUNT(*) FROM send_history;

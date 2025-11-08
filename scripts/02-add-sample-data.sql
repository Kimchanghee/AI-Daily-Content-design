-- 샘플 데이터 추가 스크립트
-- 주의: 먼저 Supabase Auth를 통해 사용자를 생성해야 합니다
-- demo@aidaily.com과 admin@aidaily.com 계정을 먼저 생성하세요

-- 현재 로그인한 사용자의 ID를 가져옵니다
DO $$
DECLARE
    demo_user_id uuid;
    admin_user_id uuid;
BEGIN
    -- auth.users에서 샘플 사용자 ID 가져오기
    SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@aidaily.com' LIMIT 1;
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@aidaily.com' LIMIT 1;

    -- 사용자가 없으면 경고 메시지
    IF demo_user_id IS NULL THEN
        RAISE NOTICE '경고: demo@aidaily.com 사용자가 없습니다. 먼저 Supabase Auth에서 생성하세요.';
        RETURN;
    END IF;

    RAISE NOTICE '일반 사용자 ID: %', demo_user_id;
    RAISE NOTICE '관리자 사용자 ID: %', admin_user_id;

    -- 샘플 일반 사용자 프로필
    INSERT INTO profiles (id, email, name, company, job_title, phone, created_at, updated_at)
    VALUES (
        demo_user_id,
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
        updated_at = NOW();

    -- 샘플 관리자 프로필 (있는 경우)
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO profiles (id, email, name, company, job_title, phone, created_at, updated_at)
        VALUES (
            admin_user_id,
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
            updated_at = NOW();
    END IF;

    -- 샘플 구독 정보
    INSERT INTO subscriptions (id, user_id, plan_name, status, monthly_price, monthly_limit, current_usage, started_at, expires_at, created_at, updated_at)
    VALUES (
        gen_random_uuid(),
        demo_user_id,
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
        (gen_random_uuid(), demo_user_id, 'VIP 고객', '중요 VIP 고객 리스트', NOW(), NOW()),
        (gen_random_uuid(), demo_user_id, '일반 고객', '일반 구독 고객', NOW(), NOW()),
        (gen_random_uuid(), demo_user_id, '체험 고객', '무료 체험 중인 고객', NOW(), NOW())
    ON CONFLICT DO NOTHING;

    -- 샘플 고객 데이터
    INSERT INTO customers (id, user_id, group_id, name, email, phone, telegram_id, tags, notes, created_at, updated_at)
    SELECT 
        gen_random_uuid(),
        demo_user_id,
        (SELECT id FROM customer_groups WHERE user_id = demo_user_id AND name = 'VIP 고객' LIMIT 1),
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
        demo_user_id,
        (SELECT id FROM customer_groups WHERE user_id = demo_user_id AND name = '일반 고객' LIMIT 1),
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
        demo_user_id,
        (SELECT id FROM customer_groups WHERE user_id = demo_user_id AND name = '체험 고객' LIMIT 1),
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
            demo_user_id,
            'AI 기술의 최신 동향 2024',
            '인공지능 기술이 급속도로 발전하면서 다양한 산업 분야에서 혁신을 일으키고 있습니다. 특히 생성형 AI는 콘텐츠 제작, 고객 서비스, 데이터 분석 등에서 큰 변화를 가져오고 있습니다. 

주요 트렌드:
1. 멀티모달 AI: 텍스트, 이미지, 음성을 통합 처리
2. AI 에이전트: 복잡한 작업을 자동으로 수행
3. 엣지 AI: 기기 내에서 직접 AI 처리
4. 윤리적 AI: 책임 있는 AI 개발과 사용

이러한 기술들은 기업의 생산성을 크게 향상시키고 있으며, 고객 경험을 개선하는 데 핵심적인 역할을 하고 있습니다.',
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
            demo_user_id,
            '마케팅 자동화로 효율성 극대화',
            '마케팅 자동화 도구를 활용하면 반복적인 작업을 자동화하고, 고객과의 소통을 개선하며, ROI를 향상시킬 수 있습니다. 

마케팅 자동화의 주요 이점:
- 시간 절약: 반복 작업 자동화로 전략적 업무에 집중
- 개인화: 고객 데이터 기반 맞춤형 메시지 전달
- 일관성: 24시간 자동 응답 및 캠페인 실행
- 분석: 실시간 데이터로 캠페인 성과 측정

AI 기반 마케팅 플랫폼이 주목받고 있으며, 특히 콘텐츠 생성과 고객 세그먼테이션에서 큰 효과를 보이고 있습니다.',
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
            demo_user_id,
            '2024년 디지털 트랜스포메이션 전략',
            '디지털 트랜스포메이션은 더 이상 선택이 아닌 필수입니다. 클라우드, AI, 빅데이터를 활용한 혁신적인 비즈니스 모델이 경쟁력의 핵심이 되고 있습니다.

성공적인 디지털 트랜스포메이션을 위한 5가지 전략:
1. 클라우드 우선 전략 채택
2. 데이터 기반 의사결정 문화 구축
3. 고객 중심의 디지털 경험 설계
4. 민첩한 조직 구조로 전환
5. 지속적인 학습과 혁신

이러한 전략을 통해 기업은 시장 변화에 빠르게 대응하고, 새로운 비즈니스 기회를 창출할 수 있습니다.',
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
        demo_user_id,
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
        demo_user_id,
        (SELECT id FROM news_content WHERE user_id = demo_user_id AND status = 'published' LIMIT 1),
        (SELECT id FROM customers WHERE user_id = demo_user_id LIMIT 1),
        (SELECT id FROM customer_groups WHERE user_id = demo_user_id LIMIT 1),
        'sent',
        NOW() - INTERVAL '1 day',
        NOW()
    WHERE EXISTS (SELECT 1 FROM news_content WHERE user_id = demo_user_id)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '샘플 데이터가 성공적으로 생성되었습니다!';

END $$;

-- 확인용 쿼리
SELECT '=== 샘플 데이터 생성 완료 ===' as message;
SELECT 'Profiles: ' || COUNT(*)::text FROM profiles;
SELECT 'Subscriptions: ' || COUNT(*)::text FROM subscriptions;
SELECT 'Customer Groups: ' || COUNT(*)::text FROM customer_groups;
SELECT 'Customers: ' || COUNT(*)::text FROM customers;
SELECT 'News Content: ' || COUNT(*)::text FROM news_content;
SELECT 'Telegram Settings: ' || COUNT(*)::text FROM telegram_settings;
SELECT 'Send History: ' || COUNT(*)::text FROM send_history;

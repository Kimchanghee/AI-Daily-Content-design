-- 샘플 데이터 삽입 (테스트용)
-- 주의: 실제 사용자가 이메일 인증을 완료한 후에만 데이터가 삽입됩니다
-- 이 스크립트는 관리자가 수동으로 실행하거나 개발 환경에서만 사용하세요

-- 샘플 고객 그룹 (실제 user_id로 교체 필요)
insert into public.customer_groups (id, user_id, name, description) values
  ('11111111-1111-1111-1111-111111111111', auth.uid(), 'VIP 고객', '주요 고객 및 단골 고객'),
  ('22222222-2222-2222-2222-222222222222', auth.uid(), '잠재 고객', '관심 고객 및 신규 리드')
on conflict do nothing;

-- 샘플 고객 데이터 (실제 user_id로 교체 필요)
insert into public.customers (user_id, group_id, name, phone, telegram_id, tags) values
  (auth.uid(), '11111111-1111-1111-1111-111111111111', '김철수', '010-1234-5678', '@kimcs', array['VIP', '보험']),
  (auth.uid(), '11111111-1111-1111-1111-111111111111', '이영희', '010-2345-6789', '@leeyh', array['VIP', '부동산']),
  (auth.uid(), '22222222-2222-2222-2222-222222222222', '박민수', '010-3456-7890', '@parkms', array['리드', '금융'])
on conflict do nothing;

-- 샘플 뉴스 콘텐츠
insert into public.news_content (user_id, title, content, category, tags, status) values
  (auth.uid(), '2025년 부동산 시장 전망', '올해 부동산 시장은 금리 인하와 함께 회복세를 보일 것으로 전망됩니다.', '부동산', array['시장분석', '트렌드'], 'published'),
  (auth.uid(), '생명보험 가입 시 꼭 확인해야 할 3가지', '보험 가입 전 반드시 확인해야 할 핵심 사항들을 정리했습니다.', '보험', array['팁', '가이드'], 'published')
on conflict do nothing;

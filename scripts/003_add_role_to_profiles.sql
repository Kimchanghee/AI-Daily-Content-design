-- profiles 테이블에 role 컬럼 추가
alter table public.profiles add column if not exists role text default 'user' check (role in ('user', 'admin'));

-- 기존 admin 사용자에게 admin role 부여
update public.profiles
set role = 'admin'
where email = 'admin@aidaily.com';

-- 나머지 사용자들은 user role (이미 기본값이지만 명시적으로 설정)
update public.profiles
set role = 'user'
where role is null or role = '';

-- 인덱스 추가 (role 조회 성능 향상)
create index if not exists idx_profiles_role on public.profiles(role);

-- 코멘트 추가
comment on column public.profiles.role is '사용자 역할: user (일반 사용자), admin (관리자)';

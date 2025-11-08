-- 사용자 프로필 테이블
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  company text,
  job_title text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 고객 그룹 테이블
create table if not exists public.customer_groups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 고객 정보 테이블
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  group_id uuid references public.customer_groups(id) on delete set null,
  name text not null,
  phone text not null,
  telegram_id text,
  email text,
  tags text[],
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 뉴스 콘텐츠 테이블
create table if not exists public.news_content (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  image_url text,
  category text,
  tags text[],
  status text default 'draft' check (status in ('draft', 'published', 'scheduled')),
  scheduled_at timestamptz,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 발송 기록 테이블
create table if not exists public.send_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  news_id uuid references public.news_content(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete cascade,
  group_id uuid references public.customer_groups(id) on delete set null,
  status text default 'pending' check (status in ('pending', 'sent', 'failed')),
  sent_at timestamptz,
  error_message text,
  created_at timestamptz default now()
);

-- 구독 정보 테이블
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  plan_name text default 'basic',
  status text default 'active' check (status in ('active', 'cancelled', 'expired')),
  monthly_price integer default 19800,
  monthly_limit integer default 1000,
  current_usage integer default 0,
  started_at timestamptz default now(),
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 텔레그램 채널 설정 테이블
create table if not exists public.telegram_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  bot_token text,
  channel_id text,
  is_connected boolean default false,
  last_test_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS 활성화
alter table public.profiles enable row level security;
alter table public.customer_groups enable row level security;
alter table public.customers enable row level security;
alter table public.news_content enable row level security;
alter table public.send_history enable row level security;
alter table public.subscriptions enable row level security;
alter table public.telegram_settings enable row level security;

-- RLS 정책 생성
-- profiles
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- customer_groups
create policy "Users can view own groups" on public.customer_groups for select using (auth.uid() = user_id);
create policy "Users can insert own groups" on public.customer_groups for insert with check (auth.uid() = user_id);
create policy "Users can update own groups" on public.customer_groups for update using (auth.uid() = user_id);
create policy "Users can delete own groups" on public.customer_groups for delete using (auth.uid() = user_id);

-- customers
create policy "Users can view own customers" on public.customers for select using (auth.uid() = user_id);
create policy "Users can insert own customers" on public.customers for insert with check (auth.uid() = user_id);
create policy "Users can update own customers" on public.customers for update using (auth.uid() = user_id);
create policy "Users can delete own customers" on public.customers for delete using (auth.uid() = user_id);

-- news_content
create policy "Users can view own news" on public.news_content for select using (auth.uid() = user_id);
create policy "Users can insert own news" on public.news_content for insert with check (auth.uid() = user_id);
create policy "Users can update own news" on public.news_content for update using (auth.uid() = user_id);
create policy "Users can delete own news" on public.news_content for delete using (auth.uid() = user_id);

-- send_history
create policy "Users can view own history" on public.send_history for select using (auth.uid() = user_id);
create policy "Users can insert own history" on public.send_history for insert with check (auth.uid() = user_id);

-- subscriptions
create policy "Users can view own subscription" on public.subscriptions for select using (auth.uid() = user_id);
create policy "Users can insert own subscription" on public.subscriptions for insert with check (auth.uid() = user_id);
create policy "Users can update own subscription" on public.subscriptions for update using (auth.uid() = user_id);

-- telegram_settings
create policy "Users can view own settings" on public.telegram_settings for select using (auth.uid() = user_id);
create policy "Users can insert own settings" on public.telegram_settings for insert with check (auth.uid() = user_id);
create policy "Users can update own settings" on public.telegram_settings for update using (auth.uid() = user_id);

-- 회원가입 시 자동으로 프로필 및 구독 생성 트리거 (role 포함)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- 프로필 생성 (role 포함)
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', new.email),
    case
      when new.email = 'admin@aidaily.com' then 'admin'
      else 'user'
    end
  )
  on conflict (id) do nothing;

  -- 기본 구독 생성
  insert into public.subscriptions (user_id, plan_name, status, monthly_price, monthly_limit)
  values (
    new.id,
    'basic',
    'active',
    19800,
    1000
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- 트리거가 이미 존재하므로 재생성 불필요 (함수만 업데이트됨)

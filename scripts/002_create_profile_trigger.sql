-- 회원가입 시 자동으로 프로필 및 구독 생성 트리거
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- 프로필 생성
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', new.email)
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

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

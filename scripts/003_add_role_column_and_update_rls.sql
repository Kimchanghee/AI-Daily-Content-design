-- 프로필 테이블에 role 컬럼 추가
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- 기존 사용자들의 role을 'user'로 설정 (이미 default가 있지만 명시적으로)
UPDATE public.profiles SET role = 'user' WHERE role IS NULL;

-- admin@aidaily.com을 관리자로 설정
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@aidaily.com';

-- 관리자 권한 확인을 위한 헬퍼 함수
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS 정책 업데이트 (관리자 우회 허용)

-- profiles 정책 업데이트
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile or admins can view all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile or admins can update all"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.is_admin());

-- customer_groups 정책 업데이트
DROP POLICY IF EXISTS "Users can view own groups" ON public.customer_groups;
DROP POLICY IF EXISTS "Users can insert own groups" ON public.customer_groups;
DROP POLICY IF EXISTS "Users can update own groups" ON public.customer_groups;
DROP POLICY IF EXISTS "Users can delete own groups" ON public.customer_groups;

CREATE POLICY "Users can view own groups or admins can view all"
  ON public.customer_groups FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own groups"
  ON public.customer_groups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own groups or admins can update all"
  ON public.customer_groups FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can delete own groups or admins can delete all"
  ON public.customer_groups FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

-- customers 정책 업데이트
DROP POLICY IF EXISTS "Users can view own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can insert own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can update own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can delete own customers" ON public.customers;

CREATE POLICY "Users can view own customers or admins can view all"
  ON public.customers FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own customers"
  ON public.customers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customers or admins can update all"
  ON public.customers FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can delete own customers or admins can delete all"
  ON public.customers FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

-- news_content 정책 업데이트
DROP POLICY IF EXISTS "Users can view own news" ON public.news_content;
DROP POLICY IF EXISTS "Users can insert own news" ON public.news_content;
DROP POLICY IF EXISTS "Users can update own news" ON public.news_content;
DROP POLICY IF EXISTS "Users can delete own news" ON public.news_content;

CREATE POLICY "Users can view own news or admins can view all"
  ON public.news_content FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own news"
  ON public.news_content FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own news or admins can update all"
  ON public.news_content FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can delete own news or admins can delete all"
  ON public.news_content FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

-- send_history 정책 업데이트
DROP POLICY IF EXISTS "Users can view own history" ON public.send_history;
DROP POLICY IF EXISTS "Users can insert own history" ON public.send_history;

CREATE POLICY "Users can view own history or admins can view all"
  ON public.send_history FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own history"
  ON public.send_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can delete history"
  ON public.send_history FOR DELETE
  USING (public.is_admin());

-- subscriptions 정책 업데이트
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.subscriptions;

CREATE POLICY "Users can view own subscription or admins can view all"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own subscription"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription or admins can update all"
  ON public.subscriptions FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can delete subscriptions"
  ON public.subscriptions FOR DELETE
  USING (public.is_admin());

-- telegram_settings 정책 업데이트
DROP POLICY IF EXISTS "Users can view own settings" ON public.telegram_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON public.telegram_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON public.telegram_settings;

CREATE POLICY "Users can view own settings or admins can view all"
  ON public.telegram_settings FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own settings"
  ON public.telegram_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings or admins can update all"
  ON public.telegram_settings FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can delete settings"
  ON public.telegram_settings FOR DELETE
  USING (public.is_admin());

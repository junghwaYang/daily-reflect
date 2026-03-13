-- 001_initial_schema.sql
-- Daily Reflect - Initial database schema
-- Supabase Auth 연동 기반 회고록 자동화 서비스

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Tables
-- ============================================================

-- Users 테이블 (Supabase Auth와 연동)
-- auth.users를 참조하되, 추가 프로필 정보 저장
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team')),
  timezone TEXT DEFAULT 'Asia/Seoul',
  retro_generation_time TIME DEFAULT '23:50:00',
  retro_tone TEXT DEFAULT 'diary' CHECK (retro_tone IN ('diary', 'blog', 'bullet')),
  retro_language TEXT DEFAULT 'ko' CHECK (retro_language IN ('ko', 'en', 'ja')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activities 테이블 (에이전트에서 수집한 활동 데이터)
CREATE TABLE public.activities (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  window_title TEXT,
  source TEXT NOT NULL CHECK (source IN ('agent', 'extension', 'plugin')),
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ NOT NULL,
  duration_seconds INT GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM ended_at - started_at)::INT
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Retrospectives 테이블 (AI 생성 회고글)
CREATE TABLE public.retrospectives (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  model_used TEXT,
  token_count INT,
  is_edited BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- App Categories 테이블 (앱별 카테고리 매핑)
CREATE TABLE public.app_categories (
  id SERIAL PRIMARY KEY,
  app_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'development', 'communication', 'design', 'document',
    'media', 'browser', 'productivity', 'other'
  )),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  UNIQUE(app_name, COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::UUID))
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retrospectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_categories ENABLE ROW LEVEL SECURITY;

-- profiles: 본인만 읽기/수정
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- activities: 본인만 CRUD
CREATE POLICY "activities_select_own" ON public.activities
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "activities_insert_own" ON public.activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "activities_delete_own" ON public.activities
  FOR DELETE USING (auth.uid() = user_id);

-- retrospectives: 본인만 CRUD
CREATE POLICY "retro_select_own" ON public.retrospectives
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "retro_insert_own" ON public.retrospectives
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "retro_update_own" ON public.retrospectives
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "retro_delete_own" ON public.retrospectives
  FOR DELETE USING (auth.uid() = user_id);

-- app_categories: 시스템 기본(user_id IS NULL)은 모두 읽기, 개인 것은 본인만
CREATE POLICY "categories_select" ON public.app_categories
  FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "categories_insert_own" ON public.app_categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "categories_update_own" ON public.app_categories
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_activities_user_date ON public.activities (user_id, started_at);
CREATE INDEX idx_retro_user_date ON public.retrospectives (user_id, date);

-- ============================================================
-- Triggers
-- ============================================================

-- 프로필 자동 생성 트리거 (Auth 회원가입 시)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER retrospectives_updated_at
  BEFORE UPDATE ON public.retrospectives
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

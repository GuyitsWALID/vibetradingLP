-- ========================================================
-- VIBE TERMINAL — Phase 2: Data & Content Tables
-- Run in Supabase SQL Editor
-- ========================================================
-- Dependencies: 001_auth_profiles.sql must be applied first
-- ---------------------------------------------------------
-- 1. live_streams — YouTube live streams per asset
CREATE TABLE public.live_streams (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 asset TEXT NOT NULL,
 -- e.g. EUR/USD, XAU/USD
 youtube_video_id TEXT NOT NULL,
 title TEXT,
 scheduled_start TIMESTAMPTZ,
 actual_start TIMESTAMPTZ,
 status TEXT,
 -- live, ended, upcoming
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_live_streams_asset ON public.live_streams(asset);

-- RLS Policies
ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "live_streams public read" ON public.live_streams
 FOR SELECT USING (true);
CREATE POLICY "live_streams owner update" ON public.live_streams
 FOR INSERT, UPDATE, DELETE USING (auth.uid() = (SELECT id FROM public.profiles WHERE id = auth.uid()));

-- 2. news_cache — Raw news headlines (deduped)
CREATE TABLE public.news_cache (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 source TEXT NOT NULL,
 asset TEXT,
 -- optional asset tag (e.g. EUR/USD)
 headline TEXT NOT NULL,
 url TEXT,
 published_at TIMESTAMPTZ NOT NULL,
 impact TEXT CHECK (impact IN ('high','medium','low')) DEFAULT 'low',
 is_breaking BOOLEAN DEFAULT FALSE,
 sentiment TEXT CHECK (sentiment IN ('bullish','bearish','neutral')) DEFAULT 'neutral',
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX uq_news_cache_url ON public.news_cache(url);

-- RLS Policies
ALTER TABLE public.news_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news_cache read public" ON public.news_cache
 FOR SELECT USING (true);
CREATE POLICY "news_cache write admin" ON public.news_cache
 FOR INSERT, UPDATE, DELETE USING (public.is_admin());

-- 3. calendar_events — Economic calendar entries
CREATE TABLE public.calendar_events (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 event_time TIMESTAMPTZ NOT NULL,
 currency TEXT NOT NULL,
 -- e.g. USD, EUR
 title TEXT NOT NULL,
 impact TEXT CHECK (impact IN ('high','medium','low')) NOT NULL,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_calendar_events_time ON public.calendar_events(event_time);

-- RLS Policies
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "calendar read public" ON public.calendar_events
 FOR SELECT USING (true);
CREATE POLICY "calendar edit admin" ON public.calendar_events
 FOR INSERT, UPDATE, DELETE USING (public.is_admin());

-- 4. calendar_notes — “Why This Matters” commentary per event
CREATE TABLE public.calendar_notes (
 event_id UUID REFERENCES public.calendar_events(id) ON DELETE CASCADE,
 note TEXT NOT NULL,
 created_by UUID REFERENCES public.profiles(id),
 created_at TIMESTAMPTZ DEFAULT NOW(),
 PRIMARY KEY (event_id)
);

-- RLS Policies
ALTER TABLE public.calendar_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notes read public" ON public.calendar_notes
 FOR SELECT USING (true);
CREATE POLICY "notes write owner" ON public.calendar_notes
 FOR INSERT, UPDATE, DELETE USING (auth.uid() = created_by);

-- 5. weekly_sentiments — Sunday community sentiment posts
CREATE TABLE public.weekly_sentiments (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 week_start DATE NOT NULL,
 author_id UUID REFERENCES public.profiles(id),
 content TEXT NOT NULL,
 sentiment TEXT CHECK (sentiment IN ('bullish','bearish','neutral')) NOT NULL,
 created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.weekly_sentiments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "weekly_sentiments read public" ON public.weekly_sentiments
 FOR SELECT USING (true);
CREATE POLICY "weekly_sentiments write member" ON public.weekly_sentiments
 FOR INSERT USING (auth.uid() = author_id);
CREATE POLICY "weekly_sentiments edit owner" ON public.weekly_sentiments
 FOR UPDATE, DELETE USING (auth.uid() = author_id);

-- 6. articles — Community-written analysis pieces
CREATE TABLE public.articles (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 author_id UUID REFERENCES public.profiles(id),
 title TEXT NOT NULL,
 slug TEXT UNIQUE NOT NULL,
 content TEXT NOT NULL,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW(),
 published BOOLEAN DEFAULT FALSE,
 published_at TIMESTAMPTZ
);

-- RLS Policies
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "articles public read" ON public.articles
 FOR SELECT USING (published = TRUE);
CREATE POLICY "articles author write" ON public.articles
 FOR INSERT, UPDATE, DELETE USING (auth.uid() = author_id);

-- 7. game_questions — Quiz question bank for the Trader Game
CREATE TABLE public.game_questions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 category TEXT NOT NULL,
 -- e.g. forex, macro, crypto
 question TEXT NOT NULL,
 answer TEXT NOT NULL,
 difficulty INT CHECK (difficulty BETWEEN 1 AND 5) DEFAULT 3,
 created_by UUID REFERENCES public.profiles(id),
 created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.game_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions read public" ON public.game_questions
 FOR SELECT USING (true);
CREATE POLICY "questions write admin" ON public.game_questions
 FOR INSERT, UPDATE, DELETE USING (public.is_admin());

-- 8. game_sessions — User quiz results & leaderboard entries
CREATE TABLE public.game_sessions (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID REFERENCES public.profiles(id),
 question_id UUID REFERENCES public.game_questions(id),
 answered_at TIMESTAMPTZ DEFAULT NOW(),
 is_correct BOOLEAN NOT NULL,
 points_earned INT NOT NULL
);

-- RLS Policies
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sessions read owner" ON public.game_sessions
 FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sessions write owner" ON public.game_sessions
 FOR INSERT USING (auth.uid() = user_id);

-- ----------------------------------------------------------
-- Helper Functions (already defined in 001_auth_profiles.sql)
--   public.handle_new_user()
--   public.is_admin()
-- ----------------------------------------------------------

-- 9. View for dashboard statistics (quick overview)
CREATE VIEW public.dashboard_stats AS
SELECT
 (SELECT COUNT(*) FROM public.profiles) AS total_members,
 (SELECT COUNT(*) FROM public.live_streams WHERE status = 'live') AS live_streams,
 (SELECT COUNT(*) FROM public.news_cache WHERE is_breaking = TRUE) AS breaking_news,
 (SELECT COUNT(*) FROM public.calendar_events WHERE impact = 'high' AND event_time > now()) AS upcoming_high_impact,
 (SELECT SUM(points_earned) FROM public.game_sessions GROUP BY user_id ORDER BY SUM(points_earned) DESC LIMIT 1) AS top_score
;

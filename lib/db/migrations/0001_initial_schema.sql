-- ==============================================================================
-- SILENT.BIO — Complete Database Schema & Row-Level Security
-- Production Postgres Migration with RLS, Triggers, Partitioning & Rollup tables
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username CITEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    bio TEXT DEFAULT '',
    avatar_url TEXT,
    banner_url TEXT,
    location TEXT DEFAULT '',
    pronouns TEXT DEFAULT '',
    custom_status TEXT DEFAULT '',
    presence_status TEXT DEFAULT 'offline' CHECK (presence_status IN ('online', 'idle', 'dnd', 'offline')),
    discord_user_id TEXT,
    uid_number BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    hide_from_explore BOOLEAN DEFAULT FALSE,
    hide_view_counter BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- Case-insensitive username index
CREATE INDEX IF NOT EXISTS idx_profiles_username_lower ON public.profiles(LOWER(username));
CREATE INDEX IF NOT EXISTS idx_profiles_uid_number ON public.profiles(uid_number);

-- 2. PROFILE SETTINGS & APPEARANCE
CREATE TABLE IF NOT EXISTS public.profile_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    theme_id TEXT DEFAULT 'midnight' NOT NULL,
    layout_preset TEXT DEFAULT 'centered' CHECK (layout_preset IN ('centered', 'split', 'left-aligned', 'bento', 'minimal-list', 'full-bleed')),
    bg_type TEXT DEFAULT 'solid' CHECK (bg_type IN ('solid', 'gradient', 'image', 'video', 'mesh', 'noise')),
    bg_value TEXT DEFAULT '#08090B',
    bg_blur INTEGER DEFAULT 0,
    bg_dim INTEGER DEFAULT 0,
    card_opacity NUMERIC(3, 2) DEFAULT 0.90,
    card_radius TEXT DEFAULT '12px',
    card_border_color TEXT DEFAULT 'rgba(255, 255, 255, 0.08)',
    card_border_width TEXT DEFAULT '1px',
    font_family TEXT DEFAULT 'Geist Sans',
    font_effect TEXT DEFAULT 'none' CHECK (font_effect IN ('none', 'glow', 'shimmer', 'gradient', 'typewriter')),
    accent_color TEXT DEFAULT '#A5A5FF',
    text_color TEXT DEFAULT '#F5F5F5',
    active_effect TEXT DEFAULT 'none' CHECK (active_effect IN ('none', 'snow', 'stars', 'rain', 'embers', 'particles')),
    effect_intensity NUMERIC(3, 2) DEFAULT 0.50,
    cursor_effect TEXT DEFAULT 'none' CHECK (cursor_effect IN ('none', 'trail', 'glow', 'ring')),
    custom_css TEXT DEFAULT '',
    enable_splash_screen BOOLEAN DEFAULT TRUE,
    splash_text TEXT DEFAULT 'Click to Enter',
    audio_autoplay_unlocked BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. SOCIAL LINKS
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    custom_icon TEXT,
    custom_color TEXT,
    display_style TEXT DEFAULT 'card' CHECK (display_style IN ('icon-only', 'pill', 'card', 'full-width', 'glow', 'outline', 'brand', 'minimal-text')),
    order_index INTEGER DEFAULT 0 NOT NULL,
    group_name TEXT DEFAULT '',
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    password_hash TEXT,
    is_copy_action BOOLEAN DEFAULT FALSE,
    clicks_count BIGINT DEFAULT 0 NOT NULL,
    scheduled_start TIMESTAMPTZ,
    scheduled_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_social_links_profile_order ON public.social_links(profile_id, order_index);

-- 4. PROFILE COMPONENTS (Bento / Modular blocks)
CREATE TABLE IF NOT EXISTS public.profile_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    component_type TEXT NOT NULL,
    title TEXT DEFAULT '',
    content_payload JSONB DEFAULT '{}'::jsonb NOT NULL,
    order_index INTEGER DEFAULT 0 NOT NULL,
    col_span INTEGER DEFAULT 1,
    row_span INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_profile_components_order ON public.profile_components(profile_id, order_index);

-- 5. PROFILE MUSIC
CREATE TABLE IF NOT EXISTS public.profile_music (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL CHECK (source_type IN ('spotify', 'soundcloud', 'youtube', 'upload')),
    track_title TEXT NOT NULL,
    artist_name TEXT DEFAULT '',
    source_url TEXT NOT NULL,
    artwork_url TEXT,
    audio_duration INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0 NOT NULL,
    is_autoplay BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. ANALYTICS & DAILY ROLLUP
CREATE TABLE IF NOT EXISTS public.profile_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    visitor_hash TEXT NOT NULL,
    link_id UUID REFERENCES public.social_links(id) ON DELETE SET NULL,
    referrer_domain TEXT DEFAULT '',
    country_code TEXT DEFAULT 'UNKNOWN',
    device_type TEXT DEFAULT 'desktop',
    browser_family TEXT DEFAULT 'Other',
    os_family TEXT DEFAULT 'Other',
    is_bot BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_analytics_profile_created ON public.profile_analytics(profile_id, created_at);

CREATE TABLE IF NOT EXISTS public.profile_analytics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    total_views BIGINT DEFAULT 0 NOT NULL,
    unique_visitors BIGINT DEFAULT 0 NOT NULL,
    link_clicks BIGINT DEFAULT 0 NOT NULL,
    referrer_breakdown JSONB DEFAULT '{}'::jsonb,
    country_breakdown JSONB DEFAULT '{}'::jsonb,
    device_breakdown JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(profile_id, record_date)
);

CREATE INDEX IF NOT EXISTS idx_analytics_daily_profile_date ON public.profile_analytics_daily(profile_id, record_date);

-- 7. MEDIA FILES
CREATE TABLE IF NOT EXISTS public.media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_type TEXT NOT NULL CHECK (file_type IN ('avatar', 'banner', 'audio', 'gallery', 'custom_icon')),
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. THEMES & USER THEMES
CREATE TABLE IF NOT EXISTS public.themes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT TRUE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    theme_tokens JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    share_code TEXT UNIQUE,
    theme_tokens JSONB NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. GUESTBOOK ENTRIES
CREATE TABLE IF NOT EXISTS public.guestbook_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. BADGES & USER BADGES
CREATE TABLE IF NOT EXISTS public.badges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon_svg TEXT NOT NULL,
    badge_type TEXT DEFAULT 'earned' CHECK (badge_type IN ('earned', 'system', 'award', 'community')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_badges (
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY(profile_id, badge_id)
);

-- 11. SOCIAL GRAPH: FOLLOWS, LIKES, BLOCKS, REPORTS
CREATE TABLE IF NOT EXISTS public.follows (
    follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY(follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS public.likes (
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    liker_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY(profile_id, liker_hash)
);

CREATE TABLE IF NOT EXISTS public.blocks (
    blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY(blocker_id, blocked_id)
);

CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reported_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    details TEXT DEFAULT '',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    admin_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. RESERVED USERNAMES & AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.reserved_usernames (
    username CITEXT PRIMARY KEY,
    reason TEXT DEFAULT 'system_reserved',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.profile_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    snapshot_data JSONB NOT NULL,
    change_summary TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    key_prefix TEXT NOT NULL,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_music ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reserved_usernames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (is_banned = FALSE AND deleted_at IS NULL);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. Profile Settings
CREATE POLICY "Settings are viewable by everyone" ON public.profile_settings
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage their own settings" ON public.profile_settings
    FOR ALL USING (auth.uid() = profile_id);

-- 3. Social Links
CREATE POLICY "Active links are viewable by everyone" ON public.social_links
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Users can manage their own links" ON public.social_links
    FOR ALL USING (auth.uid() = profile_id);

-- 4. Components
CREATE POLICY "Active components are viewable by everyone" ON public.profile_components
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Users can manage their own components" ON public.profile_components
    FOR ALL USING (auth.uid() = profile_id);

-- 5. Music
CREATE POLICY "Music is viewable by everyone" ON public.profile_music
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage their own music" ON public.profile_music
    FOR ALL USING (auth.uid() = profile_id);

-- 6. Analytics
CREATE POLICY "Anyone can record analytics" ON public.profile_analytics
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users can view their own analytics" ON public.profile_analytics
    FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can view their own daily rollups" ON public.profile_analytics_daily
    FOR SELECT USING (auth.uid() = profile_id);

-- 7. Media
CREATE POLICY "Media is viewable by everyone" ON public.media_files
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage their own media" ON public.media_files
    FOR ALL USING (auth.uid() = profile_id);

-- 8. Themes
CREATE POLICY "Themes viewable by everyone" ON public.themes
    FOR SELECT USING (TRUE);

CREATE POLICY "User themes viewable if public or owned" ON public.user_themes
    FOR SELECT USING (is_public = TRUE OR auth.uid() = profile_id);

CREATE POLICY "Users can manage their own themes" ON public.user_themes
    FOR ALL USING (auth.uid() = profile_id);

-- 9. Guestbook
CREATE POLICY "Approved guestbook entries are public" ON public.guestbook_entries
    FOR SELECT USING (is_approved = TRUE);

CREATE POLICY "Anyone authenticated can post to guestbook" ON public.guestbook_entries
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Profile owners can moderate their guestbook" ON public.guestbook_entries
    FOR ALL USING (auth.uid() = profile_id);

-- 10. Badges
CREATE POLICY "Badges are public" ON public.badges
    FOR SELECT USING (TRUE);

CREATE POLICY "User badges are public" ON public.user_badges
    FOR SELECT USING (TRUE);

-- 11. Follows & Likes
CREATE POLICY "Follows are viewable" ON public.follows FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can follow" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Followers can unfollow" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

CREATE POLICY "Likes are viewable" ON public.likes FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can like once" ON public.likes FOR INSERT WITH CHECK (TRUE);

-- 12. Announcements
CREATE POLICY "Active announcements are public" ON public.announcements
    FOR SELECT USING (is_active = TRUE);

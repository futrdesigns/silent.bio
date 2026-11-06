import { FullProfilePayload, BadgeRecord, ProfileRecord, ProfileSettingsRecord, SocialLinkRecord } from '@/lib/types/profile';
import { BUILTIN_THEMES } from '@/lib/themes/presets';
import { SYSTEM_BADGES } from '@/lib/db/seed/seed-data';
import { supabase } from '@/lib/db/client';

/**
 * Global known admins list
 */
export const ADMIN_USERNAMES = ['s', 'admin', 'silent'];

/**
 * Determines badges automatically based on user rules:
 * - Everyone gets 'verified'
 * - First 50 users (UID <= 50) get 'early_adopter' (OG badge)
 * - Users in ADMIN_USERNAMES (e.g. @s) get 'staff'
 */
export function computeAutoBadges(username: string, uidNumber: number, existingBadges: BadgeRecord[] = []): BadgeRecord[] {
  const badgeMap = new Map<string, BadgeRecord>();

  // 1. Everyone with a profile gets verified
  const verifiedBadge = SYSTEM_BADGES.find((b) => b.id === 'verified');
  if (verifiedBadge) badgeMap.set('verified', verifiedBadge);

  // 2. First 50 users get the OG badge
  if (uidNumber <= 50) {
    const ogBadge = SYSTEM_BADGES.find((b) => b.id === 'early_adopter');
    if (ogBadge) badgeMap.set('early_adopter', ogBadge);
  }

  // 3. Admin user @s gets Staff badge
  if (ADMIN_USERNAMES.includes(username.toLowerCase())) {
    const staffBadge = SYSTEM_BADGES.find((b) => b.id === 'staff');
    if (staffBadge) badgeMap.set('staff', staffBadge);
  }

  // Add any explicitly awarded badges
  for (const b of existingBadges) {
    badgeMap.set(b.id, b);
  }

  return Array.from(badgeMap.values());
}

/**
 * In-memory / localStorage multi-profile registry
 * Keeps profiles persistent across reloads and syncs with Supabase if online
 */
const MEMORY_PROFILES = new Map<string, FullProfilePayload>();
const VIEW_COUNTS = new Map<string, number>();

// Seed default accounts
function initSeed() {
  if (MEMORY_PROFILES.size > 0) return;

  const defaultTheme = BUILTIN_THEMES.midnight;

  // 1. Seed @s (Admin, UID #1)
  const sBadges = computeAutoBadges('s', 1, [
    SYSTEM_BADGES.find((b) => b.id === 'crown_vip')!,
    SYSTEM_BADGES.find((b) => b.id === 'terminal_coder')!,
  ]);

  MEMORY_PROFILES.set('s', {
    profile: {
      id: 'usr_admin_s',
      username: 's',
      displayName: 's',
      bio: 'SILENT.BIO Core Architect. Keep it calm, keep it free.',
      avatarUrl: null,
      bannerUrl: null,
      location: 'Underground',
      pronouns: 'they/them',
      customStatus: 'moderating network',
      presenceStatus: 'online',
      discordUserId: null,
      uidNumber: 1,
      isVerified: true,
      isAdmin: true,
      isBanned: false,
      hideFromExplore: false,
      hideViewCounter: false,
      createdAt: '2026-11-01T00:00:00Z',
      updatedAt: '2026-11-01T00:00:00Z',
    },
    settings: {
      id: 'set_admin_s',
      profileId: 'usr_admin_s',
      themeId: 'midnight',
      layoutPreset: 'centered',
      profileAlignment: 'center',
      cardStyle: 'glassmorphism',
      bgType: defaultTheme.bgType,
      bgValue: defaultTheme.bgValue,
      bgBlur: 0,
      bgDim: 0,
      cardOpacity: defaultTheme.cardOpacity,
      cardRadius: defaultTheme.cardRadius,
      cardBorderColor: defaultTheme.cardBorderColor,
      cardBorderWidth: defaultTheme.cardBorderWidth,
      cardShadowGlow: 'neon',
      cardShadowColor: '#A5A5FF',
      cardGlowIntensity: 0.5,
      avatarShape: 'circle',
      avatarDecoration: 'crown_gold',
      avatarGlowColor: '#A5A5FF',
      fontFamily: defaultTheme.fontFamily,
      fontEffect: 'glow',
      accentColor: '#A5A5FF',
      textColor: '#FFFFFF',
      bioTextColor: '#92949D',
      activeEffect: 'stars',
      effectIntensity: 0.6,
      cursorEffect: 'ring',
      tiltEffect: true,
      typewriterBio: false,
      crtScanlines: false,
      customCss: '',
      enableSplashScreen: false,
      splashText: 'Click to Enter',
      audioAutoplayUnlocked: true,
      audioVisualizerType: 'bars',
      audioVolume: 80,
      updatedAt: '2026-11-01T00:00:00Z',
    },
    links: [
      {
        id: 'lnk_s_1',
        profileId: 'usr_admin_s',
        platform: 'github',
        url: 'https://github.com/silent-bio',
        title: 'SILENT.BIO GitHub',
        description: 'Open source repository',
        displayStyle: 'card',
        orderIndex: 0,
        groupName: '',
        isActive: true,
        isCopyAction: false,
        clicksCount: 42,
        createdAt: '2026-11-01T00:00:00Z',
      },
    ],
    components: [],
    music: [],
    badges: sBadges,
  });
  VIEW_COUNTS.set('s', 1337);
}

initSeed();

/**
 * Get or create profile by username
 */
export async function getProfileByUsername(username: string): Promise<{ payload: FullProfilePayload; viewCount: number } | null> {
  initSeed();
  const clean = username.toLowerCase().trim();

  const isLiveSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

  // Try Supabase first if a real project URL is configured
  if (isLiveSupabase) {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*, profile_settings(*), social_links(*), profile_music(*)')
        .eq('username', clean)
        .single();

    if (profileData) {
      const uid = Number(profileData.uid_number || 1);
      const isUserAdmin = ADMIN_USERNAMES.includes(clean) || Boolean(profileData.is_admin);
      const badges = computeAutoBadges(clean, uid);

      const payload: FullProfilePayload = {
        profile: {
          id: profileData.id,
          username: profileData.username,
          displayName: profileData.display_name,
          bio: profileData.bio || '',
          avatarUrl: profileData.avatar_url,
          bannerUrl: profileData.banner_url,
          location: profileData.location || '',
          pronouns: profileData.pronouns || '',
          customStatus: profileData.custom_status || '',
          presenceStatus: profileData.presence_status || 'online',
          discordUserId: profileData.discord_user_id,
          uidNumber: uid,
          isVerified: true, // Everyone with a profile is verified
          isAdmin: isUserAdmin,
          isBanned: Boolean(profileData.is_banned),
          hideFromExplore: Boolean(profileData.hide_from_explore),
          hideViewCounter: Boolean(profileData.hide_view_counter),
          createdAt: profileData.created_at,
          updatedAt: profileData.updated_at,
        },
        settings: profileData.profile_settings?.[0] || {
          ...BUILTIN_THEMES.midnight,
          profileId: profileData.id,
          cardShadowGlow: 'soft',
          cardShadowColor: '#A5A5FF',
          cardGlowIntensity: 0.35,
          avatarShape: 'circle',
          avatarDecoration: 'glow_ring',
          avatarGlowColor: '#A5A5FF',
          tiltEffect: true,
          typewriterBio: false,
          crtScanlines: false,
          customCss: '',
          enableSplashScreen: false,
          splashText: 'Click to Enter',
          audioAutoplayUnlocked: true,
          audioVisualizerType: 'bars',
          audioVolume: 80,
          updatedAt: new Date().toISOString(),
        },
        links: profileData.social_links || [],
        components: [],
        music: profileData.profile_music || [],
        badges,
      };

      const views = (VIEW_COUNTS.get(clean) || 0) + 1;
      VIEW_COUNTS.set(clean, views);

      return { payload, viewCount: views };
    }
    } catch {
      // Supabase unreachable or mock mode, fall back to memory store
    }
  }

  // Check memory store
  const existing = MEMORY_PROFILES.get(clean);
  if (existing) {
    const views = (VIEW_COUNTS.get(clean) || 0) + 1;
    VIEW_COUNTS.set(clean, views);
    return { payload: existing, viewCount: views };
  }

  // Dynamically generate for a newly claimed or visiting username
  const nextUid = MEMORY_PROFILES.size + 1;
  const isUserAdmin = ADMIN_USERNAMES.includes(clean);
  const defaultTheme = BUILTIN_THEMES.midnight;
  const badges = computeAutoBadges(clean, nextUid);

  const newPayload: FullProfilePayload = {
    profile: {
      id: `usr_${clean}`,
      username: clean,
      displayName: clean.charAt(0).toUpperCase() + clean.slice(1),
      bio: 'Crafting a private space on SILENT.BIO.',
      avatarUrl: null,
      bannerUrl: null,
      location: '',
      pronouns: '',
      customStatus: 'active',
      presenceStatus: 'online',
      discordUserId: null,
      uidNumber: nextUid,
      isVerified: true, // Everyone with a profile is verified!
      isAdmin: isUserAdmin,
      isBanned: false,
      hideFromExplore: false,
      hideViewCounter: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    settings: {
      id: `set_${clean}`,
      profileId: `usr_${clean}`,
      themeId: 'midnight',
      layoutPreset: 'centered',
      profileAlignment: 'center',
      cardStyle: 'glassmorphism',
      bgType: defaultTheme.bgType,
      bgValue: defaultTheme.bgValue,
      bgBlur: 0,
      bgDim: 0,
      cardOpacity: defaultTheme.cardOpacity,
      cardRadius: defaultTheme.cardRadius,
      cardBorderColor: defaultTheme.cardBorderColor,
      cardBorderWidth: defaultTheme.cardBorderWidth,
      cardShadowGlow: 'soft',
      cardShadowColor: defaultTheme.accentColor,
      cardGlowIntensity: 0.35,
      avatarShape: 'circle',
      avatarDecoration: nextUid <= 50 ? 'glow_ring' : 'none',
      avatarGlowColor: defaultTheme.accentColor,
      fontFamily: defaultTheme.fontFamily,
      fontEffect: 'none',
      accentColor: defaultTheme.accentColor,
      textColor: defaultTheme.textColor,
      bioTextColor: '#92949D',
      activeEffect: 'stars',
      effectIntensity: 0.5,
      cursorEffect: 'ring',
      tiltEffect: true,
      typewriterBio: false,
      crtScanlines: false,
      customCss: '',
      enableSplashScreen: false,
      splashText: 'Click to Enter',
      audioAutoplayUnlocked: true,
      audioVisualizerType: 'bars',
      audioVolume: 80,
      updatedAt: new Date().toISOString(),
    },
    links: [
      {
        id: `lnk_${clean}_1`,
        profileId: `usr_${clean}`,
        platform: 'website',
        url: `https://silent.bio/${clean}`,
        title: 'My SILENT.BIO Space',
        description: 'Verified digital profile',
        displayStyle: 'card',
        orderIndex: 0,
        groupName: '',
        isActive: true,
        isCopyAction: false,
        clicksCount: 0,
        createdAt: new Date().toISOString(),
      },
    ],
    components: [],
    music: [
      {
        id: `mus_${clean}`,
        profileId: `usr_${clean}`,
        sourceType: 'upload',
        trackTitle: 'Midnight Ambient Drift',
        artistName: 'Solaris',
        sourceUrl: 'https://assets.silent.bio/audio/demo.mp3',
        artworkUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
        audioDuration: 180,
        orderIndex: 0,
        isAutoplay: false,
      },
    ],
    badges,
    comments: [
      {
        id: `cmt_${clean}_1`,
        profileId: `usr_${clean}`,
        authorUsername: 's',
        authorDisplayName: 's',
        authorIsVerified: true,
        content: 'Welcome to SILENT.BIO. Keep your space clean.',
        createdAt: '1d ago',
      },
    ],
  };

  MEMORY_PROFILES.set(clean, newPayload);
  const views = (VIEW_COUNTS.get(clean) || 0) + 1;
  VIEW_COUNTS.set(clean, views);

  return { payload: newPayload, viewCount: views };
}

/**
 * Save / Update Profile in Supabase and memory
 */
export async function saveProfile(payload: FullProfilePayload): Promise<boolean> {
  const clean = payload.profile.username.toLowerCase().trim();

  // Re-verify auto badges rule
  const uid = payload.profile.uidNumber;
  payload.profile.isVerified = true;
  payload.badges = computeAutoBadges(clean, uid, payload.badges);

  // Update memory store
  MEMORY_PROFILES.set(clean, payload);

  // Sync to Supabase if live credentials provided
  const isLiveSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

  if (isLiveSupabase) {
    try {
      await supabase.from('profiles').upsert({
      id: payload.profile.id,
      username: clean,
      display_name: payload.profile.displayName,
      bio: payload.profile.bio,
      avatar_url: payload.profile.avatarUrl,
      banner_url: payload.profile.bannerUrl,
      location: payload.profile.location,
      pronouns: payload.profile.pronouns,
      custom_status: payload.profile.customStatus,
      presence_status: payload.profile.presenceStatus,
      discord_user_id: payload.profile.discordUserId,
      is_verified: true,
      is_admin: payload.profile.isAdmin,
      updated_at: new Date().toISOString(),
    });

    await supabase.from('profile_settings').upsert({
      profile_id: payload.profile.id,
      theme_id: payload.settings.themeId,
      bg_type: payload.settings.bgType,
      bg_value: payload.settings.bgValue,
      accent_color: payload.settings.accentColor,
      text_color: payload.settings.textColor,
      card_opacity: payload.settings.cardOpacity,
      card_radius: payload.settings.cardRadius,
      font_family: payload.settings.fontFamily,
      font_effect: payload.settings.fontEffect,
      active_effect: payload.settings.activeEffect,
      cursor_effect: payload.settings.cursorEffect,
      custom_css: payload.settings.customCss,
      updated_at: new Date().toISOString(),
    });
    } catch {
      // Graceful offline fallback
    }
  }

  return true;
}

/**
 * Discovery Feed: Returns list of all active profiles with live view counts and badges
 */
export async function getDiscoveryProfiles(): Promise<Array<{
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  uidNumber: number;
  isVerified: boolean;
  isAdmin: boolean;
  views: number;
  badges: BadgeRecord[];
  accentColor: string;
}>> {
  initSeed();

  const list: any[] = [];
  for (const [uname, p] of MEMORY_PROFILES.entries()) {
    if (p.profile.hideFromExplore) continue;
    list.push({
      username: uname,
      displayName: p.profile.displayName,
      bio: p.profile.bio,
      avatarUrl: p.profile.avatarUrl,
      uidNumber: p.profile.uidNumber,
      isVerified: true,
      isAdmin: p.profile.isAdmin,
      views: VIEW_COUNTS.get(uname) || 1,
      badges: p.badges,
      accentColor: p.settings.accentColor,
    });
  }

  // Sort by UID / views
  return list.sort((a, b) => b.views - a.views);
}

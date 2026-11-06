import { create } from 'zustand';
import {
  FullProfilePayload,
  ProfileRecord,
  ProfileSettingsRecord,
  SocialLinkRecord,
  ProfileComponentRecord,
  ProfileMusicRecord,
} from '@/lib/types/profile';
import { BUILTIN_THEMES } from '@/lib/themes/presets';
import { SYSTEM_BADGES } from '@/lib/db/seed/seed-data';
import { computeAutoBadges, ADMIN_USERNAMES, saveProfile } from '@/lib/db/profile-service';

interface HistoryState {
  past: FullProfilePayload[];
  future: FullProfilePayload[];
}

interface EditorState {
  payload: FullProfilePayload;
  history: HistoryState;
  activeSection: string;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  autosaveStatus: 'saved' | 'saving' | 'dirty';
  isDraft: boolean;

  // Actions
  initUser: (username: string, displayName?: string, customUid?: number) => void;
  setActiveSection: (section: string) => void;
  setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  updateProfile: (partial: Partial<ProfileRecord>) => void;
  updateSettings: (partial: Partial<ProfileSettingsRecord>) => void;
  applyTheme: (themeId: string) => void;
  addLink: (link: Omit<SocialLinkRecord, 'id' | 'profileId' | 'orderIndex' | 'clicksCount' | 'createdAt'>) => void;
  updateLink: (id: string, partial: Partial<SocialLinkRecord>) => void;
  removeLink: (id: string) => void;
  reorderLinks: (links: SocialLinkRecord[]) => void;
  updateMusic: (partial: Partial<ProfileMusicRecord>) => void;
  toggleBadge: (badge: typeof SYSTEM_BADGES[number]) => void;
  undo: () => void;
  redo: () => void;
  publish: () => Promise<void>;
}

const initialMidnight = BUILTIN_THEMES.midnight;

const defaultInitialPayload: FullProfilePayload = {
  profile: {
    id: 'usr_me',
    username: 'creator',
    displayName: 'Creator',
    bio: 'Crafting thoughtful spaces on the open web.',
    avatarUrl: null,
    bannerUrl: null,
    location: '',
    pronouns: '',
    customStatus: '',
    presenceStatus: 'online',
    discordUserId: null,
    uidNumber: 1,
    isVerified: true,
    isAdmin: false,
    isBanned: false,
    hideFromExplore: false,
    hideViewCounter: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  settings: {
    id: 'set_me',
    profileId: 'usr_me',
    themeId: 'midnight',
    layoutPreset: 'centered',
    profileAlignment: 'center',
    cardStyle: 'glassmorphism',
    bgType: initialMidnight.bgType,
    bgValue: initialMidnight.bgValue,
    bgBlur: 0,
    bgDim: 0,
    cardOpacity: initialMidnight.cardOpacity,
    cardRadius: initialMidnight.cardRadius,
    cardBorderColor: initialMidnight.cardBorderColor,
    cardBorderWidth: initialMidnight.cardBorderWidth,
    cardShadowGlow: 'soft',
    cardShadowColor: initialMidnight.accentColor,
    cardGlowIntensity: 0.35,
    avatarShape: 'circle',
    avatarDecoration: 'glow_ring',
    avatarGlowColor: initialMidnight.accentColor,
    fontFamily: initialMidnight.fontFamily,
    fontEffect: 'none',
    accentColor: initialMidnight.accentColor,
    textColor: initialMidnight.textColor,
    bioTextColor: '#92949D',
    activeEffect: 'stars',
    effectIntensity: 0.5,
    cursorEffect: 'ring',
    cursorTrail: 'none',
    clickEffect: 'ripple',
    cursorCustomUrl: '',
    tiltEffect: true,
    typewriterBio: false,
    crtScanlines: false,
    customCss: '',
    enableSplashScreen: false,
    splashText: 'Click to Enter',
    splashSubtext: 'Silence speaks volumes',
    audioAutoplayUnlocked: true,
    audioVisualizerType: 'bars',
    audioVolume: 80,
    updatedAt: new Date().toISOString(),
  },
  links: [
    {
      id: 'lnk_1',
      profileId: 'usr_me',
      platform: 'github',
      url: 'https://github.com',
      title: 'GitHub Repositories',
      description: 'Open source work',
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
      id: 'mus_1',
      profileId: 'usr_me',
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
  badges: SYSTEM_BADGES.slice(0, 6),
};

export const useEditorStore = create<EditorState>((set, get) => ({
  payload: defaultInitialPayload,
  history: { past: [], future: [] },
  activeSection: 'general',
  previewDevice: 'desktop',
  autosaveStatus: 'saved',
  isDraft: false,

  initUser: (rawUsername: string, rawDisplayName?: string, customUid?: number) => {
    const username = rawUsername.toLowerCase().trim();
    const displayName = rawDisplayName || (username.charAt(0).toUpperCase() + username.slice(1));
    const isUserAdmin = ADMIN_USERNAMES.includes(username);

    let uid = customUid;
    if (!uid) {
      if (username === 's') {
        uid = 1;
      } else {
        try {
          const stored = localStorage.getItem('silent_bio_user');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.username === username && parsed.uidNumber) {
              uid = Number(parsed.uidNumber);
            }
          }
        } catch {
          // Fallback
        }
        if (!uid) uid = 2;
      }
    }

    // Compute automatic badges: everyone gets verified, first 50 get OG badge, admins get staff
    const badges = computeAutoBadges(username, uid);

    const { payload } = get();
    const music =
      payload.music.length > 0
        ? payload.music
        : [
            {
              id: `mus_${username}`,
              profileId: `usr_${username}`,
              sourceType: 'youtube' as const,
              trackTitle: 'Midnight Ambient Drift',
              artistName: 'Solaris',
              sourceUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
              artworkUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
              audioDuration: 180,
              orderIndex: 0,
              isAutoplay: false,
            },
          ];

    set({
      payload: {
        ...payload,
        profile: {
          ...payload.profile,
          id: `usr_${username}`,
          username,
          displayName,
          uidNumber: uid,
          isVerified: true, // Everyone with a profile is verified!
          isAdmin: isUserAdmin,
        },
        badges,
        music,
      },
      autosaveStatus: 'saved',
    });
  },

  setActiveSection: (activeSection) => set({ activeSection }),
  setPreviewDevice: (previewDevice) => set({ previewDevice }),

  updateProfile: (partial) => {
    const { payload, history } = get();
    set({
      history: {
        past: [...history.past, payload],
        future: [],
      },
      payload: {
        ...payload,
        profile: { ...payload.profile, ...partial, updatedAt: new Date().toISOString() },
      },
      autosaveStatus: 'dirty',
      isDraft: true,
    });
  },

  updateSettings: (partial) => {
    const { payload, history } = get();
    set({
      history: {
        past: [...history.past, payload],
        future: [],
      },
      payload: {
        ...payload,
        settings: { ...payload.settings, ...partial, updatedAt: new Date().toISOString() },
      },
      autosaveStatus: 'dirty',
      isDraft: true,
    });
  },

  applyTheme: (themeId) => {
    const theme = BUILTIN_THEMES[themeId];
    if (!theme) return;

    const { payload, history } = get();
    set({
      history: {
        past: [...history.past, payload],
        future: [],
      },
      payload: {
        ...payload,
        settings: {
          ...payload.settings,
          themeId: theme.id,
          bgType: theme.bgType,
          bgValue: theme.bgValue,
          accentColor: theme.accentColor,
          textColor: theme.textColor,
          cardOpacity: theme.cardOpacity,
          cardRadius: theme.cardRadius,
          cardBorderColor: theme.cardBorderColor,
          cardBorderWidth: theme.cardBorderWidth,
          fontFamily: theme.fontFamily,
          activeEffect: theme.activeEffect || 'none',
          updatedAt: new Date().toISOString(),
        },
      },
      autosaveStatus: 'dirty',
      isDraft: true,
    });
  },

  addLink: (linkData) => {
    const { payload, history } = get();
    const newLink: SocialLinkRecord = {
      ...linkData,
      id: `lnk_${Date.now()}`,
      profileId: payload.profile.id,
      orderIndex: payload.links.length,
      clicksCount: 0,
      createdAt: new Date().toISOString(),
    };

    set({
      history: {
        past: [...history.past, payload],
        future: [],
      },
      payload: {
        ...payload,
        links: [...payload.links, newLink],
      },
      autosaveStatus: 'dirty',
      isDraft: true,
    });
  },

  updateLink: (id, partial) => {
    const { payload, history } = get();
    set({
      history: {
        past: [...history.past, payload],
        future: [],
      },
      payload: {
        ...payload,
        links: payload.links.map((l) => (l.id === id ? { ...l, ...partial } : l)),
      },
      autosaveStatus: 'dirty',
      isDraft: true,
    });
  },

  removeLink: (id) => {
    const { payload, history } = get();
    set({
      history: {
        past: [...history.past, payload],
        future: [],
      },
      payload: {
        ...payload,
        links: payload.links.filter((l) => l.id !== id),
      },
      autosaveStatus: 'dirty',
      isDraft: true,
    });
  },

  reorderLinks: (links) => {
    const { payload, history } = get();
    set({
      history: {
        past: [...history.past, payload],
        future: [],
      },
      payload: {
        ...payload,
        links,
      },
      autosaveStatus: 'dirty',
      isDraft: true,
    });
  },

  updateMusic: (partial) => {
    const { payload, history } = get();
    const existing = payload.music[0] || {
      id: 'mus_1',
      profileId: payload.profile.id,
      sourceType: 'upload',
      trackTitle: 'Midnight Ambient',
      artistName: 'Solaris',
      sourceUrl: 'https://assets.silent.bio/audio/demo.mp3',
      artworkUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
      audioDuration: 180,
      orderIndex: 0,
      isAutoplay: false,
    };

    set({
      history: {
        past: [...history.past, payload],
        future: [],
      },
      payload: {
        ...payload,
        music: [{ ...existing, ...partial }],
      },
      autosaveStatus: 'dirty',
      isDraft: true,
    });
  },

  toggleBadge: (badge) => {
    const { payload, history } = get();
    const hasBadge = payload.badges.some((b) => b.id === badge.id);
    const updatedBadges = hasBadge
      ? payload.badges.filter((b) => b.id !== badge.id)
      : [...payload.badges, badge];

    set({
      history: {
        past: [...history.past, payload],
        future: [],
      },
      payload: {
        ...payload,
        badges: updatedBadges,
      },
      autosaveStatus: 'dirty',
      isDraft: true,
    });
  },

  undo: () => {
    const { history, payload } = get();
    if (history.past.length === 0) return;

    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);

    set({
      payload: previous,
      history: {
        past: newPast,
        future: [payload, ...history.future],
      },
      autosaveStatus: 'dirty',
    });
  },

  redo: () => {
    const { history, payload } = get();
    if (history.future.length === 0) return;

    const next = history.future[0];
    const newFuture = history.future.slice(1);

    set({
      payload: next,
      history: {
        past: [...history.past, payload],
        future: newFuture,
      },
      autosaveStatus: 'dirty',
    });
  },

  publish: async () => {
    set({ autosaveStatus: 'saving' });
    const { payload } = get();
    await saveProfile(payload);
    await new Promise((resolve) => setTimeout(resolve, 300));
    set({ autosaveStatus: 'saved', isDraft: false });
  },
}));

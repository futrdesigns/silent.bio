export type PresenceStatus = 'online' | 'idle' | 'dnd' | 'offline';

export type LayoutPreset = 'centered' | 'split' | 'left-aligned' | 'bento' | 'minimal-list' | 'full-bleed' | 'wide-card';

export type ProfileAlignment = 'center' | 'left' | 'right';

export type CardStyle = 'glassmorphism' | 'pure-flat' | 'subtle-border' | 'neo-brutalist' | 'cyber-grid' | 'elevated-dark';

export type BgType = 'solid' | 'gradient' | 'image' | 'video' | 'mesh' | 'noise';

export type FontEffect = 'none' | 'glow' | 'shimmer' | 'gradient' | 'typewriter' | 'rainbow' | 'glitch';

export type ActiveEffect = 'none' | 'snow' | 'stars' | 'rain' | 'embers' | 'particles' | 'crt_lines' | 'matrix';

export type CursorEffect = 'none' | 'trail' | 'glow' | 'ring' | 'crosshair' | 'dot';

export type AvatarDecoration = 'none' | 'glow_ring' | 'neon_pulse' | 'cyber_bracket' | 'fire_ring' | 'crown_gold' | 'thorn_wreath';

export type CardShadowGlow = 'none' | 'soft' | 'strong' | 'neon' | 'diffuse';

export type LinkDisplayStyle = 'icon-only' | 'pill' | 'card' | 'full-width' | 'glow' | 'outline' | 'brand' | 'minimal-text';

export interface ProfileRecord {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  location: string;
  pronouns: string;
  customStatus: string;
  presenceStatus: PresenceStatus;
  discordUserId: string | null;
  uidNumber: number;
  isVerified: boolean;
  isAdmin: boolean;
  isBanned: boolean;
  hideFromExplore: boolean;
  hideViewCounter: boolean;
  likesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiscordPresenceData {
  username?: string;
  discriminator?: string;
  status: PresenceStatus;
  avatar?: string;
  customStatus?: string;
  activityName?: string;
  activityDetails?: string;
  activityState?: string;
  listeningToSpotify?: boolean;
  spotifySong?: string;
  spotifyArtist?: string;
  spotifyAlbumArt?: string;
}

export interface ProfileSettingsRecord {
  id: string;
  profileId: string;
  themeId: string;
  layoutPreset: LayoutPreset;
  profileAlignment: ProfileAlignment;
  cardStyle: CardStyle;
  bgType: BgType;
  bgValue: string;
  bgBlur: number;
  bgDim: number;
  cardOpacity: number;
  cardRadius: string;
  cardBorderColor: string;
  cardBorderWidth: string;
  cardShadowGlow: CardShadowGlow;
  cardShadowColor: string;
  cardGlowIntensity: number;
  avatarShape: 'circle' | 'square' | 'squircle' | 'hexagon';
  avatarDecoration: AvatarDecoration;
  avatarGlowColor: string;
  isAnimatedAvatar?: boolean;
  isAnimatedBanner?: boolean;
  bannerHeight?: number;
  fontFamily: string;
  fontEffect: FontEffect;
  accentColor: string;
  textColor: string;
  bioTextColor: string;
  activeEffect: ActiveEffect;
  effectIntensity: number;
  cursorEffect: CursorEffect;
  cursorCustomUrl?: string;
  tiltEffect: boolean;
  typewriterBio: boolean;
  crtScanlines: boolean;
  customCss: string;
  enableSplashScreen: boolean;
  splashText: string;
  splashSubtext?: string;
  audioAutoplayUnlocked: boolean;
  audioVisualizerType: 'bars' | 'wave' | 'dots' | 'minimal';
  audioVolume: number;
  updatedAt: string;
}

export interface SocialLinkRecord {
  id: string;
  profileId: string;
  platform: string;
  url: string;
  title: string;
  description: string;
  customIcon?: string | null;
  customColor?: string | null;
  displayStyle: LinkDisplayStyle;
  orderIndex: number;
  groupName: string;
  isActive: boolean;
  isCopyAction: boolean;
  clicksCount: number;
  scheduledStart?: string | null;
  scheduledEnd?: string | null;
  createdAt: string;
}

export interface ProfileComponentRecord {
  id: string;
  profileId: string;
  componentType: string;
  title: string;
  contentPayload: Record<string, any>;
  orderIndex: number;
  colSpan: number;
  rowSpan: number;
  isActive: boolean;
}

export interface ProfileMusicRecord {
  id: string;
  profileId: string;
  sourceType: 'spotify' | 'soundcloud' | 'youtube' | 'upload';
  trackTitle: string;
  artistName: string;
  sourceUrl: string;
  artworkUrl?: string | null;
  audioDuration: number;
  orderIndex: number;
  isAutoplay: boolean;
  createdAt?: string;
}

export interface BadgeRecord {
  id: string;
  name: string;
  description: string;
  iconSvg: string;
  badgeType: string;
  color?: string;
}

export interface ProfileCommentRecord {
  id: string;
  profileId: string;
  authorUsername: string;
  authorDisplayName: string;
  authorAvatarUrl?: string | null;
  authorIsVerified?: boolean;
  content: string;
  createdAt: string;
}

export interface FullProfilePayload {
  profile: ProfileRecord;
  settings: ProfileSettingsRecord;
  links: SocialLinkRecord[];
  components: ProfileComponentRecord[];
  music: ProfileMusicRecord[];
  badges: BadgeRecord[];
  comments?: ProfileCommentRecord[];
  discordPresence?: DiscordPresenceData;
}

import { notFound } from 'next/navigation';
import { ProfileView } from '@/components/profile/ProfileView';
import { FullProfilePayload } from '@/lib/types/profile';
import { BUILTIN_THEMES } from '@/lib/themes/presets';
import { SYSTEM_BADGES } from '@/lib/db/seed/seed-data';

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;

  // Mock lookup for demonstration / SSR test
  const defaultTheme = BUILTIN_THEMES.midnight;

  const mockPayload: FullProfilePayload = {
    profile: {
      id: 'demo-profile-uuid',
      username: username,
      displayName: username.charAt(0).toUpperCase() + username.slice(1),
      bio: 'Digital explorer, creative technologist. Quiet craftsmanship in a loud world.',
      avatarUrl: null,
      bannerUrl: null,
      location: 'Berlin / Earth',
      pronouns: 'they/them',
      customStatus: 'building in quiet mode',
      presenceStatus: 'online',
      discordUserId: null,
      uidNumber: 42,
      isVerified: true,
      isAdmin: false,
      isBanned: false,
      hideFromExplore: false,
      hideViewCounter: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    settings: {
      id: 'demo-settings-uuid',
      profileId: 'demo-profile-uuid',
      themeId: 'midnight',
      layoutPreset: 'centered',
      bgType: defaultTheme.bgType,
      bgValue: defaultTheme.bgValue,
      bgBlur: 0,
      bgDim: 0,
      cardOpacity: defaultTheme.cardOpacity,
      cardRadius: defaultTheme.cardRadius,
      cardBorderColor: defaultTheme.cardBorderColor,
      cardBorderWidth: defaultTheme.cardBorderWidth,
      fontFamily: defaultTheme.fontFamily,
      fontEffect: 'none',
      accentColor: defaultTheme.accentColor,
      textColor: defaultTheme.textColor,
      activeEffect: 'stars',
      effectIntensity: 0.5,
      cursorEffect: 'none',
      customCss: '',
      enableSplashScreen: false,
      splashText: 'Click to Enter',
      audioAutoplayUnlocked: true,
      updatedAt: new Date().toISOString(),
    },
    links: [
      {
        id: 'link-1',
        profileId: 'demo-profile-uuid',
        platform: 'github',
        url: 'https://github.com',
        title: 'Open Source Repositories',
        description: 'Systems, compilers, and bio engines',
        displayStyle: 'card',
        orderIndex: 0,
        groupName: '',
        isActive: true,
        isCopyAction: false,
        clicksCount: 231,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'link-2',
        profileId: 'demo-profile-uuid',
        platform: 'x',
        url: 'https://x.com',
        title: 'Dispatches on X',
        description: 'Micro-thoughts & architecture logs',
        displayStyle: 'card',
        orderIndex: 1,
        groupName: '',
        isActive: true,
        isCopyAction: false,
        clicksCount: 114,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'link-3',
        profileId: 'demo-profile-uuid',
        platform: 'discord',
        url: 'user#0001',
        title: 'Discord Handle (Click to Copy)',
        description: 'Direct contact',
        displayStyle: 'card',
        orderIndex: 2,
        groupName: '',
        isActive: true,
        isCopyAction: true,
        clicksCount: 88,
        createdAt: new Date().toISOString(),
      },
    ],
    components: [],
    music: [
      {
        id: 'music-1',
        profileId: 'demo-profile-uuid',
        sourceType: 'upload',
        trackTitle: 'Midnight Ambient Drift',
        artistName: 'Solaris',
        sourceUrl: 'https://assets.silent.bio/audio/demo.mp3',
        audioDuration: 180,
        orderIndex: 0,
        isAutoplay: false,
        createdAt: new Date().toISOString(),
      },
    ],
    badges: SYSTEM_BADGES.slice(0, 8),
  };

  return <ProfileView payload={mockPayload} />;
}

'use client';

import * as React from 'react';
import { ProfileRecord, ProfileSettingsRecord, BadgeRecord } from '@/lib/types/profile';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Flame } from 'lucide-react';

interface IdentityHeaderProps {
  profile: ProfileRecord;
  settings: ProfileSettingsRecord;
  badges?: BadgeRecord[];
  viewCount?: number;
}

export function IdentityHeader({
  profile,
  settings,
  badges = [],
}: IdentityHeaderProps) {
  const presenceColors: Record<string, string> = {
    online: 'bg-emerald-500',
    idle: 'bg-amber-500',
    dnd: 'bg-rose-500',
    offline: 'bg-zinc-600',
  };

  // Typewriter bio effect
  const [displayedBio, setDisplayedBio] = React.useState(
    settings.typewriterBio ? '' : profile.bio
  );

  React.useEffect(() => {
    if (!settings.typewriterBio || !profile.bio) {
      setDisplayedBio(profile.bio);
      return;
    }

    let current = '';
    let index = 0;
    const interval = setInterval(() => {
      if (index < profile.bio.length) {
        current += profile.bio[index];
        setDisplayedBio(current);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [profile.bio, settings.typewriterBio]);

  // Avatar shape classes
  const shapeClass =
    settings.avatarShape === 'square'
      ? 'rounded-none'
      : settings.avatarShape === 'squircle'
      ? 'rounded-2xl'
      : settings.avatarShape === 'hexagon'
      ? 'rounded-3xl rotate-45'
      : 'rounded-full';

  // Alignment classes
  const alignment = settings.profileAlignment || 'center';
  const alignContainerClass =
    alignment === 'left'
      ? 'items-start text-left'
      : alignment === 'right'
      ? 'items-end text-right'
      : 'items-center text-center';

  const alignBadgesClass =
    alignment === 'left'
      ? 'justify-start'
      : alignment === 'right'
      ? 'justify-end'
      : 'justify-center';

  // Name effect styles
  const getNameEffectClass = () => {
    switch (settings.fontEffect) {
      case 'glow':
        return 'drop-shadow-[0_0_14px_var(--accent-glow)]';
      case 'shimmer':
        return 'effect-shimmer font-bold';
      case 'rainbow':
        return 'effect-rainbow font-bold';
      case 'glitch':
        return 'effect-glitch font-mono font-bold tracking-wider';
      case 'neon_pulse':
        return 'effect-neon font-bold';
      case 'fire':
        return 'effect-fire font-bold';
      case 'metallic':
        return 'effect-metallic font-bold';
      default:
        return '';
    }
  };

  const glowColor = settings.avatarGlowColor || settings.accentColor || '#A5A5FF';

  return (
    <div className={`flex flex-col ${alignContainerClass} space-y-4 w-full`}>
      {/* Top Banner with Fade Blend over bottom half */}
      {profile.bannerUrl && (
        <div className="-mx-6 -mt-6 mb-2 w-[calc(100%+3rem)] relative h-36 overflow-hidden rounded-t-[inherit]">
          {settings.isAnimatedBanner && profile.bannerUrl.endsWith('.mp4') ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            >
              <source src={profile.bannerUrl} type="video/mp4" />
            </video>
          ) : (
            <img
              src={profile.bannerUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
          {/* Bottom fade gradient mask */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-surface pointer-events-none" />
        </div>
      )}

      {/* Avatar Container with Presence Status and Custom Decorations */}
      <div className={`relative group ${profile.bannerUrl ? '-mt-14 z-10' : ''}`}>
        {/* Fire Ring Decoration */}
        {settings.avatarDecoration === 'fire_ring' && (
          <div className="absolute -top-3 -right-2 z-20 text-orange-500 animate-pulse">
            <Flame className="h-5 w-5 fill-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
          </div>
        )}

        {/* Decorative Ring Container */}
        <div
          className={`h-24 w-24 overflow-hidden border border-white/10 bg-surface shadow-md transition-all duration-300 group-hover:scale-105 ${shapeClass} ${
            settings.avatarDecoration === 'neon_pulse'
              ? 'ring-2 ring-accent ring-offset-2 ring-offset-background animate-pulse'
              : ''
          }`}
          style={{
            boxShadow:
              settings.avatarDecoration === 'glow_ring'
                ? `0 0 24px 4px ${glowColor}`
                : `0 0 20px ${glowColor}25`,
            borderColor: settings.avatarDecoration === 'cyber_bracket' ? glowColor : undefined,
          }}
        >
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="h-full w-full flex items-center justify-center font-bold text-2xl"
              style={{ color: settings.accentColor }}
            >
              {profile.displayName.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>

        {/* Presence Indicator */}
        <div
          className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-background ${
            presenceColors[profile.presenceStatus] || presenceColors.offline
          }`}
          title={`Status: ${profile.presenceStatus}`}
        />
      </div>

      {/* Identity Names & Badges */}
      <div className={`space-y-1.5 w-full flex flex-col ${alignContainerClass}`}>
        <div className={`flex items-center gap-1.5 flex-wrap ${alignBadgesClass}`}>
          <h1
            className={`text-2xl font-bold tracking-tight transition-all ${getNameEffectClass()}`}
            style={{
              fontFamily: settings.fontFamily,
              color: settings.textColor || '#F5F5F5',
              ['--accent-glow' as any]: settings.accentColor || '#A5A5FF',
            }}
          >
            {profile.displayName}
          </h1>

          {profile.isVerified && (
            <CheckCircle2
              className="h-5 w-5 shrink-0"
              style={{ color: settings.accentColor || '#A5A5FF' }}
            />
          )}
        </div>

        <div className={`flex items-center gap-2 text-xs font-mono text-muted ${alignBadgesClass}`}>
          <span>@{profile.username}</span>
          {profile.pronouns && (
            <>
              <span>•</span>
              <span className="italic">({profile.pronouns})</span>
            </>
          )}
        </div>
      </div>

      {/* Bio with typewriter support */}
      {profile.bio && (
        <p
          className="max-w-md text-sm leading-relaxed"
          style={{
            fontFamily: settings.fontFamily,
            color: settings.bioTextColor || '#92949D',
          }}
        >
          {displayedBio}
          {settings.typewriterBio && displayedBio.length < profile.bio.length && (
            <span className="animate-pulse text-accent">|</span>
          )}
        </p>
      )}

      {/* Custom Status */}
      {profile.customStatus && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {profile.customStatus}
        </div>
      )}

      {/* Badges Showcase */}
      {badges.length > 0 && (
        <div className={`flex flex-wrap items-center gap-1.5 pt-2 max-w-sm ${alignBadgesClass}`}>
          {badges.map((b) => (
            <div
              key={b.id}
              className="group relative flex items-center gap-1 px-2.5 py-1 rounded-md border border-white/10 bg-white/5 backdrop-blur-md text-[11px] font-mono transition-all duration-200 hover:scale-105 hover:border-white/20 hover:bg-white/10 select-none cursor-default"
              style={{
                borderColor: b.color ? `${b.color}40` : undefined,
                boxShadow: b.color ? `0 0 12px ${b.color}15` : undefined,
              }}
              title={`${b.name}: ${b.description}`}
            >
              <span
                className="h-3.5 w-3.5 shrink-0 inline-flex items-center justify-center"
                style={{ color: b.color || settings.accentColor }}
                dangerouslySetInnerHTML={{ __html: b.iconSvg }}
              />
              <span className="text-foreground/90 font-medium">{b.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

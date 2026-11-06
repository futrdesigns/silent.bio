'use client';

import * as React from 'react';
import { ProfileRecord, ProfileSettingsRecord, BadgeRecord } from '@/lib/types/profile';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Eye } from 'lucide-react';

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
  viewCount = 142,
}: IdentityHeaderProps) {
  const presenceColors: Record<string, string> = {
    online: 'bg-emerald-500',
    idle: 'bg-amber-500',
    dnd: 'bg-rose-500',
    offline: 'bg-zinc-600',
  };

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      {/* Avatar Container with Presence Status */}
      <div className="relative group">
        <div
          className="h-24 w-24 rounded-full overflow-hidden border border-white/10 bg-surface shadow-md transition-transform duration-200 group-hover:scale-105"
          style={{
            boxShadow: `0 0 24px ${settings.accentColor}20`,
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
      <div className="space-y-1.5">
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: settings.textColor || '#F5F5F5' }}
          >
            {profile.displayName}
          </h1>

          {profile.isVerified && (
            <CheckCircle2
              className="h-5 w-5"
              style={{ color: settings.accentColor || '#A5A5FF' }}
            />
          )}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-mono text-muted">
          <span>@{profile.username}</span>
          <span>•</span>
          <span>UID #{profile.uidNumber}</span>
          {!profile.hideViewCounter && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {viewCount.toLocaleString()}
              </span>
            </>
          )}
        </div>

        {profile.pronouns && (
          <p className="text-xs text-muted font-sans italic">
            ({profile.pronouns})
          </p>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <p
          className="max-w-md text-sm text-muted leading-relaxed"
          style={{
            fontFamily: settings.fontFamily,
          }}
        >
          {profile.bio}
        </p>
      )}

      {/* Custom Status */}
      {profile.customStatus && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {profile.customStatus}
        </div>
      )}

      {/* Badges Showcase: Rich Subculture & Identity Badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 max-w-sm">
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

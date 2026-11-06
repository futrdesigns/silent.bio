'use client';

import * as React from 'react';
import { SocialLinkRecord, ProfileSettingsRecord } from '@/lib/types/profile';
import {
  Globe,
  Github,
  Twitter,
  Instagram,
  Youtube,
  Twitch,
  Disc as Discord,
  Music,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { TikTokIcon, KickIcon, SteamIcon, TelegramIcon } from './SocialPlatformIcons';

interface LinksListProps {
  links: SocialLinkRecord[];
  settings: ProfileSettingsRecord;
}

export function LinksList({ links, settings }: LinksListProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('tiktok')) return <TikTokIcon className="h-4 w-4 shrink-0" />;
    if (p.includes('kick')) return <KickIcon className="h-4 w-4 shrink-0" />;
    if (p.includes('steam')) return <SteamIcon className="h-4 w-4 shrink-0" />;
    if (p.includes('telegram')) return <TelegramIcon className="h-4 w-4 shrink-0" />;
    if (p.includes('github')) return <Github className="h-4 w-4 shrink-0" />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter className="h-4 w-4 shrink-0" />;
    if (p.includes('instagram')) return <Instagram className="h-4 w-4 shrink-0" />;
    if (p.includes('youtube')) return <Youtube className="h-4 w-4 shrink-0" />;
    if (p.includes('twitch')) return <Twitch className="h-4 w-4 shrink-0" />;
    if (p.includes('discord')) return <Discord className="h-4 w-4 shrink-0" />;
    if (p.includes('spotify') || p.includes('soundcloud') || p.includes('music'))
      return <Music className="h-4 w-4 shrink-0" />;
    return <Globe className="h-4 w-4 shrink-0" />;
  };

  const handleLinkClick = (e: React.MouseEvent, link: SocialLinkRecord) => {
    if (link.isCopyAction) {
      e.preventDefault();
      navigator.clipboard.writeText(link.url);
      setCopiedId(link.id);
      setTimeout(() => setCopiedId(null), 2000);
      return;
    }

    try {
      fetch('/api/analytics/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: link.profileId, linkId: link.id }),
      }).catch(() => {});
    } catch {}
  };

  if (!links || links.length === 0) return null;

  return (
    <div className="w-full space-y-2.5 pt-2">
      {links
        .filter((l) => l.isActive)
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((link) => {
          const isCopied = copiedId === link.id;

          return (
            <a
              key={link.id}
              href={link.isCopyAction ? undefined : link.url}
              onClick={(e) => handleLinkClick(e, link)}
              target={link.isCopyAction ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between p-3.5 w-full rounded-md border border-white/5 bg-surface/80 backdrop-blur-md transition-colors duration-150 hover:bg-hover/80 hover:border-white/20 select-none cursor-pointer transform-gpu"
              style={{
                borderRadius: settings.cardRadius || '8px',
              }}
            >
              <div className="flex items-center gap-3 overflow-hidden pr-2">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/5 text-muted transition-colors duration-150 group-hover:text-accent"
                  style={{ color: link.customColor || undefined }}
                >
                  {getPlatformIcon(link.platform)}
                </div>
                <div className="text-left min-w-0">
                  <div className="text-sm font-medium text-foreground truncate transition-colors duration-150 group-hover:text-accent">
                    {link.title}
                  </div>
                  {link.description && (
                    <div className="text-xs text-muted truncate max-w-[240px]">
                      {link.description}
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-center h-5 w-5 text-muted transition-colors duration-150 group-hover:text-foreground">
                {link.isCopyAction ? (
                  isCopied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
              </div>
            </a>
          );
        })}
    </div>
  );
}

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

interface LinksListProps {
  links: SocialLinkRecord[];
  settings: ProfileSettingsRecord;
}

export function LinksList({ links, settings }: LinksListProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return <Github className="h-4 w-4" />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter className="h-4 w-4" />;
    if (p.includes('instagram')) return <Instagram className="h-4 w-4" />;
    if (p.includes('youtube')) return <Youtube className="h-4 w-4" />;
    if (p.includes('twitch')) return <Twitch className="h-4 w-4" />;
    if (p.includes('discord')) return <Discord className="h-4 w-4" />;
    if (p.includes('spotify') || p.includes('soundcloud')) return <Music className="h-4 w-4" />;
    return <Globe className="h-4 w-4" />;
  };

  const handleLinkClick = (e: React.MouseEvent, link: SocialLinkRecord) => {
    if (link.isCopyAction) {
      e.preventDefault();
      navigator.clipboard.writeText(link.url);
      setCopiedId(link.id);
      setTimeout(() => setCopiedId(null), 2000);
      return;
    }

    // Ping analytics in background
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
    <div className="w-full space-y-3 pt-2">
      {links
        .filter((l) => l.isActive)
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((link) => {
          const isCopied = copiedId === link.id;

          // Render according to displayStyle
          return (
            <a
              key={link.id}
              href={link.isCopyAction ? undefined : link.url}
              onClick={(e) => handleLinkClick(e, link)}
              target={link.isCopyAction ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between p-3.5 w-full rounded-md border border-white/5 bg-surface/80 backdrop-blur-md transition-all duration-200 hover:border-white/20 active:scale-[0.98] select-none cursor-pointer"
              style={{
                borderRadius: settings.cardRadius || '8px',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-muted transition-colors group-hover:text-foreground"
                  style={{ color: link.customColor || undefined }}
                >
                  {getPlatformIcon(link.platform)}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-foreground transition-colors group-hover:text-accent">
                    {link.title}
                  </div>
                  {link.description && (
                    <div className="text-xs text-muted truncate max-w-[220px]">
                      {link.description}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-muted transition-transform duration-200 group-hover:translate-x-0.5">
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

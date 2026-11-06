'use client';

import * as React from 'react';
import { DiscordPresenceData } from '@/lib/types/profile';
import { Music, Gamepad2, Disc as DiscordIcon } from 'lucide-react';

interface DiscordPresenceWidgetProps {
  discordUserId?: string | null;
  staticPresence?: DiscordPresenceData;
  accentColor?: string;
}

export function DiscordPresenceWidget({
  discordUserId,
  staticPresence,
  accentColor = '#A5A5FF',
}: DiscordPresenceWidgetProps) {
  const [presence, setPresence] = React.useState<DiscordPresenceData | null>(
    staticPresence || null
  );

  React.useEffect(() => {
    if (!discordUserId) return;

    // Fetch real-time Discord presence via public Lanyard REST API
    const fetchLanyard = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`);
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          const spotify = d.spotify;
          const activities = d.activities || [];
          const gameActivity = activities.find(
            (a: any) => a.type === 0 || a.type === 1
          );

          setPresence({
            username: d.discord_user.username,
            discriminator: d.discord_user.discriminator,
            status: d.discord_status || 'offline',
            avatar: d.discord_user.avatar
              ? `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.png`
              : undefined,
            activityName: gameActivity?.name,
            activityDetails: gameActivity?.details,
            activityState: gameActivity?.state,
            listeningToSpotify: d.listening_to_spotify,
            spotifySong: spotify?.song,
            spotifyArtist: spotify?.artist,
            spotifyAlbumArt: spotify?.album_art_url,
          });
        }
      } catch {
        // Fallback gracefully
      }
    };

    fetchLanyard();
    const interval = setInterval(fetchLanyard, 15000);
    return () => clearInterval(interval);
  }, [discordUserId]);

  if (!presence && !discordUserId) return null;

  const data = presence || {
    status: 'online',
    activityName: 'Visual Studio Code',
    activityDetails: 'Working on SILENT.BIO',
    listeningToSpotify: true,
    spotifySong: 'After Dark',
    spotifyArtist: 'Mr.Kitty',
  };

  const statusColorMap: Record<string, string> = {
    online: 'bg-emerald-500',
    idle: 'bg-amber-500',
    dnd: 'bg-rose-500',
    offline: 'bg-zinc-600',
  };

  return (
    <div className="w-full p-3.5 rounded-xl border border-white/10 bg-surface/70 backdrop-blur-md shadow-md space-y-2.5 transition-all hover:border-white/20 select-none">
      {/* Discord Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <DiscordIcon className="h-4 w-4 text-[#5865F2]" />
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-surface ${
                statusColorMap[data.status] || 'bg-zinc-500'
              }`}
            />
          </div>
          <span className="text-xs font-mono font-medium text-foreground">
            {data.username ? `@${data.username}` : 'Discord Presence'}
          </span>
        </div>

        <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-muted">
          {data.status}
        </span>
      </div>

      {/* Spotify Live Streaming Info */}
      {data.listeningToSpotify && data.spotifySong && (
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#1DB954]/10 border border-[#1DB954]/20">
          {data.spotifyAlbumArt ? (
            <img
              src={data.spotifyAlbumArt}
              alt=""
              className="h-8 w-8 rounded object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded bg-[#1DB954]/20 flex items-center justify-center text-[#1DB954]">
              <Music className="h-4 w-4" />
            </div>
          )}
          <div className="text-left overflow-hidden">
            <div className="text-[10px] font-mono text-[#1DB954] flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1DB954] animate-pulse" />
              LISTENING TO SPOTIFY
            </div>
            <div className="text-xs font-semibold text-foreground truncate">
              {data.spotifySong}
            </div>
            <div className="text-[11px] text-muted truncate">
              {data.spotifyArtist}
            </div>
          </div>
        </div>
      )}

      {/* Gaming / Code Activity */}
      {data.activityName && !data.listeningToSpotify && (
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 border border-white/10 text-xs">
          <Gamepad2 className="h-4 w-4 text-accent shrink-0" />
          <div className="truncate">
            <div className="font-semibold text-foreground truncate">
              {data.activityName}
            </div>
            {data.activityDetails && (
              <div className="text-[11px] text-muted truncate">
                {data.activityDetails}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

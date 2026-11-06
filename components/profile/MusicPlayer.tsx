'use client';

import * as React from 'react';
import { ProfileMusicRecord, ProfileSettingsRecord } from '@/lib/types/profile';
import { Play, Pause, Volume2, VolumeX, Music as MusicIcon, Disc } from 'lucide-react';

interface MusicPlayerProps {
  music: ProfileMusicRecord[];
  settings: ProfileSettingsRecord;
  hasInteracted: boolean;
}

export function MusicPlayer({ music, settings, hasInteracted }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [progress, setProgress] = React.useState(25);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const activeTrack = music[0];
  if (!activeTrack) return null;

  const defaultCover =
    activeTrack.artworkUrl ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80';

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = Math.min(Math.max((clickX / rect.width) * 100, 0), 100);
    setProgress(newProgress);
  };

  return (
    <div
      className="w-full p-4 rounded-xl border border-white/10 bg-surface/85 backdrop-blur-xl shadow-2xl space-y-3 transition-all hover:border-white/20 select-none"
      style={{
        borderRadius: settings.cardRadius || '14px',
        boxShadow: `0 10px 30px -10px rgba(0,0,0,0.6), 0 0 20px ${settings.accentColor}15`,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Cover Art & Track Metadata */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className={`relative h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-elevated shadow-md transition-transform duration-500 ${
              isPlaying ? 'rotate-3 scale-105' : ''
            }`}
          >
            <img
              src={defaultCover}
              alt={activeTrack.trackTitle}
              className="h-full w-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Disc className="h-5 w-5 text-white/80 animate-spin" />
              </div>
            )}
          </div>

          <div className="text-left overflow-hidden">
            <div className="text-xs font-semibold text-foreground truncate">
              {activeTrack.trackTitle}
            </div>
            <div className="text-[11px] text-muted truncate">
              {activeTrack.artistName || 'Audio Track'}
            </div>
          </div>
        </div>

        {/* Playback Controls & Waveform */}
        <div className="flex items-center gap-3">
          {/* Animated Waveform Visualizer */}
          <div className="hidden sm:flex items-end gap-1 h-5 w-12">
            {[40, 75, 100, 60, 85, 45].map((height, i) => (
              <span
                key={i}
                className="w-1 rounded-full transition-all duration-150"
                style={{
                  backgroundColor: settings.accentColor,
                  height: isPlaying ? `${height}%` : '20%',
                  opacity: isPlaying ? 0.9 : 0.3,
                }}
              />
            ))}
          </div>

          <button
            onClick={togglePlay}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-background font-bold transition-transform active:scale-95 shadow-md"
            style={{ backgroundColor: settings.accentColor }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-muted hover:text-foreground transition-colors p-1"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Scrub Bar */}
      <div
        onClick={handleSeek}
        className="w-full h-1.5 rounded-full bg-white/10 cursor-pointer overflow-hidden relative group"
      >
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{
            width: `${progress}%`,
            backgroundColor: settings.accentColor,
          }}
        />
      </div>
    </div>
  );
}

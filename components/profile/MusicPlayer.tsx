'use client';

import * as React from 'react';
import { ProfileMusicRecord, ProfileSettingsRecord } from '@/lib/types/profile';
import { Play, Pause, Volume2, VolumeX, Music as MusicIcon } from 'lucide-react';

interface MusicPlayerProps {
  music: ProfileMusicRecord[];
  settings: ProfileSettingsRecord;
  hasInteracted: boolean;
}

export function MusicPlayer({ music, settings, hasInteracted }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [progress, setProgress] = React.useState(30);

  const activeTrack = music[0];
  if (!activeTrack) return null;

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className="w-full flex items-center justify-between p-3 rounded-lg border border-white/10 bg-surface/90 backdrop-blur-md shadow-md"
      style={{ borderRadius: settings.cardRadius || '12px' }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-background transition-transform active:scale-95"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </button>

        <div className="text-left">
          <div className="text-xs font-medium text-foreground line-clamp-1">
            {activeTrack.trackTitle}
          </div>
          <div className="text-[11px] text-muted line-clamp-1">
            {activeTrack.artistName || 'Audio Track'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Minimal Audio Visualizer Wave */}
        <div className="flex items-end gap-0.5 h-4 w-8">
          <span
            className={`w-1 bg-accent rounded-full ${
              isPlaying ? 'animate-bounce h-3' : 'h-1.5'
            }`}
          />
          <span
            className={`w-1 bg-accent rounded-full ${
              isPlaying ? 'animate-bounce h-4 delay-75' : 'h-2'
            }`}
          />
          <span
            className={`w-1 bg-accent rounded-full ${
              isPlaying ? 'animate-bounce h-2 delay-150' : 'h-1'
            }`}
          />
        </div>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-muted hover:text-foreground transition-colors"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

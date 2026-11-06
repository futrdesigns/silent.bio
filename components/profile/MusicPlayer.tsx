'use client';

import * as React from 'react';
import { ProfileMusicRecord, ProfileSettingsRecord } from '@/lib/types/profile';
import { Play, Pause, Volume2, VolumeX, Disc, ExternalLink } from 'lucide-react';

interface MusicPlayerProps {
  music: ProfileMusicRecord[];
  settings: ProfileSettingsRecord;
  hasInteracted: boolean;
}

export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

export function MusicPlayer({ music, settings, hasInteracted }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [progress, setProgress] = React.useState(35);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const activeTrack = music[0];
  if (!activeTrack) return null;

  const ytId = getYouTubeId(activeTrack.sourceUrl || '');
  const isYouTube = Boolean(ytId);

  // Derived or default cover artwork
  const defaultCover =
    activeTrack.artworkUrl ||
    (isYouTube && ytId
      ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
      : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80');

  // Handle Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current && !isYouTube) {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(true);
    }
  };

  // Audio time update
  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = Math.min(Math.max((clickX / rect.width) * 100, 0), 100);
    setProgress(newProgress);

    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (audioRef.current) {
      audioRef.current.muted = next;
    }
  };

  return (
    <div
      className="w-full p-4 rounded-xl border border-white/10 bg-surface/85 backdrop-blur-xl shadow-2xl space-y-3 transition-all hover:border-white/20 select-none animate-in fade-in"
      style={{
        borderRadius: settings.cardRadius || '14px',
        boxShadow: `0 10px 30px -10px rgba(0,0,0,0.6), 0 0 25px ${settings.accentColor}15`,
      }}
    >
      {/* Hidden Native Audio Element for Direct MP3 / Streams */}
      {!isYouTube && activeTrack.sourceUrl && (
        <audio
          ref={audioRef}
          src={activeTrack.sourceUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Hidden YouTube Iframe Player when YouTube URL is used */}
      {isYouTube && ytId && isPlaying && (
        <iframe
          className="sr-only"
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=${isMuted ? 1 : 0}&enablejsapi=1&origin=${
            typeof window !== 'undefined' ? window.location.origin : ''
          }`}
          allow="autoplay"
          title="YouTube Audio Stream"
        />
      )}

      <div className="flex items-center justify-between gap-3">
        {/* Cover Art & Track Metadata */}
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          <div
            className={`relative h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-elevated shadow-md transition-all duration-500 ${
              isPlaying ? 'rotate-2 scale-105 ring-1 ring-accent/50' : ''
            }`}
          >
            <img
              src={defaultCover}
              alt={activeTrack.trackTitle}
              className="h-full w-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[1px]">
                <Disc className="h-5 w-5 text-accent animate-spin" />
              </div>
            )}
          </div>

          <div className="text-left overflow-hidden min-w-0">
            <div className="text-xs font-semibold text-foreground truncate flex items-center gap-1.5">
              <span>{activeTrack.trackTitle || 'Audio Track'}</span>
              {isYouTube && (
                <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1 py-0.2 rounded font-mono font-bold">
                  YT
                </span>
              )}
            </div>
            <div className="text-[11px] text-muted truncate">
              {activeTrack.artistName || 'Silent Stream'}
            </div>
          </div>
        </div>

        {/* Playback Controls & Waveform */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Animated Waveform Visualizer */}
          <div className="hidden sm:flex items-end gap-1 h-5 w-10">
            {[45, 80, 100, 65, 90, 50].map((height, i) => (
              <span
                key={i}
                className="w-1 rounded-full transition-all duration-150"
                style={{
                  backgroundColor: settings.accentColor || '#A5A5FF',
                  height: isPlaying ? `${height}%` : '20%',
                  opacity: isPlaying ? 0.9 : 0.3,
                }}
              />
            ))}
          </div>

          {/* Play / Pause Toggle Button */}
          <button
            onClick={togglePlay}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-md"
            style={{
              backgroundColor: settings.accentColor || '#A5A5FF',
              color: '#08090B',
            }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 ml-0.5 fill-current" />
            )}
          </button>

          {/* Mute Button */}
          <button
            onClick={handleToggleMute}
            className="text-muted hover:text-foreground transition-colors p-1"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-danger" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* External Link to track if YouTube */}
          {isYouTube && (
            <a
              href={activeTrack.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-accent transition-colors p-1"
              title="Open video on YouTube"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Scrub Bar */}
      <div
        onClick={handleSeek}
        className="w-full h-1.5 rounded-full bg-white/10 cursor-pointer overflow-hidden relative group transition-all hover:h-2"
        title="Seek"
      >
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{
            width: isPlaying ? `${progress}%` : '35%',
            backgroundColor: settings.accentColor || '#A5A5FF',
          }}
        />
      </div>
    </div>
  );
}

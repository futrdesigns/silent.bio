'use client';

import * as React from 'react';
import { FullProfilePayload } from '@/lib/types/profile';
import { BackgroundLayer } from './BackgroundLayer';
import { EffectsCanvas } from './EffectsCanvas';
import { IdentityHeader } from './IdentityHeader';
import { LinksList } from './LinksList';
import { MusicPlayer } from './MusicPlayer';
import { DiscordPresenceWidget } from './DiscordPresenceWidget';
import { CustomCursor } from './CustomCursor';
import { TiltContainer } from './TiltContainer';
import { ProfileCommentsAndLikes } from './ProfileCommentsAndLikes';
import { sanitizeCustomCss } from '@/lib/security/css-sandbox';
import { Eye, Share2, Check, QrCode } from 'lucide-react';

interface ProfileViewProps {
  payload: FullProfilePayload;
  isPreview?: boolean;
  initialViewCount?: number;
}

export function ProfileView({ payload, isPreview = false, initialViewCount = 1 }: ProfileViewProps) {
  const { profile, settings, links, components, music, badges, discordPresence, comments = [] } = payload;
  const [hasEntered, setHasEntered] = React.useState(!settings.enableSplashScreen || isPreview);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [showQrModal, setShowQrModal] = React.useState(false);

  // Compute safe scoped custom CSS
  const safeCss = React.useMemo(() => {
    if (!settings.customCss) return '';
    const res = sanitizeCustomCss(settings.customCss, '.silent-profile-root');
    return res.safe ? res.sanitizedCss : '';
  }, [settings.customCss]);

  // Card style classes
  const getCardStyleConfig = () => {
    switch (settings.cardStyle) {
      case 'glassmorphism':
        return {
          className: 'backdrop-blur-2xl bg-white/[0.04] border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]',
          style: {
            borderRadius: settings.cardRadius || '16px',
            boxShadow: `0 20px 40px -15px rgba(0,0,0,0.7), 0 0 25px ${settings.accentColor}20`,
          },
        };
      case 'neo-brutalist':
        return {
          className: 'bg-black border-2 border-foreground',
          style: {
            borderRadius: '0px',
            boxShadow: `4px 4px 0px 0px ${settings.accentColor}`,
          },
        };
      case 'cyber-grid':
        return {
          className: 'bg-[#060a12]/90 border border-cyan-500/30 backdrop-blur-md',
          style: {
            borderRadius: settings.cardRadius || '6px',
            boxShadow: '0 0 25px rgba(0, 240, 255, 0.15)',
          },
        };
      case 'pure-flat':
        return {
          className: 'bg-surface border-0 shadow-none',
          style: { borderRadius: settings.cardRadius || '12px' },
        };
      case 'subtle-border':
        return {
          className: 'bg-surface border border-white/10 shadow-sm',
          style: { borderRadius: settings.cardRadius || '12px' },
        };
      default: // elevated-dark
        return {
          className: 'border',
          style: {
            backgroundColor: `rgba(16, 17, 20, ${settings.cardOpacity})`,
            borderColor: settings.cardBorderColor,
            borderWidth: settings.cardBorderWidth,
            borderRadius: settings.cardRadius || '14px',
            boxShadow: `0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 20px ${settings.accentColor}15`,
          },
        };
    }
  };

  const cardConfig = getCardStyleConfig();

  const handleCopyProfileUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="silent-profile-root relative min-h-screen w-full flex flex-col items-center justify-center p-4 selection:bg-accent/30 selection:text-white">
      {/* Floating Top Left Editor Shortcut for Profile Owner */}
      {!isPreview && (
        <div className="fixed top-4 left-4 z-40 flex items-center gap-2">
          <a
            href="/editor"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/80 border border-white/10 text-xs font-mono text-muted backdrop-blur-md transition-all hover:text-foreground hover:border-accent/40 hover:scale-105 shadow-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Edit Profile
          </a>

          <button
            onClick={handleCopyProfileUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/80 border border-white/10 text-xs font-mono text-muted backdrop-blur-md transition-all hover:text-foreground hover:border-accent/40 hover:scale-105 shadow-md"
            title="Copy profile link"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5 text-success" /> : <Share2 className="h-3.5 w-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      )}

      {/* Floating Bottom Left Page View Counter (Fixed to page) */}
      {!profile.hideViewCounter && !isPreview && (
        <div className="fixed bottom-4 left-4 z-40">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/85 border border-white/10 text-xs font-mono text-muted backdrop-blur-xl shadow-lg transition-transform hover:scale-105 select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <Eye className="h-3.5 w-3.5 text-accent" />
            <span className="text-foreground font-semibold">{initialViewCount.toLocaleString()}</span>
            <span>views</span>
          </div>
        </div>
      )}

      {/* Custom Mouse Cursor */}
      <CustomCursor
        effect={settings.cursorEffect}
        accentColor={settings.accentColor}
        customCursorUrl={settings.cursorCustomUrl}
      />

      {/* Dynamic Background */}
      <BackgroundLayer
        bgType={settings.bgType}
        bgValue={settings.bgValue}
        bgBlur={settings.bgBlur}
        bgDim={settings.bgDim}
      />

      {/* Frame-budgeted particle, matrix, or CRT ambient effect */}
      <EffectsCanvas
        effect={settings.activeEffect}
        intensity={settings.effectIntensity}
        crtScanlines={settings.crtScanlines}
      />

      {/* Custom CSS Style Injection (Scoped & Sanitized) */}
      {safeCss && <style dangerouslySetInnerHTML={{ __html: safeCss }} />}

      {/* Optional Click-to-Enter Splash Screen */}
      {!hasEntered && (
        <div
          onClick={() => setHasEntered(true)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-xl cursor-pointer select-none transition-opacity duration-300"
        >
          <div className="space-y-4 text-center px-4">
            <span className="font-mono text-xs tracking-widest text-accent uppercase">
              SILENT.BIO
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {profile.displayName}
            </h2>
            <p className="text-xs font-mono text-muted animate-pulse">
              [ {settings.splashText || 'CLICK TO ENTER'} ]
            </p>
            {settings.splashSubtext && (
              <p className="text-[11px] text-muted max-w-xs mx-auto">
                {settings.splashSubtext}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Profile Stack: Profile Bento Card -> Separate Music Player -> Guestbook / Notes */}
      <div className="relative z-20 w-full max-w-md space-y-4 my-8">
        {/* Main Profile Card with 3D Tilt */}
        <TiltContainer enabled={settings.tiltEffect} className="w-full">
          <main
            className={`relative w-full p-6 transition-all duration-300 space-y-6 ${cardConfig.className}`}
            style={cardConfig.style}
          >
            {/* Top-Right UID Counter Badge (#) */}
            <div className="absolute top-4 right-4 z-30">
              <div
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono tracking-wider backdrop-blur-md shadow-sm transition-all hover:border-accent/40 hover:scale-105 select-none"
                title={`Unique Identifier #${profile.uidNumber}`}
              >
                <span className="text-accent font-bold">#</span>
                <span className="text-foreground font-semibold">{profile.uidNumber}</span>
              </div>
            </div>

            <IdentityHeader
              profile={profile}
              settings={settings}
              badges={badges}
              viewCount={initialViewCount}
            />

            {/* Discord Presence Relay (Lanyard) */}
            {(profile.discordUserId || discordPresence) && (
              <DiscordPresenceWidget
                discordUserId={profile.discordUserId}
                staticPresence={discordPresence}
                accentColor={settings.accentColor}
              />
            )}

            <LinksList links={links} settings={settings} />

            {/* Footer Credit & Claim */}
            <div className="pt-2 text-center">
              <a
                href="/"
                className="inline-flex items-center gap-1 font-mono text-[10px] text-muted tracking-wider uppercase transition-colors hover:text-accent"
              >
                POWERED BY SILENT.BIO • 100% FREE
              </a>
            </div>
          </main>
        </TiltContainer>

        {/* Separate Music Player Section Below Profile Card */}
        {music && music.length > 0 && (
          <MusicPlayer
            music={music}
            settings={settings}
            hasInteracted={hasEntered}
          />
        )}

        {/* Profile Comments & Likes Section */}
        <ProfileCommentsAndLikes
          profileId={profile.id}
          username={profile.username}
          accentColor={settings.accentColor}
          initialLikes={profile.likesCount || 18}
          initialComments={comments}
        />
      </div>
    </div>
  );
}

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
import { sanitizeCustomCss } from '@/lib/security/css-sandbox';

interface ProfileViewProps {
  payload: FullProfilePayload;
  isPreview?: boolean;
  initialViewCount?: number;
}

export function ProfileView({ payload, isPreview = false, initialViewCount = 1 }: ProfileViewProps) {
  const { profile, settings, links, components, music, badges, discordPresence } = payload;
  const [hasEntered, setHasEntered] = React.useState(!settings.enableSplashScreen || isPreview);

  // Compute safe scoped custom CSS
  const safeCss = React.useMemo(() => {
    if (!settings.customCss) return '';
    const res = sanitizeCustomCss(settings.customCss, '.silent-profile-root');
    return res.safe ? res.sanitizedCss : '';
  }, [settings.customCss]);

  // Card shadow & glow styling
  const getCardShadow = () => {
    const glowColor = settings.cardShadowColor || settings.accentColor || '#A5A5FF';
    const intensity = settings.cardGlowIntensity || 0.3;

    switch (settings.cardShadowGlow) {
      case 'neon':
        return `0 0 35px 2px ${glowColor}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`;
      case 'strong':
        return `0 10px 40px -10px ${glowColor}50, 0 0 20px 2px ${glowColor}30`;
      case 'diffuse':
        return `0 0 60px 10px ${glowColor}25`;
      case 'soft':
        return `0 8px 30px rgba(0, 0, 0, 0.4), 0 0 15px ${glowColor}20`;
      default:
        return '0 10px 30px -5px rgba(0, 0, 0, 0.5)';
    }
  };

  return (
    <div className="silent-profile-root relative min-h-screen w-full flex flex-col items-center justify-center p-4 selection:bg-accent/30 selection:text-white">
      {/* Floating Top Left Editor Shortcut for Profile Owner */}
      {!isPreview && (
        <div className="fixed top-4 left-4 z-40">
          <a
            href="/editor"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/80 border border-white/10 text-xs font-mono text-muted backdrop-blur-md transition-all hover:text-foreground hover:border-accent/40 hover:scale-105 shadow-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Edit Profile
          </a>
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

      {/* Main Profile Bento / Card Container with 3D Tilt */}
      <TiltContainer
        enabled={settings.tiltEffect}
        className="relative z-20 w-full max-w-md"
      >
        <main
          className="relative w-full p-6 border transition-all duration-300 space-y-6"
          style={{
            backgroundColor: `rgba(16, 17, 20, ${settings.cardOpacity})`,
            borderColor: settings.cardBorderColor,
            borderWidth: settings.cardBorderWidth,
            borderRadius: settings.cardRadius,
            boxShadow: getCardShadow(),
          }}
        >
          {/* Top-Right UID Counter Badge (#) like alias.rip & fakecrime.bio */}
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

          {music && music.length > 0 && (
            <MusicPlayer
              music={music}
              settings={settings}
              hasInteracted={hasEntered}
            />
          )}

          <LinksList links={links} settings={settings} />

          {/* Footer Credit & Claim */}
          <div className="pt-4 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-1 font-mono text-[10px] text-muted tracking-wider uppercase transition-colors hover:text-accent"
            >
              POWERED BY SILENT.BIO • 100% FREE
            </a>
          </div>
        </main>
      </TiltContainer>
    </div>
  );
}

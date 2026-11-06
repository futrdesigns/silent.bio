'use client';

import * as React from 'react';
import { FullProfilePayload } from '@/lib/types/profile';
import { BackgroundLayer } from './BackgroundLayer';
import { EffectsCanvas } from './EffectsCanvas';
import { IdentityHeader } from './IdentityHeader';
import { LinksList } from './LinksList';
import { MusicPlayer } from './MusicPlayer';
import { sanitizeCustomCss } from '@/lib/security/css-sandbox';

interface ProfileViewProps {
  payload: FullProfilePayload;
  isPreview?: boolean;
}

export function ProfileView({ payload, isPreview = false }: ProfileViewProps) {
  const { profile, settings, links, components, music, badges } = payload;
  const [hasEntered, setHasEntered] = React.useState(!settings.enableSplashScreen || isPreview);

  // Compute safe scoped custom CSS
  const safeCss = React.useMemo(() => {
    if (!settings.customCss) return '';
    const res = sanitizeCustomCss(settings.customCss, '.silent-profile-root');
    return res.safe ? res.sanitizedCss : '';
  }, [settings.customCss]);

  return (
    <div className="silent-profile-root relative min-h-screen w-full flex flex-col items-center justify-center p-4 selection:bg-accent/30 selection:text-white">
      {/* Dynamic Background */}
      <BackgroundLayer
        bgType={settings.bgType}
        bgValue={settings.bgValue}
        bgBlur={settings.bgBlur}
        bgDim={settings.bgDim}
      />

      {/* Frame-budgeted particle or ambient effect */}
      <EffectsCanvas
        effect={settings.activeEffect}
        intensity={settings.effectIntensity}
      />

      {/* Custom CSS Style Injection (Scoped & Sanitized) */}
      {safeCss && <style dangerouslySetInnerHTML={{ __html: safeCss }} />}

      {/* Optional Click-to-Enter Splash Screen */}
      {!hasEntered && (
        <div
          onClick={() => setHasEntered(true)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-xl cursor-pointer select-none transition-opacity duration-300"
        >
          <div className="space-y-4 text-center">
            <span className="font-mono text-xs tracking-widest text-accent uppercase">
              SILENT.BIO
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {profile.displayName}
            </h2>
            <p className="text-xs font-mono text-muted animate-pulse">
              [ {settings.splashText || 'CLICK TO ENTER'} ]
            </p>
          </div>
        </div>
      )}

      {/* Main Profile Bento / Card Container */}
      <main
        className="relative z-20 w-full max-w-md p-6 border transition-all duration-300 shadow-2xl space-y-6"
        style={{
          backgroundColor: `rgba(16, 17, 20, ${settings.cardOpacity})`,
          borderColor: settings.cardBorderColor,
          borderWidth: settings.cardBorderWidth,
          borderRadius: settings.cardRadius,
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
        />

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
    </div>
  );
}

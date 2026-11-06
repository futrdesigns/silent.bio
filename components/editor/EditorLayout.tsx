'use client';

import * as React from 'react';
import { useEditorStore } from '@/lib/store/editor-store';
import {
  User,
  Palette,
  Sparkles,
  Link as LinkIcon,
  LayoutGrid,
  Music,
  Code,
  Shield,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Check,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BUILTIN_THEMES } from '@/lib/themes/presets';
import { SYSTEM_BADGES } from '@/lib/db/seed/seed-data';
import { ProfileView } from '@/components/profile/ProfileView';

export function EditorNavigation() {
  const { payload, activeSection, setActiveSection, undo, redo, history } = useEditorStore();

  const navItems = [
    { id: 'general', label: 'Identity & Bio', icon: User },
    ...(payload.profile.isAdmin ? [{ id: 'badges', label: 'Admin Badges', icon: Shield }] : []),
    { id: 'appearance', label: 'Card & Typography', icon: Palette },
    { id: 'themes', label: 'Theme Presets (18)', icon: Sparkles },
    { id: 'links', label: 'Social Links', icon: LinkIcon },
    { id: 'music', label: 'Music Player Capsule', icon: Music },
    { id: 'intro', label: 'guns.lol Intro Screen', icon: Sparkles },
    { id: 'effects', label: 'Cursors, Trails & FX', icon: Sparkles },
    { id: 'custom-css', label: 'Custom CSS', icon: Code },
  ];

  return (
    <aside className="w-56 border-r border-border bg-surface flex flex-col justify-between p-3 select-none">
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2 py-1">
          <span className="font-mono text-xs tracking-wider text-accent uppercase font-bold">
            SILENT.BIO
          </span>
          <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-muted font-mono">
            EDITOR
          </span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-hover text-accent font-semibold border border-white/10'
                    : 'text-muted hover:text-foreground hover:bg-hover/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-border pt-3 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] text-muted">History</span>
          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={history.past.length === 0}
              className="p-1 rounded text-muted hover:text-foreground disabled:opacity-30"
              title="Undo"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={redo}
              disabled={history.future.length === 0}
              className="p-1 rounded text-muted hover:text-foreground disabled:opacity-30"
              title="Redo"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function EditorInspector() {
  const {
    payload,
    activeSection,
    updateProfile,
    updateSettings,
    updateMusic,
    applyTheme,
    addLink,
    removeLink,
    toggleBadge,
  } = useEditorStore();
  const [newLinkTitle, setNewLinkTitle] = React.useState('');
  const [newLinkUrl, setNewLinkUrl] = React.useState('');

  const activeTrack = payload.music[0] || {
    trackTitle: 'Midnight Ambient Drift',
    artistName: 'Solaris',
    sourceUrl: 'https://assets.silent.bio/audio/demo.mp3',
    artworkUrl: '',
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle || !newLinkUrl) return;
    addLink({
      platform: 'website',
      url: newLinkUrl,
      title: newLinkTitle,
      description: '',
      displayStyle: 'card',
      groupName: '',
      isActive: true,
      isCopyAction: false,
    });
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const handleAddPreset = (platform: string, title: string, placeholderUrl: string) => {
    addLink({
      platform,
      url: placeholderUrl,
      title,
      description: '',
      displayStyle: 'card',
      groupName: '',
      isActive: true,
      isCopyAction: false,
    });
  };

  return (
    <section className="w-80 border-l border-border bg-surface p-4 overflow-y-auto space-y-6">
      {activeSection === 'general' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono">
            Identity &amp; Bio
          </h2>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">DISPLAY NAME</label>
            <Input
              value={payload.profile.displayName}
              onChange={(e) => updateProfile({ displayName: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">PROFILE ALIGNMENT</label>
            <select
              className="w-full h-8 rounded-md border border-border bg-surface px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              value={payload.settings.profileAlignment || 'center'}
              onChange={(e) => updateSettings({ profileAlignment: e.target.value as any })}
            >
              <option value="center">Centered (Default)</option>
              <option value="left">Left Aligned</option>
              <option value="right">Right Aligned</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">AVATAR URL (IMAGE OR ANIMATED GIF)</label>
            <Input
              placeholder="https://.../avatar.gif"
              value={payload.profile.avatarUrl || ''}
              onChange={(e) => updateProfile({ avatarUrl: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">BANNER URL (IMAGE, GIF, OR MP4)</label>
            <Input
              placeholder="https://.../banner.jpg"
              value={payload.profile.bannerUrl || ''}
              onChange={(e) => updateProfile({ bannerUrl: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">BIO</label>
            <textarea
              className="w-full h-20 rounded-md border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              value={payload.profile.bio}
              onChange={(e) => updateProfile({ bio: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">CUSTOM STATUS</label>
            <Input
              placeholder="e.g. meditating"
              value={payload.profile.customStatus}
              onChange={(e) => updateProfile({ customStatus: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">PRONOUNS</label>
            <Input
              placeholder="they/them"
              value={payload.profile.pronouns}
              onChange={(e) => updateProfile({ pronouns: e.target.value })}
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-muted">YOUR BADGES</label>
              <span className="text-[10px] font-mono text-accent">AUTOMATIC</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {payload.badges.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-mono"
                  style={{ color: b.color }}
                  title={b.description}
                >
                  <span
                    className="h-3 w-3 inline-block"
                    dangerouslySetInnerHTML={{ __html: b.iconSvg }}
                  />
                  <span>{b.name}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted leading-tight">
              Every verified creator receives the Verified mark. First 50 claimers receive the OG badge automatically. Badges can only be granted by administrators.
            </p>
          </div>
        </div>
      )}

      {activeSection === 'badges' && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-accent font-mono text-xs font-bold uppercase">
              <Shield className="h-3.5 w-3.5" />
              <span>Admin Badge Controls</span>
            </div>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono mt-1">
              Grant &amp; Revoke Badges
            </h2>
            <p className="text-[11px] text-muted mt-1">
              Signed in as verified admin (@{payload.profile.username}). Toggle identity tags across users.
            </p>
          </div>
          <div className="space-y-2">
            {SYSTEM_BADGES.map((b) => {
              const isEquipped = payload.badges.some((active) => active.id === b.id);
              return (
                <button
                  key={b.id}
                  onClick={() => toggleBadge(b)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-md border text-left text-xs transition-all ${
                    isEquipped
                      ? 'border-accent bg-accent/10 text-foreground font-medium'
                      : 'border-border bg-elevated/40 text-muted hover:border-border-strong hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-4 w-4 shrink-0"
                      style={{ color: b.color }}
                      dangerouslySetInnerHTML={{ __html: b.iconSvg }}
                    />
                    <div>
                      <div className="font-semibold text-xs leading-none">{b.name}</div>
                      <div className="text-[10px] text-muted line-clamp-1 mt-0.5">
                        {b.description}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center text-[10px] ${
                      isEquipped ? 'border-accent bg-accent text-background font-bold' : 'border-border'
                    }`}
                  >
                    {isEquipped ? '✓' : ''}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeSection === 'appearance' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono">
            Appearance &amp; Glow
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">CARD ARCHITECTURE STYLE</label>
            <select
              className="w-full h-8 rounded-md border border-border bg-surface px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent font-mono"
              value={payload.settings.cardStyle || 'glassmorphism'}
              onChange={(e) => updateSettings({ cardStyle: e.target.value as any })}
            >
              <option value="glassmorphism">Glassmorphism (Frosted Glass &amp; Halo)</option>
              <option value="elevated-dark">Elevated Obsidian (Default Dark)</option>
              <option value="subtle-border">Subtle Border Minimal</option>
              <option value="pure-flat">Pure Flat Minimalist</option>
              <option value="neo-brutalist">Neo-Brutalist (Stark Contrast)</option>
              <option value="cyber-grid">Cyber Grid (Phosphor Glow)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">ACCENT COLOR</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="h-8 w-8 rounded cursor-pointer border border-border bg-transparent"
                value={payload.settings.accentColor}
                onChange={(e) => updateSettings({ accentColor: e.target.value })}
              />
              <Input
                className="font-mono text-xs"
                value={payload.settings.accentColor}
                onChange={(e) => updateSettings({ accentColor: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">AVATAR DECORATION FRAME</label>
            <select
              className="w-full h-8 rounded-md border border-border bg-surface px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              value={payload.settings.avatarDecoration}
              onChange={(e) => updateSettings({ avatarDecoration: e.target.value as any })}
            >
              <option value="none">None</option>
              <option value="glow_ring">Aura Glow Ring</option>
              <option value="neon_pulse">Neon Pulse Ring</option>
              <option value="crown_gold">VIP Gold Crown</option>
              <option value="fire_ring">Flame Flare</option>
              <option value="cyber_bracket">Cyber Brackets</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">AVATAR SHAPE</label>
            <select
              className="w-full h-8 rounded-md border border-border bg-surface px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              value={payload.settings.avatarShape}
              onChange={(e) => updateSettings({ avatarShape: e.target.value as any })}
            >
              <option value="circle">Circle</option>
              <option value="squircle">Squircle (Rounded)</option>
              <option value="square">Stark Square</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">CARD SHADOW &amp; GLOW</label>
            <select
              className="w-full h-8 rounded-md border border-border bg-surface px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              value={payload.settings.cardShadowGlow}
              onChange={(e) => updateSettings({ cardShadowGlow: e.target.value as any })}
            >
              <option value="none">Subtle Dark Border</option>
              <option value="soft">Soft Ambient Halo</option>
              <option value="strong">Intense Elevation</option>
              <option value="neon">Neon Laser Glow</option>
              <option value="diffuse">Diffuse Vapor Spread</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">TYPOGRAPHY / FONT FAMILY</label>
            <select
              className="w-full h-8 rounded-md border border-border bg-surface px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              value={payload.settings.fontFamily}
              onChange={(e) => updateSettings({ fontFamily: e.target.value })}
            >
              <option value="var(--font-geist-sans), sans-serif">Geist Sans (Clean Modern)</option>
              <option value="var(--font-geist-mono), monospace">Geist Mono (Terminal / Cyber)</option>
              <option value="'Inter', sans-serif">Inter (Neo-Digital)</option>
              <option value="'Outfit', sans-serif">Outfit (Geometric Minimal)</option>
              <option value="'Space Grotesk', sans-serif">Space Grotesk (Tech Brutalist)</option>
              <option value="'Playfair Display', serif">Playfair Display (Editorial Serif)</option>
              <option value="'Cinzel', serif">Cinzel (Gothic / Dark Fantasy)</option>
              <option value="'Cormorant Garamond', serif">Cormorant Garamond (Dark Romance / Taboo)</option>
              <option value="'Press Start 2P', monospace">Press Start 2P (8-Bit Retro Arcade)</option>
              <option value="'VT323', monospace">VT323 (Retro CRT Terminal)</option>
              <option value="'Syne', sans-serif">Syne (Futuristic Avant-Garde)</option>
              <option value="'Righteous', cursive">Righteous (Synthwave / Cyber)</option>
              <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (Sleek Tech)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">NAME TEXT EFFECT</label>
            <select
              className="w-full h-8 rounded-md border border-border bg-surface px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              value={payload.settings.fontEffect}
              onChange={(e) => updateSettings({ fontEffect: e.target.value as any })}
            >
              <option value="none">Standard Crisp Flat</option>
              <option value="glow">Neon Glow Drop Shadow</option>
              <option value="shimmer">Silver Shimmer Sweep</option>
              <option value="rainbow">Chromatic Rainbow Gradient</option>
              <option value="glitch">Glitch Chromatic Aberration</option>
              <option value="neon_pulse">Neon Tube Flickering Pulse</option>
              <option value="fire">Blazing Fire Gradient</option>
              <option value="metallic">Liquid Chrome Sheen</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted">TEXT COLOR</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  className="h-8 w-8 rounded cursor-pointer border border-border bg-transparent shrink-0"
                  value={payload.settings.textColor || '#F5F5F5'}
                  onChange={(e) => updateSettings({ textColor: e.target.value })}
                />
                <Input
                  className="font-mono text-[11px] h-8"
                  value={payload.settings.textColor || '#F5F5F5'}
                  onChange={(e) => updateSettings({ textColor: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted">BIO COLOR</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  className="h-8 w-8 rounded cursor-pointer border border-border bg-transparent shrink-0"
                  value={payload.settings.bioTextColor || '#92949D'}
                  onChange={(e) => updateSettings({ bioTextColor: e.target.value })}
                />
                <Input
                  className="font-mono text-[11px] h-8"
                  value={payload.settings.bioTextColor || '#92949D'}
                  onChange={(e) => updateSettings({ bioTextColor: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">CARD RADIUS</label>
            <Input
              value={payload.settings.cardRadius}
              onChange={(e) => updateSettings({ cardRadius: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="text-xs font-mono text-muted">TYPEWRITER BIO EFFECT</label>
            <input
              type="checkbox"
              className="rounded border-border accent-accent cursor-pointer"
              checked={payload.settings.typewriterBio}
              onChange={(e) => updateSettings({ typewriterBio: e.target.checked })}
            />
          </div>
        </div>
      )}

      {activeSection === 'themes' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono">
            Themes Gallery (18)
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(BUILTIN_THEMES).map((th) => {
              const isSelected = payload.settings.themeId === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => applyTheme(th.id)}
                  className={`p-2 rounded-md border text-left text-xs transition-all ${
                    isSelected
                      ? 'border-accent bg-accent/10 text-foreground font-semibold'
                      : 'border-border bg-elevated/40 text-muted hover:border-border-strong hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: th.accentColor }}
                    />
                    <span className="truncate">{th.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeSection === 'links' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono">
            Social Links
          </h2>

          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-muted">QUICK TEMPLATES</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleAddPreset('tiktok', 'TikTok', 'https://tiktok.com/@')}
                className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono hover:bg-white/10 text-foreground"
              >
                + TikTok
              </button>
              <button
                type="button"
                onClick={() => handleAddPreset('kick', 'Kick Stream', 'https://kick.com/')}
                className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono hover:bg-white/10 text-[#53FC18]"
              >
                + Kick
              </button>
              <button
                type="button"
                onClick={() => handleAddPreset('instagram', 'Instagram', 'https://instagram.com/')}
                className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono hover:bg-white/10 text-[#E1306C]"
              >
                + Instagram
              </button>
              <button
                type="button"
                onClick={() => handleAddPreset('youtube', 'YouTube Channel', 'https://youtube.com/@')}
                className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono hover:bg-white/10 text-[#FF0000]"
              >
                + YouTube
              </button>
              <button
                type="button"
                onClick={() => handleAddPreset('discord', 'Discord Server', 'https://discord.gg/')}
                className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono hover:bg-white/10 text-[#5865F2]"
              >
                + Discord
              </button>
              <button
                type="button"
                onClick={() => handleAddPreset('spotify', 'Spotify Profile', 'https://open.spotify.com/user/')}
                className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono hover:bg-white/10 text-[#1DB954]"
              >
                + Spotify
              </button>
            </div>
          </div>

          <form onSubmit={handleAddLink} className="space-y-2 p-3 rounded-md border border-border bg-elevated/30">
            <div className="text-xs font-semibold text-muted">Add Custom Link</div>
            <Input
              placeholder="Title (e.g. My Newsletter)"
              value={newLinkTitle}
              onChange={(e) => setNewLinkTitle(e.target.value)}
              className="text-xs"
            />
            <Input
              placeholder="URL (https://...)"
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              className="text-xs"
            />
            <Button size="sm" type="submit" className="w-full text-xs">
              Add Link
            </Button>
          </form>

          <div className="space-y-2">
            {payload.links.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-2 rounded border border-border bg-elevated text-xs"
              >
                <div className="truncate mr-2">
                  <div className="font-medium truncate">{link.title}</div>
                  <div className="text-muted text-[10px] truncate">{link.url}</div>
                </div>
                <button
                  onClick={() => removeLink(link.id)}
                  className="text-danger hover:underline text-[11px]"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'music' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono">
            Floating Music Player
          </h2>
          <p className="text-[11px] text-muted">
            Displayed as a standalone audio capsule below your profile card.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">TRACK TITLE</label>
            <Input
              value={activeTrack.trackTitle}
              onChange={(e) => updateMusic({ trackTitle: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">ARTIST NAME</label>
            <Input
              value={activeTrack.artistName || ''}
              onChange={(e) => updateMusic({ artistName: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">AUDIO SOURCE URL (MP3 / STREAM)</label>
            <Input
              placeholder="https://.../song.mp3"
              value={activeTrack.sourceUrl}
              onChange={(e) => updateMusic({ sourceUrl: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">COVER ARTWORK URL</label>
            <Input
              placeholder="https://.../cover.jpg"
              value={activeTrack.artworkUrl || ''}
              onChange={(e) => updateMusic({ artworkUrl: e.target.value })}
            />
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-mono text-muted">PRESET COVERS</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Cyber Violet', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80' },
                { label: 'Dark Ambient', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80' },
                { label: 'Synth Skyline', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80' },
                { label: 'Retro Neon', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80' },
              ].map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => updateMusic({ artworkUrl: c.url })}
                  className="flex items-center gap-2 p-1.5 rounded border border-white/10 bg-white/5 hover:border-accent text-left text-[11px] font-mono"
                >
                  <img src={c.url} alt="" className="h-6 w-6 rounded object-cover" />
                  <span className="truncate">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'intro' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono">
            guns.lol Intro Splash Screen
          </h2>
          <p className="text-[11px] text-muted leading-relaxed">
            Require visitors to click anywhere to enter your profile. Unlocks audio autoplay, triggers entrance sound, and immerses the viewer.
          </p>

          <div className="flex items-center justify-between p-3 rounded-md border border-border bg-surface">
            <div>
              <div className="text-xs font-semibold">Enable Intro Screen</div>
              <div className="text-[10px] text-muted">Full-screen gate with click to enter</div>
            </div>
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border accent-accent cursor-pointer"
              checked={payload.settings.enableSplashScreen}
              onChange={(e) => updateSettings({ enableSplashScreen: e.target.checked })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">SPLASH PROMPT BUTTON</label>
            <Input
              placeholder="CLICK ANYWHERE TO ENTER"
              value={payload.settings.splashText || ''}
              onChange={(e) => updateSettings({ splashText: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">SUBTEXT / SOUND HINT</label>
            <Input
              placeholder="e.g. turn up sound for full immersion 🔊"
              value={payload.settings.splashSubtext || ''}
              onChange={(e) => updateSettings({ splashSubtext: e.target.value })}
            />
          </div>
        </div>
      )}

      {activeSection === 'effects' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono">
            Ambient, Cursor &amp; Click Effects
          </h2>

          {/* Mouse Cursor Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">CUSTOM MOUSE CURSOR</label>
            <select
              className="w-full h-8 rounded-md border border-border bg-surface px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              value={payload.settings.cursorEffect}
              onChange={(e) => updateSettings({ cursorEffect: e.target.value as any })}
            >
              <option value="none">Default OS Pointer</option>
              <option value="ring">Aesthetic Ring Indicator</option>
              <option value="glow">Neon Glow Orb</option>
              <option value="crosshair">Sniper Tactical Crosshair</option>
              <option value="dot">Minimalist Dot</option>
              <option value="sword">Glowing Katana / Cyber Blade</option>
              <option value="heart">Pixel Heart</option>
              <option value="star">Magic Star</option>
              <option value="wand">Spell Wand</option>
              <option value="custom">Custom Image / Uploaded Cursor</option>
            </select>
          </div>

          {/* Custom Cursor URL or Direct File Upload */}
          <div className="space-y-1.5 p-2.5 rounded-md border border-white/10 bg-white/5">
            <label className="text-[11px] font-mono text-muted block">UPLOAD OR ENTER CURSOR IMAGE</label>
            <Input
              placeholder="https://.../cursor.png"
              value={payload.settings.cursorCustomUrl || ''}
              onChange={(e) => updateSettings({ cursorCustomUrl: e.target.value, cursorEffect: 'custom' })}
              className="text-xs h-8"
            />
            <label className="block w-full text-center py-1.5 px-3 rounded border border-white/10 bg-surface hover:border-accent text-[11px] font-mono cursor-pointer transition-colors">
              <span>Choose Image File (PNG, SVG, CUR)</span>
              <input
                type="file"
                accept="image/*,.cur"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === 'string') {
                        updateSettings({ cursorCustomUrl: reader.result, cursorEffect: 'custom' });
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>

          {/* Cursor Trails */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">CURSOR TRAILS</label>
            <select
              className="w-full h-8 rounded-md border border-border bg-surface px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              value={payload.settings.cursorTrail || 'none'}
              onChange={(e) => updateSettings({ cursorTrail: e.target.value as any })}
            >
              <option value="none">No Trail</option>
              <option value="particles">Neon Floating Particles</option>
              <option value="sparkles">Twinkling Star Sparkles</option>
              <option value="hearts">Floating Soft Hearts</option>
              <option value="fire">Fire Ember Sparks</option>
            </select>
          </div>

          {/* Click Burst Effect */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">CLICK BURST EFFECT</label>
            <select
              className="w-full h-8 rounded-md border border-border bg-surface px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              value={payload.settings.clickEffect || 'ripple'}
              onChange={(e) => updateSettings({ clickEffect: e.target.value as any })}
            >
              <option value="none">None</option>
              <option value="ripple">Shockwave Ripple Ring</option>
              <option value="shockwave">Intense Neon Pulse</option>
              <option value="spark_burst">Radial Sparks Explosion</option>
              <option value="heart_explode">Mini Hearts Burst</option>
              <option value="cherry_blossom">Sakura Petals Splash</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="text-xs font-mono text-muted">3D CARD TILT ON HOVER</label>
            <input
              type="checkbox"
              className="rounded border-border accent-accent cursor-pointer"
              checked={payload.settings.tiltEffect}
              onChange={(e) => updateSettings({ tiltEffect: e.target.checked })}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="text-xs font-mono text-muted">CRT SCANLINES OVERLAY</label>
            <input
              type="checkbox"
              className="rounded border-border accent-accent cursor-pointer"
              checked={payload.settings.crtScanlines}
              onChange={(e) => updateSettings({ crtScanlines: e.target.checked })}
            />
          </div>

          {/* Ambient Weather / Particles */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-muted">BACKGROUND PARTICLES &amp; WEATHER</label>
              <span className="text-[10px] text-accent font-mono capitalize">
                {payload.settings.activeEffect}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'none', label: 'None' },
                { id: 'stars', label: '✦ Stars' },
                { id: 'snow', label: '❄ Snow' },
                { id: 'rain', label: '🌧 Rain' },
                { id: 'embers', label: '🔥 Embers' },
                { id: 'cherry_blossoms', label: '🌸 Cherry Blossoms' },
                { id: 'fireflies', label: '✨ Fireflies' },
                { id: 'fog', label: '🌫 Fog / Haze' },
                { id: 'bubbles', label: '🫧 Bubbles' },
                { id: 'lightning', label: '⚡ Lightning Storm' },
                { id: 'matrix', label: '💚 Matrix Code' },
                { id: 'crt_lines', label: '📺 CRT Scanlines' },
              ].map((eff) => (
                <button
                  key={eff.id}
                  onClick={() => updateSettings({ activeEffect: eff.id as any })}
                  className={`text-left px-2.5 py-1.5 rounded text-[11px] font-mono border transition-all ${
                    payload.settings.activeEffect === eff.id
                      ? 'border-accent bg-accent/15 text-foreground font-semibold shadow-sm'
                      : 'border-border bg-elevated/40 text-muted hover:border-border-strong hover:text-foreground'
                  }`}
                >
                  {eff.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'custom-css' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono">
            Sandboxed Custom CSS
          </h2>
          <p className="text-[11px] text-muted">
            Scoped automatically to your profile container. Disallowed: @import, url(), fixed positions. Max 8 KB.
          </p>
          <textarea
            className="w-full h-48 rounded-md border border-border bg-background p-2 font-mono text-[11px] text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            placeholder={`.profile-card {\n  box-shadow: 0 0 20px rgba(165,165,255,0.2);\n}`}
            value={payload.settings.customCss}
            onChange={(e) => updateSettings({ customCss: e.target.value })}
          />
        </div>
      )}
    </section>
  );
}

export function EditorCanvas() {
  const { payload, previewDevice, setPreviewDevice, autosaveStatus, publish } = useEditorStore();

  const deviceWidths = {
    desktop: 'max-w-md',
    tablet: 'max-w-sm',
    mobile: 'max-w-[340px]',
  };

  return (
    <main className="flex-1 flex flex-col bg-background/50 overflow-hidden">
      {/* Top action bar */}
      <header className="h-12 border-b border-border bg-surface flex items-center justify-between px-4">
        <div className="flex items-center gap-1 bg-elevated p-0.5 rounded-md border border-border">
          <button
            onClick={() => setPreviewDevice('desktop')}
            className={`p-1.5 rounded transition-colors ${
              previewDevice === 'desktop' ? 'bg-hover text-accent' : 'text-muted hover:text-foreground'
            }`}
            title="Desktop view"
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setPreviewDevice('tablet')}
            className={`p-1.5 rounded transition-colors ${
              previewDevice === 'tablet' ? 'bg-hover text-accent' : 'text-muted hover:text-foreground'
            }`}
            title="Tablet view"
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setPreviewDevice('mobile')}
            className={`p-1.5 rounded transition-colors ${
              previewDevice === 'mobile' ? 'bg-hover text-accent' : 'text-muted hover:text-foreground'
            }`}
            title="Mobile view"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            {autosaveStatus === 'saving' && (
              <>
                <Loader2 className="h-3 w-3 animate-spin text-accent" />
                <span>Saving...</span>
              </>
            )}
            {autosaveStatus === 'saved' && (
              <>
                <Check className="h-3 w-3 text-success" />
                <span>Saved</span>
              </>
            )}
            {autosaveStatus === 'dirty' && (
              <span className="text-warning">Unsaved changes</span>
            )}
          </div>

          <Button size="sm" onClick={publish} className="text-xs h-7 gap-1">
            Publish
          </Button>

          <a
            href={`/${payload.profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground p-1"
            title="Open Live Profile"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* Interactive preview stage */}
      <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
        <div
          className={`w-full ${deviceWidths[previewDevice]} transition-all duration-300 rounded-xl overflow-hidden border border-border shadow-2xl`}
        >
          <ProfileView payload={payload} isPreview={true} />
        </div>
      </div>
    </main>
  );
}

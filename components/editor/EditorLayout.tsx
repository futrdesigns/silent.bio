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
  const { activeSection, setActiveSection, undo, redo, history } = useEditorStore();

  const navItems = [
    { id: 'general', label: 'General', icon: User },
    { id: 'badges', label: 'Badges', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'themes', label: 'Themes', icon: Sparkles },
    { id: 'links', label: 'Links', icon: LinkIcon },
    { id: 'effects', label: 'Effects', icon: Sparkles },
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
    applyTheme,
    addLink,
    removeLink,
    toggleBadge,
  } = useEditorStore();
  const [newLinkTitle, setNewLinkTitle] = React.useState('');
  const [newLinkUrl, setNewLinkUrl] = React.useState('');

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

  return (
    <section className="w-80 border-l border-border bg-surface p-4 overflow-y-auto space-y-6">
      {activeSection === 'general' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono">
            Identity & Bio
          </h2>
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-muted">DISPLAY NAME</label>
            <Input
              value={payload.profile.displayName}
              onChange={(e) => updateProfile({ displayName: e.target.value })}
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
        </div>
      )}

      {activeSection === 'badges' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono">
              Profile Badges
            </h2>
            <p className="text-[11px] text-muted mt-1">
              Toggle subculture and identity badges displayed on your card (alias.rip &amp; fakecrime inspired).
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
            Appearance
          </h2>
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
            <label className="text-xs font-mono text-muted">CARD RADIUS</label>
            <Input
              value={payload.settings.cardRadius}
              onChange={(e) => updateSettings({ cardRadius: e.target.value })}
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
          <form onSubmit={handleAddLink} className="space-y-2 p-3 rounded-md border border-border bg-elevated/30">
            <div className="text-xs font-semibold text-muted">Add New Link</div>
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

      {activeSection === 'effects' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono">
            Ambient Effects
          </h2>
          <div className="space-y-2">
            {(['none', 'stars', 'snow', 'rain', 'embers', 'particles'] as const).map((eff) => (
              <button
                key={eff}
                onClick={() => updateSettings({ activeEffect: eff })}
                className={`w-full text-left px-3 py-2 rounded text-xs border capitalize transition-colors ${
                  payload.settings.activeEffect === eff
                    ? 'border-accent bg-accent/10 text-foreground font-semibold'
                    : 'border-border bg-elevated/40 text-muted hover:border-border-strong'
                }`}
              >
                {eff}
              </button>
            ))}
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

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useEditorStore } from '@/lib/store/editor-store';
import {
  EditorNavigation,
  EditorInspector,
  EditorCanvas,
} from '@/components/editor/EditorLayout';
import { DashboardOverviewView } from '@/components/dashboard/DashboardOverviewView';
import {
  ExternalLink,
  Save,
  Check,
  Loader2,
  BarChart3,
  Edit3,
  LogOut,
  User,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EditingDashboard() {
  const router = useRouter();
  const { payload, initUser, autosaveStatus, publish } = useEditorStore();
  const [viewMode, setViewMode] = React.useState<'editor' | 'analytics'>('editor');
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Sync logged in user session on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('silent_bio_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.username && parsed.username !== payload.profile.username) {
          initUser(parsed.username, parsed.displayName || parsed.username);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoaded(true);
    }
  }, [initUser, payload.profile.username]);

  const handleSignOut = () => {
    localStorage.removeItem('silent_bio_user');
    router.push('/login');
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background select-none">
      {/* Top Universal Dashboard Bar */}
      <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 z-30 shrink-0">
        {/* Left: Branding & User Identity Chip */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs tracking-wider text-accent uppercase font-bold">
              SILENT.BIO
            </span>
            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-muted font-mono">
              DASHBOARD
            </span>
          </div>

          <div className="h-4 w-[1px] bg-border hidden sm:block" />

          {/* Active Profile Pill */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
            <div className="h-5 w-5 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-[10px] font-bold text-accent">
              {payload.profile.displayName?.slice(0, 1).toUpperCase() || 'U'}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-foreground font-medium">@{payload.profile.username}</span>
              <span className="text-accent text-[11px] font-bold">#{payload.profile.uidNumber}</span>
              <ShieldCheck className="h-3 w-3 text-accent" />
            </div>
          </div>
        </div>

        {/* Center: Live Profile URL Shortcut */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href={`/${payload.profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-xs font-mono text-accent hover:bg-accent/20 hover:border-accent/60 transition-all shadow-sm"
            title="Open your live public bio in a new tab"
          >
            <span>silent.bio/{payload.profile.username}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Right: Mode Switcher, Save Status & Sign Out */}
        <div className="flex items-center gap-2.5">
          {/* Mode Switcher */}
          <div className="flex items-center bg-elevated rounded-md border border-border p-0.5">
            <button
              onClick={() => setViewMode('editor')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                viewMode === 'editor'
                  ? 'bg-hover text-accent font-semibold shadow-xs'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                viewMode === 'analytics'
                  ? 'bg-hover text-accent font-semibold shadow-xs'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Analytics</span>
            </button>
          </div>

          {/* Save Status / Publish Button */}
          <Button
            size="sm"
            onClick={publish}
            className="text-xs h-8 gap-1.5 font-mono px-3"
          >
            {autosaveStatus === 'saving' ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Saving...</span>
              </>
            ) : autosaveStatus === 'saved' ? (
              <>
                <Check className="h-3 w-3 text-success" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="h-3 w-3" />
                <span>Save</span>
              </>
            )}
          </Button>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="p-1.5 text-muted hover:text-danger rounded hover:bg-white/5 transition-colors"
            title="Sign out of your account"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Stage */}
      {viewMode === 'editor' ? (
        <div className="flex-1 flex overflow-hidden">
          <EditorNavigation />
          <EditorCanvas />
          <EditorInspector />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <DashboardOverviewView />
        </div>
      )}
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, CheckCircle2, Shield, Sparkles, Eye, Flame, Compass } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getDiscoveryProfiles } from '@/lib/db/profile-service';

export default function DiscoveryPage() {
  const [profiles, setProfiles] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'og' | 'staff' | 'trending'>('all');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getDiscoveryProfiles().then((data) => {
      setProfiles(data);
      setLoading(false);
    });
  }, []);

  const filtered = profiles.filter((p) => {
    const matchesSearch =
      p.username.toLowerCase().includes(search.toLowerCase()) ||
      p.displayName.toLowerCase().includes(search.toLowerCase()) ||
      p.bio.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'og') return p.uidNumber <= 50;
    if (filter === 'staff') return p.isAdmin;
    if (filter === 'trending') return p.views >= 50;

    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 selection:bg-accent/30 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> SILENT.BIO
          </Link>
          <div className="font-mono text-xs text-accent uppercase tracking-widest flex items-center gap-1.5">
            <Compass className="h-4 w-4 animate-spin text-accent" />
            DISCOVERY NETWORK
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Community Discovery
            </h1>
            <p className="text-xs md:text-sm text-muted max-w-xl">
              Explore authentic personal spaces, creative technologists, sound artists, and verified creators on SILENT.BIO.
            </p>
          </div>

          <div className="w-full md:w-72 relative">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted" />
            <Input
              placeholder="Search by name, handle, or bio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs font-mono bg-surface"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
              filter === 'all'
                ? 'bg-accent text-background font-semibold'
                : 'bg-surface border border-border text-muted hover:text-foreground'
            }`}
          >
            All Spaces ({profiles.length})
          </button>
          <button
            onClick={() => setFilter('og')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors flex items-center gap-1 ${
              filter === 'og'
                ? 'bg-accent text-background font-semibold'
                : 'bg-surface border border-border text-muted hover:text-foreground'
            }`}
          >
            <Sparkles className="h-3 w-3" /> OG Cohort (UID ≤ 50)
          </button>
          <button
            onClick={() => setFilter('staff')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors flex items-center gap-1 ${
              filter === 'staff'
                ? 'bg-accent text-background font-semibold'
                : 'bg-surface border border-border text-muted hover:text-foreground'
            }`}
          >
            <Shield className="h-3 w-3" /> Staff &amp; Architects
          </button>
          <button
            onClick={() => setFilter('trending')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-colors flex items-center gap-1 ${
              filter === 'trending'
                ? 'bg-accent text-background font-semibold'
                : 'bg-surface border border-border text-muted hover:text-foreground'
            }`}
          >
            <Flame className="h-3 w-3" /> Trending
          </button>
        </div>

        {/* Profiles Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs font-mono text-muted">
            Loading network directory...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center space-y-2 border border-dashed border-border rounded-xl">
            <div className="text-sm font-semibold">No profiles found</div>
            <p className="text-xs text-muted">Try tweaking your search term or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <Link
                key={p.username}
                href={`/${p.username}`}
                className="group relative p-5 rounded-xl border border-white/10 bg-surface/80 backdrop-blur-md shadow-md transition-all duration-200 hover:border-accent/40 hover:scale-[1.02] flex flex-col justify-between space-y-4"
              >
                {/* Top Header: Avatar + Identity + UID */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-full overflow-hidden border border-white/10 bg-elevated flex items-center justify-center font-bold text-lg"
                      style={{ color: p.accentColor }}
                    >
                      {p.avatarUrl ? (
                        <img src={p.avatarUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        p.displayName.slice(0, 1).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm group-hover:text-accent transition-colors">
                          {p.displayName}
                        </span>
                        {p.isVerified && (
                          <CheckCircle2 className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      <div className="text-xs font-mono text-muted">@{p.username}</div>
                    </div>
                  </div>

                  {/* UID Pill */}
                  <div className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-muted">
                    <span className="text-accent font-bold">#</span>
                    <span>{p.uidNumber}</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-muted leading-relaxed line-clamp-2">
                  {p.bio || 'Silence speaks volumes.'}
                </p>

                {/* Badges Row */}
                {p.badges && p.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.badges.slice(0, 4).map((b: any) => (
                      <span
                        key={b.id}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border border-white/5 bg-white/5"
                        style={{ color: b.color || p.accentColor }}
                        title={b.description}
                      >
                        <span
                          className="h-3 w-3 inline-block"
                          dangerouslySetInnerHTML={{ __html: b.iconSvg }}
                        />
                        <span>{b.name}</span>
                      </span>
                    ))}
                    {p.badges.length > 4 && (
                      <span className="text-[10px] font-mono text-muted self-center">
                        +{p.badges.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Live View Count & Visit Action */}
                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs font-mono text-muted">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{p.views.toLocaleString()} views</span>
                  </span>
                  <span className="group-hover:text-accent group-hover:translate-x-0.5 transition-all text-[11px]">
                    Visit profile →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

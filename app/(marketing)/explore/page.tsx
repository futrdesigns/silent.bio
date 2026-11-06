import Link from 'next/link';
import { ArrowLeft, Search, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const mockProfiles = [
  { username: 'solaris', displayName: 'Solaris', bio: 'Ambient audio artist and generative sound designer.', views: 12400, verified: true },
  { username: 'kaizen', displayName: 'Kaizen', bio: 'Systems architect. C++, Rust, distributed nodes.', views: 8900, verified: true },
  { username: 'luna', displayName: 'Luna', bio: 'Minimalist photographer. Analog 35mm captures.', views: 5600, verified: false },
  { username: 'vex', displayName: 'Vex', bio: 'Security researcher & cryptographer.', views: 14200, verified: true },
  { username: 'zenith', displayName: 'Zenith', bio: 'Creative technologist & shader wizard.', views: 3400, verified: false },
  { username: 'echo', displayName: 'Echo', bio: 'Independent writer and essayist.', views: 6100, verified: false },
];

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Explore SILENT.BIO</h1>
            <p className="text-sm text-muted mt-1">
              Discover authentic profiles across art, code, music, and writing.
            </p>
          </div>

          <div className="w-full md:w-64">
            <Input placeholder="Search creators..." className="text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockProfiles.map((p) => (
            <Link
              key={p.username}
              href={`/${p.username}`}
              className="p-5 rounded-xl border border-border bg-surface hover:border-accent/40 transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-elevated border border-border flex items-center justify-center font-bold text-accent">
                    {p.displayName.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 font-semibold text-sm group-hover:text-accent transition-colors">
                      {p.displayName}
                      {p.verified && <CheckCircle2 className="h-3.5 w-3.5 text-accent" />}
                    </div>
                    <div className="text-xs font-mono text-muted">@{p.username}</div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted leading-relaxed line-clamp-2">
                {p.bio}
              </p>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-muted border-t border-border/50">
                <span>UID #{(p.views % 1000) + 1}</span>
                <span>{p.views.toLocaleString()} views</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { BUILTIN_THEMES } from '@/lib/themes/presets';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ThemesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Theme Gallery</h1>
          <p className="text-sm text-muted mt-1">
            All 18 built-in themes are starting points, never locks. Customise every detail freely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(BUILTIN_THEMES).map((th) => (
            <div
              key={th.id}
              className="p-5 rounded-xl border border-border bg-surface space-y-4 hover:border-border-strong transition-all"
            >
              <div
                className="h-32 w-full rounded-lg border border-white/5 flex flex-col items-center justify-center space-y-2 p-4"
                style={{
                  backgroundColor: th.bgType === 'solid' ? th.bgValue : '#101114',
                }}
              >
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: th.accentColor }}
                />
                <span className="font-mono text-sm font-bold" style={{ color: th.textColor }}>
                  {th.name}
                </span>
                <span className="text-[11px] text-muted font-mono">
                  Accent: {th.accentColor}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-sm">{th.name}</h3>
                <p className="text-xs text-muted mt-1 line-clamp-2">{th.description}</p>
              </div>

              <Link href={`/register?theme=${th.id}`}>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Apply &amp; Customise
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

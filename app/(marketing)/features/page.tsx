import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const featureList = [
  {
    category: 'Identity & Bio',
    items: [
      'Custom display name, bio, location, and pronouns',
      'Presence indicators (online, idle, DND, offline) with Discord Lanyard relay',
      'Real-time animated rolling view counter (privacy-preserving)',
      'Sequential authentic UID numbers',
      'Custom badges (earned, system, and community awards)',
    ],
  },
  {
    category: 'Aesthetic & Visual Craft',
    items: [
      '18 handcrafted design themes included free',
      'Custom solid, gradient, image, and looping video backgrounds with blur and dim controls',
      'Frame-budgeted ambient particles (snow, stars, rain, embers, floating particles)',
      'Custom cursor trails and optional click-to-enter splash screen',
      'Sandboxed custom CSS with strict property allow-lists (up to 8 KB)',
    ],
  },
  {
    category: 'Links & Extensibility',
    items: [
      'Over 25 social platforms with auto-detection',
      '8 distinctive display styles (cards, pills, full-width, glow, minimal-text)',
      'Click-to-copy action links for Discord handles and cryptokeys',
      'Drag-and-drop link reordering with dnd-kit',
      'Zero feature gating or tiered locks forever',
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Features</h1>
          <p className="text-sm text-muted mt-1">
            Every feature on SILENT.BIO is free for every user. No paywalls, no tiers.
          </p>
        </div>

        <div className="space-y-6">
          {featureList.map((sec) => (
            <div key={sec.category} className="p-6 rounded-xl border border-border bg-surface space-y-4">
              <h2 className="text-lg font-bold font-mono text-accent">{sec.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sec.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground/90">
                    <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 text-center">
          <Link href="/register">
            <Button size="lg">Claim Your Free Profile</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

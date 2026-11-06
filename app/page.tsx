'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Zap, Sparkles, Code2, HeartHandshake, Eye } from 'lucide-react';
import { BUILTIN_THEMES } from '@/lib/themes/presets';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-accent/20 selection:text-accent">
      {/* Navigation */}
      <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-mono text-sm tracking-widest font-bold text-accent uppercase">
            SILENT.BIO
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-xs text-muted">
            <Link href="/explore" className="hover:text-foreground transition-colors">
              Explore
            </Link>
            <Link href="/features" className="hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/themes" className="hover:text-foreground transition-colors">
              Themes
            </Link>
            <Link href="/faq" className="hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="text-xs">
              Create Profile
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-24 pb-16 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-surface border border-border text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          100% FREE FOREVER • ZERO PAYWALLS • ZERO SUBSCRIPTIONS
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
          Your identity. <br />
          Your space. <span className="text-accent">Your rules.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm md:text-base text-muted leading-relaxed">
          Create a profile that actually feels like you. Customise every detail, share your links, and build your own corner of the internet. Completely free.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/register">
            <Button size="lg" className="gap-2 text-sm">
              Create your profile <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline" size="lg" className="text-sm">
              Explore profiles
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="px-6 py-20 border-t border-border bg-surface/30">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase text-accent tracking-widest">
              Craftsmanship First
            </span>
            <h2 className="text-2xl md:text-3xl font-bold">Engineered without compromises</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-border bg-surface space-y-3">
              <ShieldCheck className="h-6 w-6 text-accent" />
              <h3 className="text-base font-semibold">100% Free Forever</h3>
              <p className="text-xs text-muted leading-relaxed">
                No &quot;Pro&quot; badges, no locked CSS, no paywalled audio or background videos. Every feature is available to everyone.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-surface space-y-3">
              <Zap className="h-6 w-6 text-accent" />
              <h3 className="text-base font-semibold">Calm &amp; Blazing Fast</h3>
              <p className="text-xs text-muted leading-relaxed">
                95+ Lighthouse score. Micro-interaction animations under 250ms following Emil Kowalski rules. No battery-draining bloat.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-surface space-y-3">
              <Eye className="h-6 w-6 text-accent" />
              <h3 className="text-base font-semibold">Privacy-First Analytics</h3>
              <p className="text-xs text-muted leading-relaxed">
                Zero tracking cookies. Daily salted hash. No raw IP retention. Real-time insights without surveillance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Themes Gallery Teaser */}
      <section className="px-6 py-20 border-t border-border">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-accent tracking-widest">
                Presets
              </span>
              <h2 className="text-2xl font-bold">18 Handcrafted Themes</h2>
            </div>
            <Link href="/themes" className="text-xs text-accent hover:underline flex items-center gap-1">
              View all themes <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {Object.values(BUILTIN_THEMES).slice(0, 6).map((th) => (
              <div
                key={th.id}
                className="p-3 rounded-lg border border-border bg-surface text-center space-y-2"
              >
                <div
                  className="h-12 w-full rounded border border-white/5 flex items-center justify-center font-mono text-xs"
                  style={{ backgroundColor: th.bgValue.includes('gradient') ? '#101114' : th.bgValue }}
                >
                  <span style={{ color: th.accentColor }}>{th.name}</span>
                </div>
                <div className="text-xs font-medium">{th.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-8 px-6 bg-surface text-center text-xs text-muted">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs font-bold text-foreground">
            SILENT.BIO • Stay private. Stand out.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/faq" className="hover:text-foreground">
              FAQ
            </Link>
            <Link href="/features" className="hover:text-foreground">
              Features
            </Link>
            <Link href="/themes" className="hover:text-foreground">
              Themes
            </Link>
            <Link href="/register" className="hover:text-foreground">
              Create Profile
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

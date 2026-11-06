import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const faqs = [
  {
    q: 'Is SILENT.BIO really 100% free forever?',
    a: 'Yes. There are zero paid subscriptions, zero pro tiers, and zero feature locks. We built the architecture to run within predictable free tiers (Supabase, Vercel, Cloudflare, Upstash).',
  },
  {
    q: 'How does SILENT.BIO differ from guns.lol or fakecrime.bio?',
    a: 'While those platforms popularised the subculture bio aesthetic, they are plagued by aggressive paywalls, heavy visual bloat, 3-6 second load times, and pay-to-win identity mechanics. SILENT.BIO provides the same expressive power (audio, effects, video, badges) with calm typography, 95+ Lighthouse speed, privacy-first analytics, and zero paywalls.',
  },
  {
    q: 'How does visitor tracking protect my privacy?',
    a: 'We use a daily salted SHA-256 hash that rotates every 24 hours UTC. We never set tracking cookies and we discard raw IP addresses immediately in memory.',
  },
  {
    q: 'Can I upload my own music and video backgrounds?',
    a: 'Yes. Audio and video backgrounds are fully supported with sensible size guidelines to ensure fast loading on mobile devices.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
          <p className="text-sm text-muted mt-1">
            Answers to common questions about SILENT.BIO architecture and usage.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="p-5 rounded-xl border border-border bg-surface space-y-2">
              <h3 className="font-semibold text-sm text-foreground">{f.q}</h3>
              <p className="text-xs text-muted leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

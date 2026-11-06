import { NextResponse } from 'next/server';
import { generateVisitorHash } from '@/lib/security/visitor-hash';
import { checkRateLimit } from '@/lib/security/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Rate limit analytics ingestion
    const rateLimit = await checkRateLimit(`analytics:${ip}`, {
      limit: 120,
      windowMs: 60_000,
    });

    if (!rateLimit.success) {
      return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await request.json();
    const { profileId, linkId } = body;

    if (!profileId) {
      return NextResponse.json({ ok: false, error: 'profileId required' }, { status: 400 });
    }

    // Generate non-reversible salted visitor hash
    const visitorHash = generateVisitorHash(ip, userAgent);

    // In a live Supabase environment, insert into public.profile_analytics
    // Here we acknowledge receipt cleanly
    return NextResponse.json({
      ok: true,
      hashPrefix: visitorHash.slice(0, 8),
      recordedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

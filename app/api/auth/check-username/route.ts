import { NextResponse } from 'next/server';
import { validateUsername } from '@/lib/security/username-safety';
import { checkRateLimit } from '@/lib/security/rate-limit';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('u');

  // Rate limit username checks to prevent enumeration
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimit = await checkRateLimit(`username_check:${clientIp}`, {
    limit: 60,
    windowMs: 60_000,
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      { available: false, error: 'Too many requests. Please slow down.' },
      { status: 429 }
    );
  }

  if (!username) {
    return NextResponse.json(
      { available: false, error: 'Username parameter is required.' },
      { status: 400 }
    );
  }

  const validation = validateUsername(username);
  if (!validation.valid) {
    return NextResponse.json({
      available: false,
      error: validation.error,
    });
  }

  // Check against reserved list & mock/live DB state
  return NextResponse.json({
    available: true,
    username: username.toLowerCase().trim(),
  });
}

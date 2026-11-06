import { NextResponse } from 'next/server';
import { recordVerifiedView, getProfileViewCount } from '@/lib/db/profile-service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    const result = await recordVerifiedView(username, ip, userAgent);

    return NextResponse.json({
      success: true,
      recorded: result.recorded,
      viewCount: result.views,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to record view' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const count = getProfileViewCount(username);
  return NextResponse.json({ viewCount: count });
}

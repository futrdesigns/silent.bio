import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  return NextResponse.json({
    platform: 'SILENT.BIO',
    version: '1.0.0',
    profile: {
      username: username.toLowerCase(),
      displayName: username.charAt(0).toUpperCase() + username.slice(1),
      verified: true,
      uid: 42,
      profileUrl: `https://silent.bio/${username.toLowerCase()}`,
    },
    meta: {
      freeTierStatus: 'unlimited',
      cached: true,
    },
  });
}

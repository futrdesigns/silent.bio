import { NextResponse } from 'next/server';
import { getUsernameByEmail, linkEmailToUsername, getProfileByUsername } from '@/lib/db/profile-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, username, displayName } = body;

    if (action === 'lookup') {
      if (!email && !username) {
        return NextResponse.json({ error: 'Email or username required' }, { status: 400 });
      }

      let resolvedUsername = username?.toLowerCase().trim();
      if (!resolvedUsername && email) {
        resolvedUsername = getUsernameByEmail(email);
      }

      if (resolvedUsername) {
        const profile = await getProfileByUsername(resolvedUsername);
        if (profile) {
          return NextResponse.json({
            found: true,
            username: profile.payload.profile.username,
            displayName: profile.payload.profile.displayName,
            uidNumber: profile.payload.profile.uidNumber,
            avatarUrl: profile.payload.profile.avatarUrl,
            isAdmin: profile.payload.profile.isAdmin,
          });
        }
      }

      return NextResponse.json({ found: false });
    }

    if (action === 'register' || action === 'link') {
      if (!email || !username) {
        return NextResponse.json({ error: 'Email and username required' }, { status: 400 });
      }

      const cleanUsername = username.toLowerCase().trim();
      const cleanEmail = email.toLowerCase().trim();

      linkEmailToUsername(cleanEmail, cleanUsername);
      const profile = await getProfileByUsername(cleanUsername);

      return NextResponse.json({
        success: true,
        username: cleanUsername,
        displayName: displayName || cleanUsername,
        uidNumber: profile?.payload.profile.uidNumber || 1,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

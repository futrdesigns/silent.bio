import { describe, it, expect } from 'vitest';
import {
  computeAutoBadges,
  getProfileByUsername,
  recordVerifiedView,
  getProfileViewCount,
  ADMIN_USERNAMES,
} from '../../lib/db/profile-service';
import { useEditorStore } from '../../lib/store/editor-store';

describe('Profile Service & Rules Verification', () => {
  it('awards verified badge to every user with a profile', () => {
    const badges = computeAutoBadges('wanderer', 105);
    const badgeIds = badges.map((b) => b.id);

    expect(badgeIds).toContain('verified');
  });

  it('awards OG / Early Adopter badge to the first 50 users automatically', () => {
    const earlyUserBadges = computeAutoBadges('alice', 12);
    expect(earlyUserBadges.map((b) => b.id)).toContain('early_adopter');

    const edgeUserBadges = computeAutoBadges('bob', 50);
    expect(edgeUserBadges.map((b) => b.id)).toContain('early_adopter');

    const lateUserBadges = computeAutoBadges('charlie', 51);
    expect(lateUserBadges.map((b) => b.id)).not.toContain('early_adopter');
  });

  it('recognizes @s as admin, grants staff and founder badges, and has no fake inflated views', () => {
    expect(ADMIN_USERNAMES).toContain('s');

    const sBadges = computeAutoBadges('s', 1);
    expect(sBadges.map((b) => b.id)).toContain('founder');
    expect(sBadges.map((b) => b.id)).toContain('staff');
    expect(sBadges.map((b) => b.id)).toContain('verified');
    expect(sBadges.map((b) => b.id)).toContain('early_adopter');

    // Genuine non-inflated starting view count
    const sViews = getProfileViewCount('s');
    expect(sViews).toBeLessThanOrEqual(10);
  });

  it('records verified views and blocks bot view-botting', async () => {
    const initialViews = getProfileViewCount('antiviewbotuser');

    // 1. Valid unique human visitor increments count
    const humanResult = await recordVerifiedView('antiviewbotuser', '198.51.100.1', 'Mozilla/5.0 Chrome/120.0');
    expect(humanResult.recorded).toBe(true);
    expect(humanResult.views).toBe(initialViews + 1);

    // 2. Immediate repeat by same visitor is blocked by cooldown
    const repeatResult = await recordVerifiedView('antiviewbotuser', '198.51.100.1', 'Mozilla/5.0 Chrome/120.0');
    expect(repeatResult.recorded).toBe(false);
    expect(repeatResult.views).toBe(initialViews + 1);

    // 3. Automated bot is blocked and does not increment
    const botResult = await recordVerifiedView('antiviewbotuser', '198.51.100.2', 'Googlebot/2.1 (+http://www.google.com/bot.html)');
    expect(botResult.recorded).toBe(false);
    expect(botResult.views).toBe(initialViews + 1);
  });

  it('initializes editor with chosen user instead of hardcoded creator', () => {
    const store = useEditorStore.getState();
    store.initUser('mycustomhandle', 'My Custom Display');

    const payload = useEditorStore.getState().payload;
    expect(payload.profile.username).toBe('mycustomhandle');
    expect(payload.profile.displayName).toBe('My Custom Display');
    expect(payload.profile.isVerified).toBe(true);
  });
});

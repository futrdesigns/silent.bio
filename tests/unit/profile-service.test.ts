import { describe, it, expect } from 'vitest';
import { computeAutoBadges, getProfileByUsername, ADMIN_USERNAMES } from '../../lib/db/profile-service';
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

  it('recognizes @s as admin and grants staff badge', () => {
    expect(ADMIN_USERNAMES).toContain('s');

    const sBadges = computeAutoBadges('s', 1);
    expect(sBadges.map((b) => b.id)).toContain('staff');
    expect(sBadges.map((b) => b.id)).toContain('verified');
    expect(sBadges.map((b) => b.id)).toContain('early_adopter');
  });

  it('increments live view count on profile visits', async () => {
    const res1 = await getProfileByUsername('testviewuser');
    expect(res1).toBeDefined();
    const count1 = res1!.viewCount;

    const res2 = await getProfileByUsername('testviewuser');
    expect(res2!.viewCount).toBe(count1 + 1);
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

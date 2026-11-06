import { describe, it, expect } from 'vitest';
import { SYSTEM_BADGES } from '../../lib/db/seed/seed-data';
import { useEditorStore } from '../../lib/store/editor-store';

describe('System Badges Collection', () => {
  it('has a rich collection of subculture and identity badges', () => {
    expect(SYSTEM_BADGES.length).toBeGreaterThanOrEqual(12);

    const badgeIds = SYSTEM_BADGES.map((b) => b.id);
    expect(badgeIds).toContain('verified');
    expect(badgeIds).toContain('early_adopter');
    expect(badgeIds).toContain('crown_vip');
    expect(badgeIds).toContain('terminal_coder');
    expect(badgeIds).toContain('skull_syndicate');
    expect(badgeIds).toContain('booster');
    expect(badgeIds).toContain('crypto_key');
  });

  it('toggles badges in editor state without mutations', () => {
    const store = useEditorStore.getState();
    const testBadge = SYSTEM_BADGES.find((b) => b.id === 'skull_syndicate')!;

    // Initial check
    const wasEquipped = store.payload.badges.some((b) => b.id === testBadge.id);

    // Toggle
    store.toggleBadge(testBadge);
    const nowEquipped = useEditorStore.getState().payload.badges.some((b) => b.id === testBadge.id);
    expect(nowEquipped).toBe(!wasEquipped);

    // Toggle back
    store.toggleBadge(testBadge);
    const restoredEquipped = useEditorStore.getState().payload.badges.some((b) => b.id === testBadge.id);
    expect(restoredEquipped).toBe(wasEquipped);
  });
});

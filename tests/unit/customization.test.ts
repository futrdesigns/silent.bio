import { describe, it, expect } from 'vitest';
import { useEditorStore } from '../../lib/store/editor-store';

describe('Advanced Customization System (guns.lol, alias.rip, fakecrime.bio standards)', () => {
  it('updates avatar shape and decoration frames', () => {
    const store = useEditorStore.getState();

    store.updateSettings({
      avatarShape: 'squircle',
      avatarDecoration: 'crown_gold',
      cardShadowGlow: 'neon',
    });

    const updated = useEditorStore.getState().payload.settings;
    expect(updated.avatarShape).toBe('squircle');
    expect(updated.avatarDecoration).toBe('crown_gold');
    expect(updated.cardShadowGlow).toBe('neon');
  });

  it('toggles 3D card tilt and CRT scanlines', () => {
    const store = useEditorStore.getState();

    store.updateSettings({
      tiltEffect: true,
      crtScanlines: true,
      cursorEffect: 'crosshair',
    });

    const updated = useEditorStore.getState().payload.settings;
    expect(updated.tiltEffect).toBe(true);
    expect(updated.crtScanlines).toBe(true);
    expect(updated.cursorEffect).toBe('crosshair');
  });

  it('supports name effects (shimmer, glow, rainbow, glitch)', () => {
    const store = useEditorStore.getState();
    store.updateSettings({ fontEffect: 'rainbow' });

    expect(useEditorStore.getState().payload.settings.fontEffect).toBe('rainbow');
  });
});

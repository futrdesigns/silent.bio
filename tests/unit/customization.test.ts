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

  it('updates card style (glassmorphism, neo-brutalist, cyber-grid)', () => {
    const store = useEditorStore.getState();

    store.updateSettings({ cardStyle: 'glassmorphism' });
    expect(useEditorStore.getState().payload.settings.cardStyle).toBe('glassmorphism');

    store.updateSettings({ cardStyle: 'neo-brutalist' });
    expect(useEditorStore.getState().payload.settings.cardStyle).toBe('neo-brutalist');
  });

  it('updates profile text and pfp alignment (center, left, right)', () => {
    const store = useEditorStore.getState();

    store.updateSettings({ profileAlignment: 'left' });
    expect(useEditorStore.getState().payload.settings.profileAlignment).toBe('left');

    store.updateSettings({ profileAlignment: 'right' });
    expect(useEditorStore.getState().payload.settings.profileAlignment).toBe('right');
  });

  it('updates music player cover art and track details', () => {
    const store = useEditorStore.getState();

    store.updateMusic({
      trackTitle: 'Neon Overdrive',
      artistName: 'Kavinsky',
      artworkUrl: 'https://example.com/cover.jpg',
    });

    const music = useEditorStore.getState().payload.music[0];
    expect(music.trackTitle).toBe('Neon Overdrive');
    expect(music.artistName).toBe('Kavinsky');
    expect(music.artworkUrl).toBe('https://example.com/cover.jpg');
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

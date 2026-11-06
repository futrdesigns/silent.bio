import { describe, it, expect } from 'vitest';
import { BUILTIN_THEMES } from '../../lib/themes/presets';

describe('Built-in Themes & Profile Styles', () => {
  it('contains all 18 specified system themes', () => {
    const expectedThemes = [
      'midnight', 'minimal', 'monochrome', 'cyber', 'neon', 'lavender',
      'crimson', 'glass', 'terminal', 'editorial', 'soft_dark', 'pure_white',
      'aurora', 'brutalist', 'retro_crt', 'sakura', 'ocean', 'ember'
    ];

    expect(Object.keys(BUILTIN_THEMES).length).toBe(18);
    for (const themeId of expectedThemes) {
      expect(BUILTIN_THEMES[themeId]).toBeDefined();
      expect(BUILTIN_THEMES[themeId].accentColor).toBeDefined();
      expect(BUILTIN_THEMES[themeId].cardRadius).toBeDefined();
    }
  });

  it('theme tokens have valid color strings', () => {
    for (const theme of Object.values(BUILTIN_THEMES)) {
      expect(theme.accentColor).toMatch(/^#|^rgba|^rgb/);
      expect(theme.cardOpacity).toBeGreaterThanOrEqual(0);
      expect(theme.cardOpacity).toBeLessThanOrEqual(1);
    }
  });
});

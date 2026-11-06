import { describe, it, expect } from 'vitest';
import { useEditorStore } from '../../lib/store/editor-store';

describe('Editor Store & Actions', () => {
  it('updates display name and enables undo', () => {
    const store = useEditorStore.getState();
    const originalName = store.payload.profile.displayName;

    store.updateProfile({ displayName: 'New Name' });
    expect(useEditorStore.getState().payload.profile.displayName).toBe('New Name');
    expect(useEditorStore.getState().history.past.length).toBeGreaterThan(0);

    store.undo();
    expect(useEditorStore.getState().payload.profile.displayName).toBe(originalName);
  });

  it('applies theme accurately across settings', () => {
    const store = useEditorStore.getState();
    store.applyTheme('cyber');

    const updated = useEditorStore.getState().payload.settings;
    expect(updated.themeId).toBe('cyber');
    expect(updated.accentColor).toBe('#00F0FF');
    expect(updated.activeEffect).toBe('rain');
  });

  it('adds and removes links cleanly', () => {
    const store = useEditorStore.getState();
    const initialCount = store.payload.links.length;

    store.addLink({
      platform: 'x',
      url: 'https://x.com/silent',
      title: 'Twitter / X',
      description: '',
      displayStyle: 'card',
      groupName: '',
      isActive: true,
      isCopyAction: false,
    });

    expect(useEditorStore.getState().payload.links.length).toBe(initialCount + 1);

    const added = useEditorStore.getState().payload.links[initialCount];
    store.removeLink(added.id);
    expect(useEditorStore.getState().payload.links.length).toBe(initialCount);
  });
});

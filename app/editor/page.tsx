'use client';

import * as React from 'react';
import {
  EditorNavigation,
  EditorInspector,
  EditorCanvas,
} from '@/components/editor/EditorLayout';
import { useEditorStore } from '@/lib/store/editor-store';

export default function EditorPage() {
  const { initUser } = useEditorStore();

  React.useEffect(() => {
    // Check if user came from register / login or local session
    try {
      const stored = localStorage.getItem('silent_bio_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.username) {
          initUser(parsed.username, parsed.displayName);
        }
      }
    } catch {
      // Fallback
    }
  }, [initUser]);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      <EditorNavigation />
      <EditorCanvas />
      <EditorInspector />
    </div>
  );
}

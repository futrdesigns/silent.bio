'use client';

import * as React from 'react';
import {
  EditorNavigation,
  EditorInspector,
  EditorCanvas,
} from '@/components/editor/EditorLayout';

export default function EditorPage() {
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      <EditorNavigation />
      <EditorCanvas />
      <EditorInspector />
    </div>
  );
}

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log error to console without user-facing disruption
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="font-mono text-xs text-danger tracking-widest uppercase">
        SYSTEM EXCEPTION
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Something went quiet</h1>
      <p className="max-w-md text-xs text-muted leading-relaxed">
        An unexpected error occurred while rendering this view.
      </p>
      <div className="pt-2">
        <Button variant="outline" size="sm" onClick={() => reset()}>
          Try Again
        </Button>
      </div>
    </div>
  );
}

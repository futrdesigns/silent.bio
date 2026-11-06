import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="font-mono text-xs text-accent tracking-widest uppercase">
        404 // NOT FOUND
      </div>
      <h1 className="text-3xl font-bold tracking-tight">The void stares back</h1>
      <p className="max-w-md text-xs text-muted leading-relaxed">
        This profile or route does not exist on SILENT.BIO. It might have been deleted, claimed under another name, or never created.
      </p>
      <div className="pt-2">
        <Link href="/">
          <Button variant="outline" size="sm">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

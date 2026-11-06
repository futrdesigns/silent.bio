'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Mock authentication handshake
    setTimeout(() => {
      localStorage.setItem('silent_bio_user', JSON.stringify({
        email,
        username: email.split('@')[0],
        displayName: email.split('@')[0],
      }));
      setIsSubmitting(false);
      router.push('/dashboard/overview');
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md border-border bg-surface">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs tracking-widest text-accent uppercase">SILENT.BIO</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
          <CardDescription>
            Sign in to manage your profile, links, and analytics.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-xs bg-danger/10 border border-danger/30 text-danger rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted">EMAIL</label>
              <Input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-muted">PASSWORD</label>
                <Link href="#" className="text-xs text-muted hover:text-foreground">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
            <div className="text-center text-xs text-muted">
              Don&apos;t have an account yet?{' '}
              <Link href="/register" className="text-foreground hover:underline">
                Create one free
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

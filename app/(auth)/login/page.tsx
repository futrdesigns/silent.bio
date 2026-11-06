'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, ArrowRight, Check, User, Mail } from 'lucide-react';
import { supabase } from '@/lib/db/client';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [chosenUsername, setChosenUsername] = React.useState('');
  const [needsUsername, setNeedsUsername] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Check saved accounts map in localStorage
  const getSavedUsername = (emailOrUser: string): string | null => {
    try {
      const clean = emailOrUser.toLowerCase().trim();
      const accountsJson = localStorage.getItem('silent_bio_accounts');
      if (accountsJson) {
        const map = JSON.parse(accountsJson);
        if (map[clean]) return map[clean];
      }
      const lastUser = localStorage.getItem('silent_bio_user');
      if (lastUser) {
        const parsed = JSON.parse(lastUser);
        if (parsed.email?.toLowerCase() === clean) return parsed.username;
        if (parsed.username?.toLowerCase() === clean) return parsed.username;
      }
    } catch {
      // Ignore
    }
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const cleanInput = identifier.toLowerCase().trim();
    const isEmail = cleanInput.includes('@');

    // 1. Check if username is known
    let targetUsername = isEmail ? getSavedUsername(cleanInput) : cleanInput;

    // 2. Server lookup if not found locally
    if (!targetUsername && isEmail) {
      try {
        const res = await fetch('/api/auth/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'lookup', email: cleanInput }),
        });
        const data = await res.json();
        if (data.found && data.username) {
          targetUsername = data.username;
        }
      } catch {
        // Fallback
      }
    }

    // 3. If email has no chosen username yet, ask user to confirm/choose one
    if (isEmail && !targetUsername && !needsUsername) {
      setNeedsUsername(true);
      setChosenUsername(cleanInput.split('@')[0].replace(/[^a-z0-9_]/g, ''));
      setIsSubmitting(false);
      return;
    }

    const finalUsername = (targetUsername || chosenUsername || cleanInput).toLowerCase().trim();

    try {
      // Save account link
      const accountsJson = localStorage.getItem('silent_bio_accounts') || '{}';
      const accounts = JSON.parse(accountsJson);
      accounts[cleanInput] = finalUsername;
      if (isEmail) accounts[finalUsername] = finalUsername;
      localStorage.setItem('silent_bio_accounts', JSON.stringify(accounts));

      // Link on server
      await fetch('/api/auth/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'link',
          email: isEmail ? cleanInput : `${finalUsername}@silent.bio`,
          username: finalUsername,
        }),
      }).catch(() => {});

      // Set active session
      localStorage.setItem(
        'silent_bio_user',
        JSON.stringify({
          email: isEmail ? cleanInput : `${finalUsername}@silent.bio`,
          username: finalUsername,
          displayName: finalUsername,
        })
      );

      // Instantly route to editing dashboard!
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Google OAuth Handler
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      const isLiveSupabase =
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

      if (isLiveSupabase) {
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (oauthError) throw oauthError;
        return;
      }

      // Seamless local/demo Google OAuth flow
      const googleEmail = prompt('Enter your Google Account email to continue:') || '';
      if (!googleEmail || !googleEmail.includes('@')) {
        setIsGoogleLoading(false);
        return;
      }

      const cleanEmail = googleEmail.toLowerCase().trim();
      let resolvedUsername = getSavedUsername(cleanEmail);

      if (!resolvedUsername) {
        resolvedUsername = prompt(
          `Choose your SILENT.BIO username for ${cleanEmail}:`,
          cleanEmail.split('@')[0].replace(/[^a-z0-9_]/g, '')
        ) || cleanEmail.split('@')[0];
      }

      const cleanUsername = resolvedUsername.toLowerCase().trim();

      // Save mapping
      const accountsJson = localStorage.getItem('silent_bio_accounts') || '{}';
      const accounts = JSON.parse(accountsJson);
      accounts[cleanEmail] = cleanUsername;
      localStorage.setItem('silent_bio_accounts', JSON.stringify(accounts));

      localStorage.setItem(
        'silent_bio_user',
        JSON.stringify({
          email: cleanEmail,
          username: cleanUsername,
          displayName: cleanUsername,
          authProvider: 'google',
        })
      );

      // Route directly to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Google sign in failed');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 select-none">
      <Card className="w-full max-w-md border-border bg-surface shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs tracking-widest text-accent uppercase font-bold">
              SILENT.BIO
            </span>
            <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-muted font-mono">
              AUTH
            </span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Sign in to your space</CardTitle>
          <CardDescription>
            Enter your email or username to instantly open your editing dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-xs bg-danger/10 border border-danger/30 text-danger rounded-md">
              {error}
            </div>
          )}

          {/* Continue with Google Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2.5 py-5 border-border hover:border-white/20 hover:bg-white/5 text-xs font-medium"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isSubmitting}
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </Button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-surface px-2 text-[10px] uppercase font-mono text-muted">
              or with email / username
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-accent" />
                <span>EMAIL OR USERNAME</span>
              </label>
              <Input
                type="text"
                placeholder="you@domain.com or @username"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setNeedsUsername(false);
                }}
                required
                className="font-mono text-xs"
              />
            </div>

            {/* If email has never set a username, let them choose it here */}
            {needsUsername && (
              <div className="p-3 rounded-md border border-accent/40 bg-accent/5 space-y-2 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-accent font-mono">
                  <Check className="h-3.5 w-3.5" />
                  <span>Choose Your Profile Username</span>
                </div>
                <p className="text-[11px] text-muted leading-tight">
                  This will be your permanent public URL (silent.bio/{chosenUsername || 'username'}).
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono text-muted">silent.bio/</span>
                  <Input
                    value={chosenUsername}
                    onChange={(e) => setChosenUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="yourhandle"
                    required
                    className="font-mono text-xs h-8"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-muted">PASSWORD</label>
              </div>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-5"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Open Editing Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 border-t border-border pt-4">
          <div className="text-center text-xs text-muted">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="text-accent hover:underline font-medium">
              Create your profile free
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

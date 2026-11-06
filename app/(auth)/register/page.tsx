'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Check, X, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/db/client';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isCheckingUsername, setIsCheckingUsername] = React.useState(false);
  const [usernameStatus, setUsernameStatus] = React.useState<{ available?: boolean; error?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameStatus(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        const res = await fetch(`/api/auth/check-username?u=${encodeURIComponent(username)}`);
        const data = await res.json();
        setUsernameStatus(data);
      } catch {
        setUsernameStatus({ available: true });
      } finally {
        setIsCheckingUsername(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus && !usernameStatus.available) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const cleanUsername = username.toLowerCase().trim();
    const cleanEmail = email.toLowerCase().trim();

    try {
      // 1. Link account locally
      const accountsJson = localStorage.getItem('silent_bio_accounts') || '{}';
      const accounts = JSON.parse(accountsJson);
      accounts[cleanEmail] = cleanUsername;
      accounts[cleanUsername] = cleanUsername;
      localStorage.setItem('silent_bio_accounts', JSON.stringify(accounts));

      // 2. Server registration & link
      await fetch('/api/auth/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          email: cleanEmail,
          username: cleanUsername,
          displayName: displayName || cleanUsername,
        }),
      }).catch(() => {});

      // 3. Set active user session
      localStorage.setItem(
        'silent_bio_user',
        JSON.stringify({
          username: cleanUsername,
          displayName: displayName || cleanUsername,
          email: cleanEmail,
        })
      );

      // 4. Instantly take the user to the editing dashboard!
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed');
      setIsSubmitting(false);
    }
  };

  // Google OAuth Handler
  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setErrorMessage(null);

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

      // Seamless local/demo Google signup
      const googleEmail = prompt('Enter your Google Account email to continue:') || '';
      if (!googleEmail || !googleEmail.includes('@')) {
        setIsGoogleLoading(false);
        return;
      }

      const cleanEmail = googleEmail.toLowerCase().trim();
      const desiredUsername =
        prompt(
          `Choose your unique SILENT.BIO username for ${cleanEmail}:`,
          cleanEmail.split('@')[0].replace(/[^a-z0-9_]/g, '')
        ) || cleanEmail.split('@')[0];

      const cleanUsername = desiredUsername.toLowerCase().trim();

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

      // Route directly to editing dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google sign up failed');
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
              JOIN
            </span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create your profile</CardTitle>
          <CardDescription>
            Claim your username and immediately enter your personal editing dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="p-3 text-xs bg-danger/10 border border-danger/30 text-danger rounded-md">
              {errorMessage}
            </div>
          )}

          {/* Continue with Google */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2.5 py-5 border-border hover:border-white/20 hover:bg-white/5 text-xs font-medium"
            onClick={handleGoogleSignUp}
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
            <span>Sign up with Google</span>
          </Button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-surface px-2 text-[10px] uppercase font-mono text-muted">
              or create account with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted">CHOOSE USERNAME</label>
              <div className="relative">
                <Input
                  placeholder="e.g. wanderer"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="font-mono pr-9 text-xs"
                  required
                />
                <div className="absolute right-3 top-2.5 text-muted">
                  {isCheckingUsername && <Loader2 className="h-4 w-4 animate-spin text-muted" />}
                  {!isCheckingUsername && usernameStatus?.available && (
                    <Check className="h-4 w-4 text-success" />
                  )}
                  {!isCheckingUsername && usernameStatus && !usernameStatus.available && (
                    <X className="h-4 w-4 text-danger" />
                  )}
                </div>
              </div>
              {usernameStatus?.error && (
                <p className="text-xs text-danger mt-1">{usernameStatus.error}</p>
              )}
              {usernameStatus?.available && (
                <p className="text-xs text-success mt-1">✓ silent.bio/{username} is available</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted">DISPLAY NAME</label>
              <Input
                placeholder="What name should appear on your profile?"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted">EMAIL ADDRESS</label>
              <Input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted">PASSWORD</label>
              <Input
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-5"
              disabled={isSubmitting || (usernameStatus !== null && !usernameStatus.available)}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Create &amp; Open Editing Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 border-t border-border pt-4">
          <div className="text-center text-xs text-muted">
            Already have an account?{' '}
            <Link href="/login" className="text-accent hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

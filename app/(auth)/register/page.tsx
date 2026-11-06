'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/lib/../components/ui/button';
import { Input } from '@/lib/../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/lib/../components/ui/card';
import { Check, X, Loader2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isCheckingUsername, setIsCheckingUsername] = React.useState(false);
  const [usernameStatus, setUsernameStatus] = React.useState<{ available?: boolean; error?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
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
        setUsernameStatus({ available: false, error: 'Network error checking username' });
      } finally {
        setIsCheckingUsername(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus && !usernameStatus.available) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    // Client registration persistence for local workflow
    try {
      const cleanUsername = username.toLowerCase().trim();
      localStorage.setItem('silent_bio_user', JSON.stringify({
        username: cleanUsername,
        displayName: displayName || cleanUsername,
        email,
      }));
      // Route immediately to the sub handle profile: /{username}
      router.push(`/${cleanUsername}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md border-border bg-surface">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs tracking-widest text-accent uppercase">SILENT.BIO</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create your profile</CardTitle>
          <CardDescription>
            Claim your username and build your private, calm space.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="p-3 text-xs bg-danger/10 border border-danger/30 text-danger rounded-md">
                {errorMessage}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted">USERNAME</label>
              <div className="relative">
                <Input
                  placeholder="e.g. wanderer"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  className="font-mono pr-9"
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
                <p className="text-xs text-success mt-1">silent.bio/{username} is available</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted">DISPLAY NAME</label>
              <Input
                placeholder="What should we call you?"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

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
              <label className="text-xs font-mono text-muted">PASSWORD</label>
              <Input
                type="password"
                placeholder="At least 8 characters"
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
              disabled={isSubmitting || (usernameStatus !== null && !usernameStatus.available)}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Claim Profile <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
            <div className="text-center text-xs text-muted">
              Already have an account?{' '}
              <Link href="/login" className="text-foreground hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

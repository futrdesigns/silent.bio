import { supabase } from '@/lib/db/client';

export interface UserSession {
  id: string;
  email: string;
  username: string;
  displayName: string;
  isAdmin: boolean;
}

export async function getCurrentUser(): Promise<UserSession | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return null;
  }

  // Fetch linked profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, is_admin')
    .eq('id', session.user.id)
    .single();

  return {
    id: session.user.id,
    email: session.user.email || '',
    username: profile?.username || 'user',
    displayName: profile?.display_name || 'Anonymous',
    isAdmin: !!profile?.is_admin,
  };
}

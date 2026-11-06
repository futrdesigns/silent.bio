import { notFound } from 'next/navigation';
import { ProfileView } from '@/components/profile/ProfileView';
import { getProfileByUsername } from '@/lib/db/profile-service';

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;

  const result = await getProfileByUsername(username);
  if (!result) {
    notFound();
  }

  const { payload, viewCount } = result;

  return <ProfileView payload={payload} initialViewCount={viewCount} />;
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { ProfileCommentRecord } from '@/lib/types/profile';
import { Heart, MessageSquare, Send, CheckCircle2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileCommentsAndLikesProps {
  profileId: string;
  username: string;
  accentColor: string;
  initialLikes?: number;
  initialComments?: ProfileCommentRecord[];
}

export function ProfileCommentsAndLikes({
  profileId,
  username,
  accentColor,
  initialLikes = 24,
  initialComments = [],
}: ProfileCommentsAndLikesProps) {
  const [likes, setLikes] = React.useState(initialLikes);
  const [hasLiked, setHasLiked] = React.useState(false);
  const [comments, setComments] = React.useState<ProfileCommentRecord[]>(initialComments);
  const [commentText, setCommentText] = React.useState('');
  const [currentUser, setCurrentUser] = React.useState<{ username: string; displayName: string } | null>(null);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('silent_bio_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
      const likedKey = `silent_bio_liked_${username}`;
      if (localStorage.getItem(likedKey)) {
        setHasLiked(true);
      }
    } catch {}
  }, [username]);

  const handleToggleLike = () => {
    const likedKey = `silent_bio_liked_${username}`;
    if (hasLiked) {
      setLikes((prev) => Math.max(0, prev - 1));
      setHasLiked(false);
      localStorage.removeItem(likedKey);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      localStorage.setItem(likedKey, 'true');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    const newComment: ProfileCommentRecord = {
      id: `cmt_${Date.now()}`,
      profileId,
      authorUsername: currentUser.username,
      authorDisplayName: currentUser.displayName || currentUser.username,
      authorIsVerified: true,
      content: commentText.trim(),
      createdAt: 'Just now',
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText('');
  };

  const handleDeleteComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="w-full space-y-4 pt-2">
      {/* Profile Likes & Comments Count Header Bar */}
      <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-mono text-muted">
          <MessageSquare className="h-4 w-4" />
          <span>{comments.length} Guestbook Notes</span>
        </div>

        <button
          onClick={handleToggleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all duration-150 active:scale-95 ${
            hasLiked
              ? 'border-rose-500/50 bg-rose-500/10 text-rose-400 font-bold'
              : 'border-white/10 bg-white/5 text-muted hover:text-rose-400 hover:border-rose-500/30'
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500 animate-pulse' : ''}`} />
          <span>{likes}</span>
        </button>
      </div>

      {/* Guestbook Comments List & Form */}
      <div className="p-4 rounded-xl border border-white/10 bg-surface/80 backdrop-blur-md space-y-4">
        <div className="text-xs font-mono uppercase tracking-wider text-muted">
          Profile Guestbook
        </div>

        {/* Input box */}
        {currentUser ? (
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder={`Leave a note as @${currentUser.username}...`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 rounded-md border border-white/10 bg-elevated px-3 py-1.5 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
              maxLength={200}
            />
            <Button size="sm" type="submit" className="h-8 px-3 text-xs gap-1">
              <Send className="h-3 w-3" /> Post
            </Button>
          </form>
        ) : (
          <div className="p-3 rounded-lg border border-dashed border-white/10 bg-white/5 text-center text-xs text-muted flex items-center justify-between">
            <span>You need an account to leave a guestbook note.</span>
            <Link href="/login">
              <Button size="sm" variant="outline" className="text-xs h-7">
                Sign in
              </Button>
            </Link>
          </div>
        )}

        {/* Comments Feed */}
        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {comments.length === 0 ? (
            <div className="text-center py-4 text-xs font-mono text-muted">
              No notes yet. Be the first to leave a mark.
            </div>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                className="group relative p-2.5 rounded-lg border border-white/5 bg-elevated/40 text-xs space-y-1 transition-colors hover:border-white/15"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">
                      {c.authorDisplayName}
                    </span>
                    {c.authorIsVerified && (
                      <CheckCircle2 className="h-3 w-3 text-accent" />
                    )}
                    <span className="text-[10px] font-mono text-muted">
                      @{c.authorUsername}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted">
                      {c.createdAt}
                    </span>
                    {currentUser?.username === c.authorUsername && (
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete note"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-muted text-[11px] leading-relaxed break-words">
                  {c.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

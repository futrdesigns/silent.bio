'use client';

import * as React from 'react';
import Link from 'next/link';
import { ProfileCommentRecord } from '@/lib/types/profile';
import { MessageSquare, Send, CheckCircle2, Trash2, X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
  username: string;
  accentColor: string;
  comments: ProfileCommentRecord[];
  onAddComment: (comment: ProfileCommentRecord) => void;
  onDeleteComment: (commentId: string) => void;
}

export function ProfileCommentsModal({
  isOpen,
  onClose,
  profileId,
  username,
  accentColor,
  comments,
  onAddComment,
  onDeleteComment,
}: ProfileCommentsModalProps) {
  const [commentText, setCommentText] = React.useState('');
  const [currentUser, setCurrentUser] = React.useState<{ username: string; displayName: string } | null>(null);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('silent_bio_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Handle ESC key to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
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

    onAddComment(newComment);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in select-none">
      {/* Background click dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/15 bg-surface/95 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        style={{
          boxShadow: `0 20px 50px -10px rgba(0,0,0,0.8), 0 0 30px ${accentColor}20`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-elevated/40">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-accent" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              Profile Guestbook
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted">
              @{username}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted hover:text-foreground hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Comments Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {comments.length === 0 ? (
            <div className="text-center py-12 text-muted text-xs font-mono">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30 text-accent" />
              <span>No notes yet. Be the first to leave your mark!</span>
            </div>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                className="group flex flex-col p-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm space-y-1.5 transition-all hover:border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-foreground">
                      {c.authorDisplayName}
                    </span>
                    <span className="text-[11px] font-mono text-muted">
                      @{c.authorUsername}
                    </span>
                    {c.authorIsVerified && (
                      <CheckCircle2 className="h-3 w-3 text-accent" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted">{c.createdAt}</span>
                    {currentUser && currentUser.username === c.authorUsername && (
                      <button
                        onClick={() => onDeleteComment(c.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted hover:text-danger p-0.5 transition-opacity"
                        title="Delete note"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed font-sans select-text">
                  {c.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Bottom Post Form */}
        <div className="p-4 border-t border-white/10 bg-elevated/40">
          {currentUser ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder={`Leave a note as @${currentUser.username}...`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 rounded-lg border border-white/10 bg-surface px-3 py-2 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-accent font-sans"
                maxLength={200}
                required
              />
              <Button size="sm" type="submit" className="h-9 px-3 text-xs gap-1 font-mono">
                <Send className="h-3 w-3" />
                <span>Post</span>
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-white/10 bg-white/5 text-xs">
              <div className="flex items-center gap-2 text-muted">
                <Lock className="h-3.5 w-3.5 text-accent" />
                <span>Sign in to post a note</span>
              </div>
              <Link
                href="/login"
                className="text-accent hover:underline font-mono text-xs font-semibold"
              >
                Log In →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
